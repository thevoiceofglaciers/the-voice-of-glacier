#!/usr/bin/env node
/**
 * One-off migration: copies the /media page's posts from the legacy backend
 * (GET ${BACKEND_URL}/getBlog -> { blogs: [{ title, description, mediaType,
 * mediaUrl, createdAt? }] }) into WordPress as `media_post` drafts.
 *
 * For each post it:
 *   - downloads the image (currently hosted on Cloudinary) and uploads it to
 *     the WordPress Media Library as the post's Card Image (featured image)
 *   - converts the LinkedIn-style "fake bold" Unicode letters (𝗧𝗼𝗱𝗮𝘆) back to
 *     plain text — they're unreadable to screen readers and search engines;
 *     re-apply real bold in the block editor where it matters
 *   - turns blank-line-separated text into paragraph blocks
 *
 * Video posts keep their original URL in the Video Link field — move large
 * files to YouTube (preferred) or the Media Library by hand afterwards.
 *
 * Safe to re-run: posts whose slug already exists in WordPress are skipped.
 *
 * Usage:
 *   BACKEND_URL=https://api.example.org \
 *   WORDPRESS_SITE_URL=https://cms.example.org \
 *   WORDPRESS_PREVIEW_APP_USER=admin \
 *   WORDPRESS_PREVIEW_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx" \
 *   node scripts/migrate-media.mjs
 */

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
const SITE_URL = process.env.WORDPRESS_SITE_URL;
const USER = process.env.WORDPRESS_PREVIEW_APP_USER;
const PASSWORD = process.env.WORDPRESS_PREVIEW_APP_PASSWORD;

if (!BACKEND_URL || !SITE_URL || !USER || !PASSWORD) {
  console.error(
    "Missing BACKEND_URL / WORDPRESS_SITE_URL / WORDPRESS_PREVIEW_APP_USER / WORDPRESS_PREVIEW_APP_PASSWORD env vars."
  );
  process.exit(1);
}

const authHeader = "Basic " + Buffer.from(`${USER}:${PASSWORD}`).toString("base64");

function slugify(str) {
  return str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}

// Only the Mathematical Alphanumeric Symbols block (U+1D400–U+1D7FF) — the
// bold/italic "fonts" LinkedIn posts are copied with. A blanket NFKC would
// also rewrite things like "…" and "½".
function unfancy(text) {
  return text.replace(/[\u{1D400}-\u{1D7FF}]/gu, (c) => c.normalize("NFKC"));
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function toParagraphBlocks(description) {
  return unfancy(description || "")
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<!-- wp:paragraph -->\n<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>\n<!-- /wp:paragraph -->`)
    .join("\n\n");
}

async function wpRequest(path, options = {}) {
  const res = await fetch(`${SITE_URL}/wp-json/wp/v2${path}`, {
    ...options,
    headers: { Authorization: authHeader, ...(options.headers || {}) },
  });
  if (!res.ok) {
    throw new Error(`${options.method || "GET"} ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function uploadImage(imageUrl, slug) {
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) {
    console.warn(`  ! Could not download image ${imageUrl} (${imageRes.status}) — skipping card image.`);
    return null;
  }
  const buffer = Buffer.from(await imageRes.arrayBuffer());
  const contentType = imageRes.headers.get("content-type") || "image/jpeg";
  const ext = new URL(imageUrl).pathname.split(".").pop() || "jpg";

  try {
    const media = await wpRequest("/media", {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${slug}.${ext}"`,
      },
      body: buffer,
    });
    return media.id;
  } catch (err) {
    console.warn(`  ! Media upload failed for ${slug}: ${err.message}`);
    return null;
  }
}

async function migrateBlog(blog) {
  const title = unfancy(blog.title || "").trim();
  const slug = slugify(title) || `media-post-${blog._id}`;
  console.log(`Migrating ${slug}: ${title}`);

  const existing = await wpRequest(`/media_post?slug=${encodeURIComponent(slug)}&status=any&context=edit`);
  if (existing.length > 0) {
    console.log(`  - Already exists (post ID ${existing[0].id}) — skipping.`);
    return;
  }

  const isVideo = blog.mediaType === "video";
  const featuredMediaId = !isVideo && blog.mediaUrl ? await uploadImage(blog.mediaUrl, slug) : null;
  if (isVideo) {
    console.log(`  - Video post: kept original URL ${blog.mediaUrl} — consider moving it to YouTube.`);
  }

  const post = await wpRequest("/media_post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      slug,
      status: "draft", // publish manually after reviewing formatting
      content: toParagraphBlocks(blog.description),
      ...(blog.createdAt ? { date_gmt: new Date(blog.createdAt).toISOString().slice(0, 19) } : {}),
      ...(featuredMediaId ? { featured_media: featuredMediaId } : {}),
      meta: { video_url: isVideo ? blog.mediaUrl || "" : "" },
    }),
  });

  console.log(`  Created post ID ${post.id} (draft): ${SITE_URL}/wp-admin/post.php?post=${post.id}&action=edit`);
}

const res = await fetch(`${BACKEND_URL}/getBlog`);
if (!res.ok) {
  console.error(`Could not fetch ${BACKEND_URL}/getBlog: ${res.status}`);
  process.exit(1);
}
const { blogs = [] } = await res.json();
console.log(`Found ${blogs.length} post(s) in the legacy backend.\n`);

for (const blog of blogs) {
  try {
    await migrateBlog(blog);
  } catch (err) {
    console.error(`  ! ${err.message}`);
  }
}

console.log(
  "\nDone. Review each draft in WP Admin > Media Posts (re-apply bold where the old " +
    "post used Unicode bold), then publish — publishing refreshes /media automatically."
);
