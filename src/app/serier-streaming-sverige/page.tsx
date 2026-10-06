import WpPage, { wpPageMetadata } from "@/components/elementor/WpPage";
import "@/styles/elementor/post-3094.css";

const SLUG = "serier-streaming-sverige";

export const metadata = wpPageMetadata(SLUG);

export default function Page() {
  return <WpPage slug={SLUG} />;
}
