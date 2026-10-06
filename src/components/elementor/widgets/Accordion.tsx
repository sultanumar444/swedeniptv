"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Elementor accordion/toggle. Accordion keeps one item open (the first, like
 * Elementor's default); toggle lets every item open independently, all closed.
 */
export default function Accordion({
  kind,
  items,
  iconAlign,
  iconClosed,
  iconOpened,
}: {
  kind: "accordion" | "toggle";
  items: { q: string; a: string }[];
  iconAlign: "left" | "right";
  iconClosed: ReactNode;
  iconOpened: ReactNode;
}) {
  const uid = useId();
  const [open, setOpen] = useState<number[]>(kind === "accordion" ? [0] : []);

  const toggle = (i: number) =>
    setOpen((cur) => {
      if (cur.includes(i)) return cur.filter((x) => x !== i);
      return kind === "accordion" ? [i] : [...cur, i];
    });

  return (
    <div className={`elementor-${kind}`}>
      {items.map((item, i) => {
        const active = open.includes(i);
        const titleId = `${uid}-title-${i}`;
        const contentId = `${uid}-content-${i}`;
        return (
          <div key={i} className={`elementor-${kind}-item`}>
            <div
              id={titleId}
              className={`elementor-tab-title${active ? " elementor-active" : ""}`}
              role="button"
              tabIndex={0}
              aria-expanded={active}
              aria-controls={contentId}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggle(i);
                }
              }}
            >
              {(iconClosed || iconOpened) && (
                <span className={`elementor-${kind}-icon elementor-${kind}-icon-${iconAlign}`} aria-hidden="true">
                  <span className={`elementor-${kind}-icon-closed`}>{iconClosed}</span>
                  <span className={`elementor-${kind}-icon-opened`}>{iconOpened}</span>
                </span>
              )}
              {/* An <a> like Elementor's markup, so the original title styles match. */}
              <a className={`elementor-${kind}-title`} tabIndex={-1}>
                {item.q}
              </a>
            </div>
            <div
              id={contentId}
              className={`elementor-tab-content elementor-clearfix${active ? " elementor-active" : ""}`}
              role="region"
              aria-labelledby={titleId}
              style={{ display: active ? "block" : "none" }}
              dangerouslySetInnerHTML={{ __html: item.a }}
            />
          </div>
        );
      })}
    </div>
  );
}
