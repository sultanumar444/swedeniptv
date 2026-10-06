import type { NextConfig } from "next";
import { instructionRedirects, legacyRedirects } from "./src/lib/wp/href";

const nextConfig: NextConfig = {
  // WordPress URLs all end in a slash; keep them identical for SEO.
  trailingSlash: true,
  async redirects() {
    return [
      // WordPress sent the root to the "Streaming TV" page.
      { source: "/", destination: "/streamingtv/", statusCode: 301 },
      ...Object.entries({ ...instructionRedirects, ...legacyRedirects }).map(([source, destination]) => ({
        source,
        destination,
        statusCode: 301,
      })),
      { source: "/product/:path*", destination: "/streaming-plans/", statusCode: 301 },
      { source: "/author/:path*", destination: "/streamingtv/", statusCode: 301 },
      { source: "/category/:path*", destination: "/streaming-nyheter-sverige/", statusCode: 301 },
      { source: "/streaming-nyheter-sverige/:page(\\d+)/", destination: "/streaming-nyheter-sverige/", statusCode: 301 },
      { source: "/:year(\\d{4})/:path*", destination: "/streaming-nyheter-sverige/", statusCode: 301 },
    ];
  },
};

export default nextConfig;
