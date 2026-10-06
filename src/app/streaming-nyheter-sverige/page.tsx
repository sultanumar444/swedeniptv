import WpPage, { wpPageMetadata } from "@/components/elementor/WpPage";
import "@/styles/elementor/post-460.css";

const SLUG = "streaming-nyheter-sverige";

export const metadata = wpPageMetadata(SLUG);

export default function Page() {
  return <WpPage slug={SLUG} />;
}
