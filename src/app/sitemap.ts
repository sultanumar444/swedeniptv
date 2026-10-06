import type { MetadataRoute } from "next";
import { instructionRedirects } from "@/lib/wp/href";
import { getAllPosts } from "@/lib/wp/content";
import { siteUrl } from "@/lib/site";

const PAGES = [
  "streamingtv",
  "om-oss",
  "streaming-paket-sverige",
  "streaming-plans",
  "streaming-kanaler-sverige",
  "kontakta-oss",
  "streaming-nyheter-sverige",
  "sport-streaming-sverige",
  "premium-tv-streaming",
  "smart-tv-streaming",
  "streama-filmer-online",
  "serier-streaming-sverige",
  "svensk-tv-streaming",
  "roku-iptv-spelare",
  "m3u-iptv",
  "faq",
  "villkor",
  "integritetspolicy",
  "dmca",
];

/** Every instruction guide, including the ones the old WordPress pages now point to. */
const GUIDES = [
  ...new Set([
    "/installationsguider/chromecast-instruktioner/",
    "/installationsguider/nvidia-shield/",
    ...Object.values(instructionRedirects),
  ]),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (p: string) => `${siteUrl}/${p}/`;
  return [
    ...PAGES.map((p) => ({ url: url(p), changeFrequency: "weekly" as const, priority: p === "streamingtv" ? 1 : 0.8 })),
    ...getAllPosts().map((p) => ({ url: url(p.slug), lastModified: p.modified, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...GUIDES.map((p) => ({ url: `${siteUrl}${p}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
