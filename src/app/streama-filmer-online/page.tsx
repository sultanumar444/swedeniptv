import WpPage, { wpPageMetadata } from "@/components/elementor/WpPage";
import "@/styles/elementor/post-3076.css";

const SLUG = "streama-filmer-online";

export const metadata = wpPageMetadata(SLUG);

export default function Page() {
  return <WpPage slug={SLUG} />;
}
