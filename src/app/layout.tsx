import type { Metadata } from "next";
import { Sora } from "next/font/google";
import ElementorDocument from "@/components/elementor/Render";
import { footerTemplate, headerTemplate } from "@/lib/wp/content";
import { siteName, siteUrl } from "@/lib/site";
import "./globals.css";
import "@/styles/elementor/core.css";
import "@/styles/elementor/post-5.css";
import "@/styles/elementor/post-185.css";
import "@/styles/elementor/post-200.css";
import "@/styles/elementor/post-656.css";
import "./site.css";
import "./theme.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s - ${siteName}`,
  },
  description: "Streaming TV Sverige – se live-TV, filmer och serier online.",
  icons: {
    icon: [
      { url: "/wp-content/uploads/2024/12/cropped-svensk-fav-32x32.png", sizes: "32x32" },
      { url: "/wp-content/uploads/2024/12/cropped-svensk-fav-192x192.png", sizes: "192x192" },
    ],
    apple: "/wp-content/uploads/2024/12/cropped-svensk-fav-180x180.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sv-SE" className={`${sora.variable} antialiased`}>
      <body className="elementor-default elementor-kit-5" suppressHydrationWarning>
        <header className="site-header-sticky">
          <ElementorDocument id={headerTemplate.template} type="header" nodes={headerTemplate.tree} ctx={{}} className="elementor-location-header" />
        </header>
        <main>{children}</main>
        <footer>
          <ElementorDocument id={footerTemplate.template} type="footer" nodes={footerTemplate.tree} ctx={{}} className="elementor-location-footer" />
        </footer>
      </body>
    </html>
  );
}
