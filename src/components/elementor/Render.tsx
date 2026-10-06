import type { ReactNode } from "react";
import Link from "next/link";
import { Fragment } from "react";
import { mapHref, mapHtmlLinks } from "@/lib/wp/href";
import type {
  AccordionNode,
  ColumnNode,
  SectionNode,
  WidgetNode,
  WpNode,
  WpPostData,
  WpPostMeta,
} from "@/lib/wp/types";
import cardIds from "@/content/wp/cards.json";
import { deviceGuides } from "@/content/install-guides";
import Icon from "./Icon";
import Accordion from "./widgets/Accordion";
import Carousel from "./widgets/Carousel";
import ContactForm from "./widgets/ContactForm";
import NavMenu from "./widgets/NavMenu";
import PostsGrid from "./widgets/PostsGrid";
import TableOfContents from "./widgets/TableOfContents";
import { POST_AUTHOR, formatPostDate, formatPostTime } from "@/lib/wp/content";

export type RenderContext = {
  /** Title shown by "page title" widgets. */
  title?: string;
  /** Breadcrumb trail after "Home". */
  breadcrumb?: { label: string; href?: string }[];
  /** Slot rendered where the template has a "post content" widget. */
  content?: ReactNode;
  /** Current post, for post templates. */
  post?: WpPostData;
  /** Headings found in the post body, for the table of contents. */
  headings?: { id: string; text: string; level: number }[];
  /** All posts, for "posts" widgets. */
  posts?: WpPostMeta[];
  /** Path of the current page, for active menu items. */
  path?: string;
};

/** Columns/widgets styled as cards in WordPress (border, background or shadow); they get hover effects. */
const CARDS = new Set<string>(cardIds);

const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" ");

function Html({ html, as: Tag = "div", className }: { html: string; as?: "div" | "span" | "p"; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: mapHtmlLinks(html) }} />;
}

/** Plain <img>: Elementor's stylesheets size images through the img element itself. */
function Img({ src, alt, w, h, className, eager }: { src?: string | null; alt?: string; w?: number | null; h?: number | null; className?: string; eager?: boolean }) {
  if (!src) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt ?? ""}
      width={w ?? undefined}
      height={h ?? undefined}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

function Section({ node, ctx }: { node: SectionNode; ctx: RenderContext }) {
  return (
    <section
      className={cx("elementor-section elementor-element", `elementor-element-${node.id}`, ...node.cls)}
      data-id={node.id}
      data-element_type="section"
    >
      {node.overlay && <div className="elementor-background-overlay" />}
      <div className={cx("elementor-container", node.gap)}>
        <Nodes nodes={node.children} ctx={ctx} />
      </div>
    </section>
  );
}

function Column({ node, ctx }: { node: ColumnNode; ctx: RenderContext }) {
  return (
    <div
      className={cx("elementor-column elementor-element", `elementor-element-${node.id}`, CARDS.has(node.id) && "wp-card", ...node.cls)}
      data-id={node.id}
      data-element_type="column"
    >
      <div className={cx("elementor-widget-wrap", node.populated && "elementor-element-populated")}>
        {node.overlay && <div className="elementor-background-overlay" />}
        <Nodes nodes={node.children} ctx={ctx} />
      </div>
    </div>
  );
}

/** Extra widget classes Elementor adds for widgets that extend another widget. */
const EXTRA_CLASSES: Record<string, string> = {
  "theme-page-title": "elementor-page-title elementor-widget-heading",
  "theme-post-title": "elementor-page-title elementor-widget-heading",
  "theme-post-featured-image": "elementor-widget-image",
  "post-content": "elementor-widget-theme-post-content",
};

function Widget({ node, ctx }: { node: WidgetNode; ctx: RenderContext }) {
  const type = node.t === "post-content" ? "theme-post-content" : node.t;
  const inner = widgetBody(node, ctx);
  if (inner === null) return null;
  const widgetType = node.t === "posts" ? `posts.${node.skin}` : `${type}.default`;
  return (
    <div
      className={cx(
        "elementor-element",
        `elementor-element-${node.id}`,
        "elementor-widget",
        `elementor-widget-${type}`,
        EXTRA_CLASSES[node.t],
        CARDS.has(node.id) && "wp-card",
        ...node.cls,
      )}
      data-id={node.id}
      data-element_type="widget"
      data-widget_type={widgetType}
    >
      <div className="elementor-widget-container">{inner}</div>
    </div>
  );
}

