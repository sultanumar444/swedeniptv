"use client";

import { useState, type ReactNode } from "react";

type Heading = { id: string; text: string; level: number };

/** Nest headings by level (h2 > h3 > ...), like Elementor's hierarchical view. */
function tree(headings: Heading[]) {
  type Node = Heading & { children: Node[] };
  const root: Node[] = [];
  const stack: Node[] = [];
  for (const h of headings) {
    const node: Node = { ...h, children: [] };
    while (stack.length && stack[stack.length - 1].level >= h.level) stack.pop();
    (stack.length ? stack[stack.length - 1].children : root).push(node);
    stack.push(node);
  }
  return root;
}

function List({ nodes, top }: { nodes: ReturnType<typeof tree>; top: boolean }) {
  return (
    <ol className="elementor-toc__list-wrapper">
      {nodes.map((n) => (
        <li key={n.id} className="elementor-toc__list-item">
          <div className="elementor-toc__list-item-text-wrapper">
            <a href={`#${n.id}`} className={`elementor-toc__list-item-text${top ? " elementor-toc__top-level" : ""}`}>
              {n.text}
            </a>
          </div>
          {n.children.length > 0 && <List nodes={n.children} top={false} />}
        </li>
      ))}
    </ol>
  );
}

export default function TableOfContents({
  title,
  headings,
  openIcon,
  closeIcon,
}: {
  title: string;
  headings: Heading[];
  openIcon: ReactNode;
  closeIcon: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <div className="elementor-toc__header">
        <h4 className="elementor-toc__header-title">{title}</h4>
        <div
          className="elementor-toc__toggle-button elementor-toc__toggle-button--expand"
          role="button"
          tabIndex={0}
          aria-label="Visa innehållsförteckning"
          style={{ display: collapsed ? "block" : "none" }}
          onClick={() => setCollapsed(false)}
        >
          {openIcon}
        </div>
        <div
          className="elementor-toc__toggle-button elementor-toc__toggle-button--collapse"
          role="button"
          tabIndex={0}
          aria-label="Dölj innehållsförteckning"
          style={{ display: collapsed ? "none" : "block" }}
          onClick={() => setCollapsed(true)}
        >
          {closeIcon}
        </div>
      </div>
      <div className="elementor-toc__body" style={collapsed ? { display: "none" } : undefined}>
        {headings.length ? <List nodes={tree(headings)} top /> : <div className="elementor-toc__no-headings">Inga rubriker hittades.</div>}
      </div>
    </>
  );
}
