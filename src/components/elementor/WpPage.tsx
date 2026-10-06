import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/site";
import { getAllPosts, getPage, pageTemplate } from "@/lib/wp/content";
import type { WpSeo } from "@/lib/wp/types";
import ElementorDocument from "./Render";

/** Metadata migrated from Yoast SEO. */
export function seoMetadata(seo: WpSeo, fallbackTitle: string, path: string): Metadata {
  const title = seo.title || `${fallbackTitle} - ${siteName}`;
  const description = seo.description || undefined;
  const canonical = seo.canonical || path;
  const image = seo.ogImage ?? "/wp-content/uploads/2024/12/sweden-iptv-1024x318.png-1.webp";
  const noindex = seo.robots?.index === "noindex";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: seo.robots?.follow !== "nofollow" } : undefined,
    openGraph: {
      type: seo.ogType === "article" ? "article" : "website",
      locale: "sv_SE",
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: canonical,
      siteName,
      images: [{ url: image }],
      ...(seo.ogType === "article" && { publishedTime: seo.published, modifiedTime: seo.modified }),
    },
    twitter: { card: "summary_large_image", title: seo.ogTitle || title, description: seo.ogDescription || description, images: [image] },
  };
}

export function JsonLd({ data }: { data: unknown }) {
  if (!data) return null;
  const json = JSON.stringify(data).replaceAll("https://swedeniptv.net", siteUrl).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export function wpPageMetadata(slug: string): Metadata {
  const page = getPage(slug);
  return seoMetadata(page.seo, page.title, `/${slug}/`);
}

/**
 * A migrated WordPress page. Pages other than the home page sit inside the
 * site's "single page" template (title banner + breadcrumb).
 * The page's own Elementor stylesheet is imported by its route file.
 */
export default function WpPage({ slug, bare = false }: { slug: string; bare?: boolean }) {
  const page = getPage(slug);
  const ctx = { title: page.title, path: `/${slug}/`, posts: getAllPosts() };
  const body = <ElementorDocument id={page.template} type="wp-page" nodes={page.tree} ctx={ctx} />;
  return (
    <>
      <JsonLd data={page.seo.schema} />
      {bare ? body : <ElementorDocument id={pageTemplate.template} type="single-page" nodes={pageTemplate.tree} ctx={{ ...ctx, content: body }} className="elementor-location-single" />}
    </>
  );
}
