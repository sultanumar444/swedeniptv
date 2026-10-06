import * as brands from "@fortawesome/free-brands-svg-icons";
import * as regular from "@fortawesome/free-regular-svg-icons";
import * as solid from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import type { IconRef } from "@/lib/wp/types";

/** Elementor's own icon font (eicons) mapped to the closest Font Awesome glyph. */
const EICONS: Record<string, string> = {
  "eicon-cart-medium": "fas fa-shopping-cart",
  "eicon-chevron-right": "fas fa-chevron-right",
  "eicon-chevron-left": "fas fa-chevron-left",
  "eicon-menu-bar": "fas fa-bars",
  "eicon-close": "fas fa-times",
};

const PACKS: Record<string, Record<string, unknown>> = { fas: solid, far: regular, fab: brands, fa: solid };

function lookup(ref: string): IconDefinition | null {
  const [pack, name] = (EICONS[ref] ?? ref).split(" ");
  if (!name) return null;
  const key = "fa" + name.replace(/^fa-/, "").replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase());
  const icon = (PACKS[pack] ?? solid)[key] ?? solid[key as keyof typeof solid];
  return (icon as IconDefinition) ?? null;
}

/**
 * Renders Font Awesome icons as inline SVG, the same way Elementor does with
 * "inline font icons" enabled, so the original CSS sizing rules apply.
 */
export default function Icon({ icon, className }: { icon: IconRef; className?: string }) {
  if (!icon) return null;
  if (typeof icon === "object") {
    return <span className={className} dangerouslySetInnerHTML={{ __html: icon.svg }} />;
  }
  const def = lookup(icon);
  if (!def) return null;
  const [w, h, , , path] = def.icon;
  const name = icon.split(" ")[1] ?? "";
  return (
    <svg
      aria-hidden="true"
      className={`e-font-icon-svg e-${icon.split(" ")[0]}-${name.replace(/^fa-/, "")} ${className ?? ""}`.trim()}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.isArray(path) ? path.map((d) => <path key={d} d={d} />) : <path d={path} />}
    </svg>
  );
}
