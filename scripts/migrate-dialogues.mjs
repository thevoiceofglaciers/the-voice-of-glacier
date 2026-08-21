#!/usr/bin/env node
/**
 * One-off migration: pushes the 7 existing Glacier Dialogue entries from
 * src/data/podcasts.js into WordPress as `glacier_dialogue` posts (draft
 * status) with their metadata + featured image.
 *
 * Does NOT migrate article bodies (src/data/dialogues.js) — those must be
 * rebuilt by hand in the WordPress block editor using the new Gutenberg
 * blocks. The existing per-article HTML is too inconsistent to auto-map onto
 * the standardized block schema, and rebuilding it is the actual point of
 * this migration (see wordpress/README.md).
 *
 * Usage:
 *   WORDPRESS_SITE_URL=https://cms.example.org \
 *   WORDPRESS_PREVIEW_APP_USER=admin \
 *   WORDPRESS_PREVIEW_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx" \
 *   node scripts/migrate-dialogues.mjs
 */

import { podcasts } from "../src/data/podcasts.js";

const SITE_URL = process.env.WORDPRESS_SITE_URL;
const USER = process.env.WORDPRESS_PREVIEW_APP_USER;
const PASSWORD = process.env.WORDPRESS_PREVIEW_APP_PASSWORD;

if (!SITE_URL || !USER || !PASSWORD) {
  console.error(
    "Missing WORDPRESS_SITE_URL / WORDPRESS_PREVIEW_APP_USER / WORDPRESS_PREVIEW_APP_PASSWORD env vars."
  );
  process.exit(1);
}

const authHeader = "Basic " + Buffer.from(`${USER}:${PASSWORD}`).toString("base64");

function parseEventDate(dateStr) {
  // Existing strings look like "Feb 17, 2026" / "January 15, 2026" / "23 May 2026".
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Could not parse date "${dateStr}" — fix this entry manually.`);
  }
  return parsed.toISOString().slice(0, 10); // YYYY-MM-DD
}

async function uploadFeaturedImage(imageUrl, filename) {
  const imageRes = await fetch(imageUrl);
  if (!imageRes.ok) {
    console.warn(`  ! Could not download image ${imageUrl} (${imageRes.status}) — skipping featured image.`);
    return null;
  }
  const buffer = Buffer.from(await imageRes.arrayBuffer());
  const contentType = imageRes.headers.get("content-type") || "image/jpeg";

  const uploadRes = await fetch(`${SITE_URL}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
    body: buffer,
  });

  if (!uploadRes.ok) {
    console.warn(`  ! Media upload failed for ${filename}: ${uploadRes.status} ${await uploadRes.text()}`);
    return null;
  }

  const media = await uploadRes.json();
  return media.id;
}

async function migrateEntry(entry) {
  console.log(`Migrating ${entry.slug}: ${entry.title}`);

  let featuredMediaId = null;
  if (entry.image?.startsWith("http")) {
    featuredMediaId = await uploadFeaturedImage(entry.image, `${entry.slug}.jpg`);
  } else {
    console.log(`  - Local image path "${entry.image}" — upload manually via Media Library after migration.`);
  }

  const dialogueDate = parseEventDate(entry.date);

  const postRes = await fetch(`${SITE_URL}/wp-json/wp/v2/glacier_dialogue`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: entry.title,
      slug: entry.slug,
      status: "draft", // publish manually once the body is rebuilt with blocks
      ...(featuredMediaId ? { featured_media: featuredMediaId } : {}),
      meta: {
        dialogue_date: dialogueDate,
        speaker_name: entry.speaker,
        video_link: entry.videoLink || "",
      },
    }),
  });

  if (!postRes.ok) {
    console.error(`  ! Failed to create post for ${entry.slug}: ${postRes.status} ${await postRes.text()}`);
    return;
  }

  const post = await postRes.json();
  console.log(
    `  Created post ID ${post.id} (draft) — now rebuild the body in the block editor: ` +
      `${SITE_URL}/wp-admin/post.php?post=${post.id}&action=edit`
  );
}

for (const entry of podcasts) {
  await migrateEntry(entry);
}

console.log(
  "\nDone. Article bodies were NOT migrated — rebuild each one using the new Gutenberg " +
    "blocks (see wordpress/README.md), including moving the two base64-embedded photo " +
    "essays into real Media Library uploads, then publish."
);