function widgetBody(node: WidgetNode, ctx: RenderContext): ReactNode {
  switch (node.t) {
    case "heading": {
      const Tag = node.tag as "h2";
      const className = cx("elementor-heading-title", node.size ?? "elementor-size-default");
      // Headings can carry inline markup from WordPress (e.g. the plan price + <sub> period).
      const html = { __html: mapHtmlLinks(node.html) };
      return node.href ? (
        <Tag className={className}>
          { }
          <a href={mapHref(node.href)} dangerouslySetInnerHTML={html} />
        </Tag>
      ) : (
        <Tag className={className} dangerouslySetInnerHTML={html} />
      );
    }
    case "text-editor":
      return <Html html={node.html} />;
    case "button": {
      const icon = node.icon ? (
        <span className="elementor-button-icon">
          <Icon icon={node.icon} />
        </span>
      ) : null;
      return (
        <div className="elementor-button-wrapper">
          <a className={cx("elementor-button elementor-button-link", node.size ?? "elementor-size-sm")} href={mapHref(node.href)}>
            <span className="elementor-button-content-wrapper">
              {!node.iconAfter && icon}
              <span className="elementor-button-text">{node.text}</span>
              {node.iconAfter && icon}
            </span>
          </a>
        </div>
      );
    }
    case "image": {
      const img = <Img src={node.src} alt={node.alt} w={node.w} h={node.h} />;
      const linked = node.href ? <a href={mapHref(node.href)}>{img}</a> : img;
      return node.caption ? (
        <figure className="wp-caption">
          {linked}
          <figcaption className="widget-image-caption wp-caption-text">{node.caption}</figcaption>
        </figure>
      ) : (
        linked
      );
    }
    case "icon-box": {
      const Title = node.titleTag as "h3";
      const href = node.href ? mapHref(node.href) : null;
      return (
        <div className="elementor-icon-box-wrapper">
          {node.icon && (
            <div className="elementor-icon-box-icon">
              {href ? (
                <a href={href} className="elementor-icon" tabIndex={-1}>
                  <Icon icon={node.icon} />
                </a>
              ) : (
                <span className="elementor-icon">
                  <Icon icon={node.icon} />
                </span>
              )}
            </div>
          )}
          <div className="elementor-icon-box-content">
            <Title className="elementor-icon-box-title">
              {href ? <a href={href}>{node.title}</a> : <span>{node.title}</span>}
            </Title>
            {node.desc && <Html as="p" className="elementor-icon-box-description" html={node.desc} />}
          </div>
        </div>
      );
    }
    case "image-box": {
      const Title = node.titleTag as "h3";
      const href = node.href ? mapHref(node.href) : null;
      const img = <Img src={node.src} alt={node.alt} w={node.w} h={node.h} />;
      return (
        <div className="elementor-image-box-wrapper">
          {node.src && <figure className="elementor-image-box-img">{href ? <a href={href} tabIndex={-1}>{img}</a> : img}</figure>}
          <div className="elementor-image-box-content">
            {node.title && <Title className="elementor-image-box-title">{href ? <a href={href}>{node.title}</a> : node.title}</Title>}
            {node.desc && <Html as="p" className="elementor-image-box-description" html={node.desc} />}
          </div>
        </div>
      );
    }
    case "icon-list":
      return (
        <ul className={cx("elementor-icon-list-items", node.inline && "elementor-inline-items")}>
          {node.items.map((item, i) => {
            const body = (
              <>
                {item.icon && (
                  <span className="elementor-icon-list-icon">
                    <Icon icon={item.icon} />
                  </span>
                )}
                <span className="elementor-icon-list-text">{item.text}</span>
              </>
            );
            return (
              <li key={i} className={cx("elementor-icon-list-item", node.inline && "elementor-inline-item")}>
                {item.href ? <a href={mapHref(item.href)}>{body}</a> : body}
              </li>
            );
          })}
        </ul>
      );
    case "accordion":
    case "toggle":
      return <AccordionWidget node={node} />;
    case "image-carousel":
      return (
        <Carousel
          settings={node.settings}
          prevIcon={<Icon icon="fas fa-chevron-left" />}
          nextIcon={<Icon icon="fas fa-chevron-right" />}
          slides={node.slides.map((s, i) => {
            const img = <Img src={s.src} alt={s.alt} className="swiper-slide-image" />;
            return (
              <figure key={i} className="swiper-slide-inner">
                {s.href ? <a href={mapHref(s.href)}>{img}</a> : img}
              </figure>
            );
          })}
        />
      );
    case "spacer":
      return (
        <div className="elementor-spacer">
          <div className="elementor-spacer-inner" />
        </div>
      );
    case "divider":
      return (
        <div className="elementor-divider">
          <span className="elementor-divider-separator">{node.text}</span>
        </div>
      );
    case "form":
      return <ContactForm fields={node.fields} button={node.button} />;
    case "posts":
      return (
        <PostsGrid
          posts={(ctx.posts ?? []).filter((p) => p.slug !== ctx.post?.slug)}
          perPage={node.count || 3}
          loadMore={node.settings.pagination_type === "load_more_on_click"}
        />
      );
    case "nav-menu":
      return <NavMenu items={node.items.map((i) => withSubmenu({ ...i, href: mapHref(i.href) }))} activePath={ctx.path} />;
    case "woocommerce-menu-cart":
      return <CartButton />;
    case "theme-page-title": {
      const Tag = (node.tag ?? "h1") as "h1";
      return <Tag className="elementor-heading-title elementor-size-default">{ctx.title}</Tag>;
    }
    case "theme-post-title":
      return <h1 className="elementor-heading-title elementor-size-default">{ctx.post?.title ?? ctx.title}</h1>;
    case "woocommerce-breadcrumb":
      return (
        <nav className="woocommerce-breadcrumb" aria-label="Breadcrumb">
          <Link href="/streamingtv/">Hem</Link>
          {(ctx.breadcrumb ?? [{ label: ctx.title ?? "" }]).map((b, i) => (
            <Fragment key={i}>
              {" / "}
              {b.href ? <a href={b.href}>{b.label}</a> : b.label}
            </Fragment>
          ))}
        </nav>
      );
    case "theme-post-featured-image": {
      const f = ctx.post?.featured;
      if (!f) return null;
      const img = f.large ?? { src: f.src, w: f.w, h: f.h };
      return <Img src={img.src} alt={f.alt} w={img.w} h={img.h} eager />;
    }
    case "post-content":
      return ctx.content ?? null;
    case "post-info": {
      const p = ctx.post;
      if (!p) return null;
      return (
        <ul className="elementor-inline-items elementor-icon-list-items elementor-post-info">
          {node.items.map((item, i) => {
            const value = item.type === "author" ? POST_AUTHOR : item.type === "date" ? formatPostDate(p.date) : item.type === "time" ? formatPostTime(p.date) : null;
            if (!value) return null;
            return (
              <li key={i} className="elementor-icon-list-item elementor-inline-item">
                <span className="elementor-icon-list-icon">
                  <Icon icon={item.icon} />
                </span>
                <span className={`elementor-icon-list-text elementor-post-info__item elementor-post-info__item--type-${item.type}`}>
                  {item.type === "author" ? value : <time dateTime={p.date}>{value}</time>}
                </span>
              </li>
            );
          })}
        </ul>
      );
    }
    case "table-of-contents":
      return (
        <TableOfContents
          title={node.title}
          headings={ctx.headings ?? []}
          openIcon={<Icon icon="fas fa-chevron-down" />}
          closeIcon={<Icon icon="fas fa-chevron-up" />}
        />
      );
    case "author-box":
      return (
        <div className="elementor-author-box">
          {node.src && (
            <a className="elementor-author-box__avatar" href={node.href ?? "#"} target="_blank" rel="noopener">
              <Img src={node.src} alt={node.alt} w={300} h={300} />
            </a>
          )}
          <div className="elementor-author-box__text">
            <a href={node.href ?? "#"} target="_blank" rel="noopener">
              <h4 className="elementor-author-box__name">{node.name}</h4>
            </a>
            <Html className="elementor-author-box__bio" html={node.bio} />
          </div>
        </div>
      );
    default:
      return null;
  }
}

