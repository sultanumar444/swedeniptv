import { notFound } from "next/navigation";
import ElementorDocument from "@/components/elementor/Render";
import { JsonLd, seoMetadata } from "@/components/elementor/WpPage";
import { getAllPosts, getPost, pageTemplate, postTemplate, withHeadingAnchors } from "@/lib/wp/content";
import { mapHtmlLinks } from "@/lib/wp/href";
import type { WpNode } from "@/lib/wp/types";
// Three older posts were laid out with Elementor directly.
import "@/styles/elementor/post-2133.css";
import "@/styles/elementor/post-469.css";
import "@/styles/elementor/post-483.css";
import "@/styles/elementor/post-488.css";

export const dynamicParams = false;

/**
 * The single-post template without its dark title header (the shared page
 * banner is used instead); the date/author line moves to the top of the
 * article column.
 */
const [postHeader, ...postSections] = postTemplate.tree;
const postInfo = postHeader.t === "section" ? postHeader.children.flatMap((c) => (c.t === "column" ? c.children : [])).find((n) => n.t === "post-info") : undefined;
const postBody: WpNode[] = postSections.map((section, i) => {
  if (i !== 0 || section.t !== "section" || !postInfo) return section;
  const [article, ...rest] = section.children;
  if (article?.t !== "column") return section;
  return { ...section, children: [{ ...article, children: [postInfo, ...article.children] }, ...rest] };
});

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return seoMetadata(post.seo, post.title, `/${slug}/`);
}

export default async function BlogPost({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const posts = getAllPosts();
  const breadcrumb = [{ label: "Nyheter", href: "/streaming-nyheter-sverige/" }, { label: post.title }];

  if (post.tree && post.template) {
    return (
      <>
        <JsonLd data={post.seo.schema} />
        <ElementorDocument id={post.template} type="wp-post" nodes={post.tree} ctx={{ title: post.title, post, posts, breadcrumb, path: `/${slug}/` }} />
      </>
    );
  }

  const { html, headings } = withHeadingAnchors(mapHtmlLinks(post.html ?? ""));
  const ctx = {
    title: post.title,
    post,
    posts,
    headings,
    breadcrumb,
    path: `/${slug}/`,
    content: <div className="wp-post-body" dangerouslySetInnerHTML={{ __html: html }} />,
  };
  return (
    <>
      <JsonLd data={post.seo.schema} />
      {/* Same title banner as every other page… */}
      <ElementorDocument
        id={pageTemplate.template}
        type="single-page"
        nodes={pageTemplate.tree.slice(0, 1)}
        className="elementor-location-single"
        ctx={ctx}
      />
      {/* …followed by the post layout, with the post's own header replaced. */}
      <ElementorDocument id={postTemplate.template} type="single-post" nodes={postBody} className="elementor-location-single" ctx={ctx} />
    </>
  );
}
