import Link from "next/link";
import ElementorDocument from "@/components/elementor/Render";
import { pageTemplate } from "@/lib/wp/content";
import { siteUrl } from "@/lib/site";

/**
 * Sidhuvud för installationsguiderna. Använder samma titelbanner som resten
 * av webbplatsen (WordPress-mallen "single page": bakgrundsbild, titel och
 * brödsmulor), så att guiderna ser likadana ut som övriga sidor.
 */
export default function PageTitleBar({
  title,
  description,
  ctaLabel,
  ctaHref,
  scrollHint,
  path,
}: {
  title: string;
  description?: string;
  /** Valfri CTA-knapp under bannern. */
  ctaLabel?: string;
  ctaHref?: string;
  /** Valfri rad under CTA-knappen, t.ex. en scroll-hint. */
  scrollHint?: string;
  /**
   * Sidans sökväg, t.ex. "/installationsguider/apple-tv". Används för
   * brödsmulorna och strukturerad data (BreadcrumbList).
   */
  path?: string;
}) {
  const trail: { label: string; href?: string }[] = [];
  if (path && path.replace(/\/$/, "") !== "/installationsguider") {
    trail.push({ label: "Installationsguider", href: "/installationsguider/" });
  }
  trail.push({ label: title });

  const breadcrumbSchema = path
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Hem", item: `${siteUrl}/streamingtv/` },
          ...trail.map((t, i) => ({
            "@type": "ListItem",
            position: i + 2,
            name: t.label,
            item: `${siteUrl}${t.href ?? `${path.replace(/\/$/, "")}/`}`,
          })),
        ],
      }
    : null;

  // Only the banner section of the template; the page body follows below.
  const banner = pageTemplate.tree.slice(0, 1);

  return (
    <>
      {breadcrumbSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      )}
      <ElementorDocument
        id={pageTemplate.template}
        type="single-page"
        nodes={banner}
        className="elementor-location-single"
        ctx={{ title, breadcrumb: trail }}
      />
      {(description || (ctaLabel && ctaHref) || scrollHint) && (
        <div className="mx-auto max-w-4xl px-6 pt-14 text-center">
          {description && <p className="text-white/80">{description}</p>}
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="mt-6 inline-block rounded-lg bg-button px-8 py-4 font-semibold text-white transition-colors"
            >
              {ctaLabel}
            </Link>
          )}
          {scrollHint && <p className="mt-4 text-sm text-white/60">{scrollHint}</p>}
        </div>
      )}
    </>
  );
}
