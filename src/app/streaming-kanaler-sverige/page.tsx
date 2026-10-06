import { cookies } from "next/headers";
import ElementorDocument from "@/components/elementor/Render";
import { JsonLd, wpPageMetadata } from "@/components/elementor/WpPage";
import { getPage, pageTemplate } from "@/lib/wp/content";
import { ACCESS_COOKIE, isValidAccessToken } from "./access";
import ChannelList from "./ChannelList";
import PasswordForm from "./PasswordForm";
import "./kanaler.css";

const SLUG = "streaming-kanaler-sverige";

export const metadata = wpPageMetadata(SLUG);

/**
 * "Kanaler": page title banner followed by the embedded channel list.
 * The list is only rendered after the visitor has entered the password
 * (checked on the server, remembered in a signed httpOnly cookie that
 * expires 60 s after the visitor stops being active on the page).
 */
export default async function Page() {
  const page = getPage(SLUG);
  const unlocked = isValidAccessToken((await cookies()).get(ACCESS_COOKIE)?.value);

  return (
    <>
      <JsonLd data={page.seo.schema} />
      <ElementorDocument
        id={pageTemplate.template}
        type="single-page"
        nodes={pageTemplate.tree}
        className="elementor-location-single"
        ctx={{
          title: page.title,
          path: `/${SLUG}/`,
          content: (
            <div className="mx-auto max-w-[1140px] px-4 py-12">
              {unlocked ? (
                <ChannelList />
              ) : (
                <PasswordForm />
              )}
            </div>
          ),
        }}
      />
    </>
  );
}
