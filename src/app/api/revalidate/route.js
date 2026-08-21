import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Called by the WordPress mu-plugin's wp_remote_post whenever a Glacier
// Dialogue is saved/published, so the Next.js listing/detail pages refresh
// without a redeploy. See wordpress/mu-plugins/tvgf-glacier-dialogues.php.
export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body || body.secret !== process.env.WORDPRESS_REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("glacier-dialogues");
  if (body.slug) {
    revalidateTag(`glacier-dialogue:${body.slug}`);
  }

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
