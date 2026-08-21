import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

// Target of the WordPress "Preview" button (see preview_post_link filter in
// wordpress/mu-plugins/tvgf-glacier-dialogues.php). Enables Next.js Draft Mode
// so the detail page fetches unpublished content straight from WordPress.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  if (!slug || !secret || secret !== process.env.WORDPRESS_PREVIEW_SECRET) {
    return new Response("Invalid preview link", { status: 401 });
  }

  draftMode().enable();
  redirect(`/glacierDialgoues/${slug}`);
}
