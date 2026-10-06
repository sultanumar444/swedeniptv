/**
 * Sätt NEXT_PUBLIC_SITE_URL i miljövariablerna om domänen ändras,
 * annars används fallback-värdet nedan.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://swedeniptv.net";

export const siteName = "Sweden IPTV";

/** Receives messages from the contact form (shown on /kontakta-oss/). */
export const contactEmail = "supporten@sverigeiptv.net";
