"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export type NavItem = { text: string; href: string; children?: NavItem[] };

function isActive(href: string, path: string) {
  if (href === "/streamingtv/") return path === "/" || path === "/streamingtv/";
  return path === href || (href !== "/" && path.startsWith(href));
}

/**
 * Elementor Pro nav menu: horizontal menu on desktop, burger + full-width
 * ("stretch") dropdown on mobile. Same markup as Elementor so its CSS applies.
 */
export default function NavMenu({ items, activePath }: { items: NavItem[]; activePath?: string }) {
  const pathname = usePathname() || activePath || "/";
  // The menu belongs to the page it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const toggle = () => setOpenOn(open ? null : pathname);
  // Sub-menus expanded in the mobile dropdown.
  const [expanded, setExpanded] = useState<string[]>([]);
  const [stretch, setStretch] = useState<{ left: number; width: number } | null>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const measure = () => {
      const widget = toggleRef.current?.parentElement;
      if (!widget) return;
      const rect = widget.getBoundingClientRect();
      setStretch({ left: -rect.left, width: document.documentElement.clientWidth });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [open]);

  const caret = (
    <span className="sub-arrow" aria-hidden="true">
      <svg className="e-font-icon-svg e-fas-caret-down" viewBox="0 0 320 512">
        <path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" />
      </svg>
    </span>
  );

  const list = (dropdown: boolean) => (
    <ul className="elementor-nav-menu">
      {items.map((item) => {
        const active = isActive(item.href, pathname);
        const hasChildren = !!item.children?.length;
        const isExpanded = expanded.includes(item.href);
        const hidden = dropdown && !open;
        return (
          <li
            key={item.href + item.text}
            className={`menu-item${hasChildren ? " menu-item-has-children" : ""}${active ? " current-menu-item" : ""}${isExpanded ? " is-expanded" : ""}`}
          >
            <a
              href={item.href}
              className={`elementor-item${hasChildren ? " has-submenu" : ""}${active ? " elementor-item-active" : ""}`}
              aria-current={active ? "page" : undefined}
              aria-haspopup={hasChildren || undefined}
              tabIndex={hidden ? -1 : undefined}
            >
              {item.text}
              {hasChildren && !dropdown && caret}
            </a>
            {hasChildren && dropdown && (
              <button
                type="button"
                className="submenu-toggle"
                aria-label={`Visa ${item.text}`}
                aria-expanded={isExpanded}
                tabIndex={hidden ? -1 : undefined}
                onClick={() => setExpanded((cur) => (cur.includes(item.href) ? cur.filter((h) => h !== item.href) : [...cur, item.href]))}
              >
                {caret}
              </button>
            )}
            {hasChildren && (
              <ul className="sub-menu elementor-nav-menu--dropdown">
                {item.children!.map((child) => {
                  const childActive = pathname === child.href;
                  return (
                    <li key={child.href} className={`menu-item${childActive ? " current-menu-item" : ""}`}>
                      <a
                        href={child.href}
                        className={`elementor-sub-item${childActive ? " elementor-item-active" : ""}`}
                        tabIndex={hidden || (dropdown && !isExpanded) ? -1 : undefined}
                      >
                        {child.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <nav aria-label="Menu" className="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-underline e--animation-fade">
        {list(false)}
      </nav>
      <div
        ref={toggleRef}
        className={`elementor-menu-toggle${open ? " elementor-active" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Menu Toggle"
        aria-expanded={open}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
      >
        <svg aria-hidden="true" className="elementor-menu-toggle__icon--open e-font-icon-svg e-eicon-menu-bar" viewBox="0 0 1000 1000">
          <path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z" />
        </svg>
        <svg aria-hidden="true" className="elementor-menu-toggle__icon--close e-font-icon-svg e-eicon-close" viewBox="0 0 1000 1000">
          <path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z" />
        </svg>
      </div>
      <nav
        className="elementor-nav-menu--dropdown elementor-nav-menu__container"
        aria-hidden={!open}
        style={stretch ? { top: "100%", left: stretch.left, width: stretch.width, maxWidth: stretch.width, position: "absolute" } : undefined}
      >
        {list(true)}
      </nav>
    </>
  );
}
