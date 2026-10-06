import WpPage, { wpPageMetadata } from "@/components/elementor/WpPage";
import "@/styles/elementor/post-266.css";

const SLUG = "streaming-paket-sverige";

export const metadata = wpPageMetadata(SLUG);

export default function Page() {
  return <WpPage slug={SLUG} />;
}
