import fs from "node:fs";
import path from "node:path";
import footer from "@/content/wp/footer.json";
import header from "@/content/wp/header.json";
import postsIndex from "@/content/wp/posts-index.json";
import templatePage from "@/content/wp/template-page.json";
import templatePost from "@/content/wp/template-post.json";
import type { WpPageData, WpPostData, WpPostMeta, WpTemplate } from "./types";

export const headerTemplate = header as WpTemplate;
export const footerTemplate = footer as WpTemplate;
/** "Single page" template: page title banner + breadcrumb around the page body. */
export const pageTemplate = templatePage as WpTemplate;
/** "Single post" template used by the Gutenberg blog posts. */
export const postTemplate = templatePost as WpTemplate;

const CONTENT_DIR = path.join(process.cwd(), "src/content/wp");

export function getPage(slug: string): WpPageData {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, "pages", `${slug}.json`), "utf8"));
}

/** Newest first. */
export function getAllPosts(): WpPostMeta[] {
  return postsIndex as WpPostMeta[];
}

export function getPost(slug: string): WpPostData | null {
  const file = path.join(CONTENT_DIR, "posts", `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const MONTHS = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];

/** WordPress stores local site time without an offset, e.g. 2026-10-05T05:40:00. */
function parts(date: string) {
  const [d, t = "00:00"] = date.split("T");
  const [y, m, day] = d.split("-").map(Number);
  const [h, min] = t.split(":").map(Number);
  return { y, m, day, h, min };
}

/** Swedish date, e.g. "5 oktober 2026". */
export function formatPostDate(date: string) {
  const { y, m, day } = parts(date);
  return `${day} ${MONTHS[m - 1]} ${y}`;
}

/** Swedish 24-hour time, e.g. "05:40". */
export function formatPostTime(date: string) {
  const { h, min } = parts(date);
  return `${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

/** Byline shown on posts (the WordPress account names were internal admin users). */
export const POST_AUTHOR = "Redaktionen";

/**
 * Adds anchor ids to h2–h6 in a post body (like Elementor's table of contents
 * does in the browser) and returns the heading list for the TOC.
 */
export function withHeadingAnchors(html: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const out = html.replace(/<h([2-6])>([\s\S]*?)<\/h\1>/g, (_, level: string, inner: string) => {
    const id = `elementor-toc__heading-anchor-${headings.length}`;
    const text = inner.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").trim();
    headings.push({ id, text, level: Number(level) });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return { html: out, headings };
}
