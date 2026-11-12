import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

// Called by the WordPress mu-plugins' wp_remote_post whenever content is
// saved/published, so the relevant Next.js pages refresh without a
// redeploy. `type` selects which tag(s) to revalidate — see
// wordpress/mu-plugins/tvgf-glacier-dialogues.php, tvgf-site-content.php,
// tvgf-media.php, tvgf-news.php and tvgf-core.php.
const TAG_MAP = {
  glacier_dialogue: (body) => [
    "glacier-dialogues",
    ...(body.slug ? [`glacier-dialogue:${body.slug}`] : []),
  ],
  announcement: () => ["announcement"],
  menu: () => ["site-menu"],
  media: () => ["media"],
  news: () => ["news"],
  page: (body) => (body.slug ? [`page:${body.slug}`] : []),
  // tvgf-core.php collections (slug = post type, e.g. "glossary_term").
  collection: (body) => (body.slug ? [`collection:${body.slug}`] : []),
  settings: () => ["site-settings"],
};

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body || body.secret !== process.env.WORDPRESS_REVALIDATE_SECRET) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  const type = body.type || "glacier_dialogue";
  const tags = (TAG_MAP[type] || TAG_MAP.glacier_dialogue)(body);
  tags.forEach((tag) => revalidateTag(tag));

  return NextResponse.json({ revalidated: true, tags, now: Date.now() });
}
