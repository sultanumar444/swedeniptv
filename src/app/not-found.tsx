import Link from "next/link";
import ElementorDocument from "@/components/elementor/Render";
import { pageTemplate } from "@/lib/wp/content";

export default function NotFound() {
  return (
    <ElementorDocument
      id={pageTemplate.template}
      type="single-page"
      nodes={pageTemplate.tree}
      className="elementor-location-single"
      ctx={{
        title: "Sidan hittades inte",
        content: (
          <div className="mx-auto max-w-3xl px-6 py-24 text-center">
            <p className="mb-6 text-lg">Sidan du letar efter finns inte eller har flyttats.</p>
            <div className="elementor-button-wrapper">
              <Link className="elementor-button elementor-size-md" href="/streamingtv/">
                <span className="elementor-button-content-wrapper">
                  <span className="elementor-button-text">Till startsidan</span>
                </span>
              </Link>
            </div>
          </div>
        ),
      }}
    />
  );
}