function AccordionWidget({ node }: { node: AccordionNode }) {
  return (
    <Accordion
      kind={node.t}
      items={node.items.map((it) => ({ q: it.q, a: mapHtmlLinks(it.a) }))}
      iconAlign={node.iconAlign}
      iconClosed={node.iconClosed ? <Icon icon={node.iconClosed} /> : null}
      iconOpened={node.iconOpened ? <Icon icon={node.iconOpened} /> : null}
    />
  );
}

/** "Instruktioner" in the main menu gets a dropdown with every device guide. */
function withSubmenu(item: { text: string; href: string }) {
  if (item.href !== "/installationsguider/") return item;
  return {
    ...item,
    children: deviceGuides.map((g) => ({ text: g.name, href: mapHref(g.href ?? `/installationsguider/${g.slug}/`) })),
  };
}

/** Replaces the WooCommerce mini-cart ("Varukorg"); there is no cart, so it links to the plans. */
function CartButton() {
  return (
    <div className="elementor-menu-cart__wrapper">
      <div className="elementor-menu-cart__toggle_wrapper">
        <div className="elementor-menu-cart__toggle elementor-button-wrapper">
          <Link className="elementor-menu-cart__toggle_button elementor-button elementor-size-sm" href="/streaming-plans/">
            <span className="elementor-button-text">Varukorg</span>
            <span className="elementor-button-icon">
              <Icon icon="eicon-cart-medium" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Nodes({ nodes, ctx }: { nodes: WpNode[]; ctx: RenderContext }) {
  return (
    <>
      {nodes.map((node) => {
        if (node.t === "section") return <Section key={node.id} node={node} ctx={ctx} />;
        if (node.t === "column") return <Column key={node.id} node={node} ctx={ctx} />;
        return <Widget key={node.id} node={node} ctx={ctx} />;
      })}
    </>
  );
}

/** One Elementor document (page, header, footer or template). */
export default function ElementorDocument({
  id,
  type,
  nodes,
  ctx,
  className,
}: {
  id: string;
  type: string;
  nodes: WpNode[];
  ctx: RenderContext;
  className?: string;
}) {
  return (
    <div data-elementor-type={type} data-elementor-id={id} className={cx("elementor", `elementor-${id}`, className)}>
      <Nodes nodes={nodes} ctx={ctx} />
    </div>
  );
}
