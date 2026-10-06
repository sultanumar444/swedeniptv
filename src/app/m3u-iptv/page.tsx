import WpPage, { wpPageMetadata } from "@/components/elementor/WpPage";
import "@/styles/elementor/post-3165.css";

const SLUG = "m3u-iptv";

export const metadata = wpPageMetadata(SLUG);

export default function Page() {
  return <WpPage slug={SLUG} />;
}
