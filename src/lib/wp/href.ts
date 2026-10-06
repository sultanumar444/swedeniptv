/**
 * The WordPress site linked to its own instruction pages; those now live under
 * /installationsguider. Links in the migrated content are rewritten here so
 * nobody has to go through a redirect. The same map feeds the 301 redirects in
 * next.config.ts for old external links.
 */
export const instructionRedirects: Record<string, string> = {
  "/setup-instructions/": "/installationsguider/",
  "/apple-tv-instruktioner/": "/installationsguider/apple-tv/",
  "/smart-tv/": "/installationsguider/smart-tv/",
  "/iptv-mobil/": "/installationsguider/ios-android/",
  "/iptv-android/": "/installationsguider/android-tv/",
  "/formuler-iptv/": "/installationsguider/formuler/",
  "/iptv-dator/": "/installationsguider/windows-mac/",
  "/iptv-windows/": "/installationsguider/windows-mac/windows/",
  "/mac-iptv/": "/installationsguider/windows-mac/mac/",
  "/iptv-tvip/": "/installationsguider/tvip-s-box/",
  "/iptv-streamer/": "/installationsguider/apple-tv/iptv-streamer/",
  "/iptvx-instruktioner/": "/installationsguider/apple-tv/iptvx/",
  "/set-iptv/": "/installationsguider/apple-tv/set-iptv/",
  "/smart-stb/": "/installationsguider/apple-tv/smart-stb/",
  "/xtream-iptv/": "/installationsguider/apple-tv/xtream-iptv/",
  "/xui-iptv-player/": "/installationsguider/apple-tv/xui-iptv-player/",
  "/9xtream-iptv/": "/installationsguider/apple-tv/9xtream-iptv/",
  "/duplex-iptv/": "/installationsguider/apple-tv/duplex-play/",
  "/gse-smart-iptv/": "/installationsguider/apple-tv/gse-smart-iptv-pro/",
  "/hot-iptv/": "/installationsguider/apple-tv/hot-iptv/",
  "/ibo-player/": "/installationsguider/apple-tv/ibo-player/",
  "/implayer-iptv/": "/installationsguider/apple-tv/implayer-iptv/",
  "/iplaytv/": "/installationsguider/apple-tv/iplaytv/",
  "/iptv-expert/": "/installationsguider/apple-tv/iptv-expert/",
  "/iptv-extreme/": "/installationsguider/apple-tv/iptv-extreme/",
  "/iptv-pro/": "/installationsguider/apple-tv/iptv-pro/",
  "/iptv-smarters/": "/installationsguider/apple-tv/iptv-smarters/",
  "/iptv-world/": "/installationsguider/apple-tv/iptv-world/",
  "/mega-iptv/": "/installationsguider/apple-tv/mega-iptv/",
  "/my-tv-online/": "/installationsguider/apple-tv/mytvonline/",
  "/myiptv-player/": "/installationsguider/apple-tv/myiptv-player/",
  "/net-iptv/": "/installationsguider/apple-tv/net-iptv/",
  "/perfect-iptv/": "/installationsguider/apple-tv/perfect-iptv/",
  "/televizo-iptv/": "/installationsguider/apple-tv/televizo-iptv/",
  "/tivimate/": "/installationsguider/apple-tv/tivimate/",
};

/** Other WordPress URLs that no longer exist as pages. */
export const legacyRedirects: Record<string, string> = {
  "/iptv-paket-sverige/": "/streaming-paket-sverige/",
  "/shop/": "/streaming-plans/",
  "/cart/": "/streaming-plans/",
  "/checkout/": "/streaming-plans/",
  "/my-account/": "/kontakta-oss/",
  "/category/uncategorized/": "/streaming-nyheter-sverige/",
};

/**
 * Where the "Välj Plan" buttons send visitors. WooCommerce checkout does not
 * exist in the Next.js site, so the old `?add-to-cart=<id>` links resolve here.
 * Replace with a real checkout/payment link per plan when one is available.
 */
export const planCheckout: Record<string, string> = {
  "1079": "/kontakta-oss/",
  "2009": "/kontakta-oss/",
  "2010": "/kontakta-oss/",
  "2012": "/kontakta-oss/",
};

const routeMap: Record<string, string> = { ...instructionRedirects, ...legacyRedirects, "/streamingtv/": "/streamingtv/" };

export function mapHref(href: string | null | undefined): string {
  if (!href) return "#";
  if (href === "https://swedeniptv.net" || href === "") return "/";
  const cart = href.match(/[?&]add-to-cart=(\d+)/);
  if (cart) return planCheckout[cart[1]] ?? "/streaming-plans/";
  if (!href.startsWith("/")) return href;
  const [path, rest = ""] = href.split(/(?=[?#])/);
  const withSlash = path.endsWith("/") || path.includes(".") ? path : `${path}/`;
  if (withSlash.startsWith("/author/")) return "/";
  return (routeMap[withSlash] ?? withSlash) + rest;
}

/** Rewrites every href="..." inside an HTML string. */
export function mapHtmlLinks(html: string): string {
  return html.replace(/href="([^"]*)"/g, (_, h: string) => `href="${mapHref(h)}"`);
}
