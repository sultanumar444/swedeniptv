/**
 * Content tree extracted from the original WordPress/Elementor site.
 * Every node keeps the Elementor element id so the generated per-template
 * stylesheets in `src/styles/elementor` keep applying.
 */

export type IconRef = string | { svg: string } | null | undefined;

type Base = { id: string; cls: string[] };

export type SectionNode = Base & {
  t: "section";
  gap: string | null;
  overlay: boolean;
  video?: string;
  children: WpNode[];
};

export type ColumnNode = Base & {
  t: "column";
  populated: boolean;
  overlay: boolean;
  children: WpNode[];
};

export type HeadingNode = Base & { t: "heading"; tag: string; size: string | null; html: string; href?: string };
export type TextNode = Base & { t: "text-editor"; html: string };
export type ButtonNode = Base & {
  t: "button";
  text: string;
  href: string | null;
  size: string | null;
  icon?: IconRef;
  iconAfter?: boolean;
};
export type ImageNode = Base & {
  t: "image";
  src?: string;
  alt?: string;
  w?: number | null;
  h?: number | null;
  href?: string;
  caption?: string;
};
export type IconBoxNode = Base & { t: "icon-box"; icon: IconRef; titleTag: string; title: string; desc: string; href?: string };
export type ImageBoxNode = Base & {
  t: "image-box";
  src: string | null;
  alt: string;
  w: number | null;
  h: number | null;
  titleTag: string;
  title: string;
  desc: string;
  href?: string;
};
export type IconListNode = Base & {
  t: "icon-list";
  inline: boolean;
  items: { icon: IconRef; text: string; href: string | null }[];
};
export type AccordionNode = Base & {
  t: "accordion" | "toggle";
  items: { q: string; a: string }[];
  iconAlign: "left" | "right";
  iconClosed: IconRef;
  iconOpened: IconRef;
  titleTag: string;
};
export type CarouselNode = Base & {
  t: "image-carousel";
  slides: { src: string; alt: string; href: string | null }[];
  settings: Record<string, unknown>;
};
export type SimpleNode = Base & { t: "spacer" | "divider"; text?: string | null };
export type FormNode = Base & {
  t: "form";
  fields: {
    tag: string;
    type: string;
    name: string;
    label: string;
    placeholder: string;
    required: boolean;
    cls: string[];
    rows: string | null;
  }[];
  button: string;
};
export type PostsNode = Base & {
  t: "posts";
  settings: Record<string, unknown>;
  skin: string;
  count: number;
  pagination: boolean;
};
export type NavMenuNode = Base & { t: "nav-menu"; items: { text: string; href: string }[] };
export type PostInfoNode = Base & { t: "post-info"; items: { type: string; icon: IconRef }[] };
export type TocNode = Base & { t: "table-of-contents"; title: string; settings: Record<string, unknown> };
export type AuthorBoxNode = Base & { t: "author-box"; name: string; bio: string; src: string | null; alt: string; href: string | null };
export type ThemeNode = Base & {
  t:
    | "theme-page-title"
    | "theme-post-title"
    | "woocommerce-breadcrumb"
    | "theme-post-featured-image"
    | "post-content"
    | "woocommerce-menu-cart";
  tag?: string;
};

export type WidgetNode =
  | HeadingNode
  | TextNode
  | ButtonNode
  | ImageNode
  | IconBoxNode
  | ImageBoxNode
  | IconListNode
  | AccordionNode
  | CarouselNode
  | SimpleNode
  | FormNode
  | PostsNode
  | NavMenuNode
  | PostInfoNode
  | TocNode
  | AuthorBoxNode
  | ThemeNode;

export type WpNode = SectionNode | ColumnNode | WidgetNode;

export type WpSeo = {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: Record<string, string>;
  ogType?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string | null;
  published?: string;
  modified?: string;
  schema?: unknown;
};

export type WpTemplate = { template: string; tree: WpNode[] };

export type WpPageData = WpTemplate & { slug: string; title: string; seo: WpSeo };

export type WpImage = { src: string; w: number; h: number };

export type WpPostMeta = {
  slug: string;
  title: string;
  date: string;
  modified: string;
  author: string;
  excerpt: string;
  categories: string[];
  featured: {
    src: string;
    alt: string;
    w: number | null;
    h: number | null;
    medium: WpImage | null;
    large: WpImage | null;
  };
};

export type WpPostData = WpPostMeta & {
  seo: WpSeo;
  /** Gutenberg posts: cleaned HTML body. */
  html?: string;
  /** Elementor posts: their own layout tree + template id. */
  template?: string;
  tree?: WpNode[];
};
