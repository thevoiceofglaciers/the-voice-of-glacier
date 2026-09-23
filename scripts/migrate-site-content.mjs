#!/usr/bin/env node
/**
 * One-off migration: fills WordPress with the site's current page content so
 * the live pages look exactly the same the moment WordPress takes over.
 *
 * Reads every schema in wordpress/mu-plugins/tvgf-core/schemas and, using the
 * schema defaults (= today's hardcoded content):
 *   - creates/fills the core Page for each page schema (home, learn, …)
 *   - creates the Glossary Terms, Quiz Questions and Glacier Profiles
 *   - fills the Site Settings screen (footer, social links, SEO)
 *
 * Along the way every image/video/file field is moved into the WordPress Media
 * Library: remote files (GitHub, Bing, Britannica, Unsplash) are downloaded,
 * and site-relative paths like /home/work1.png are read from public/. A file
 * that fails to upload (e.g. a video over Hostinger's upload limit) keeps its
 * original URL and is listed at the end — upload those by hand, or pass
 * --skip-videos to leave every video where it is.
 *
 * Safe to re-run: pages/collections/settings that already have content are
 * skipped (pass --overwrite to replace them with the defaults again), and files
 * already in the Media Library under the same name are reused.
 *
 * Requires tvgf-core.php (and its tvgf-core/ folder) installed in WordPress.
 *
 * Usage:
 *   WORDPRESS_SITE_URL=https://cms.example.org \
 *   WORDPRESS_PREVIEW_APP_USER=admin \
 *   WORDPRESS_PREVIEW_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx" \
 *   node scripts/migrate-site-content.mjs [--overwrite] [--skip-videos] [--skip-media]
 */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCHEMA_DIR = path.join(ROOT, "wordpress/mu-plugins/tvgf-core/schemas");

const SITE_URL = process.env.WORDPRESS_SITE_URL?.replace(/\/$/, "");
const USER = process.env.WORDPRESS_PREVIEW_APP_USER;
const PASSWORD = process.env.WORDPRESS_PREVIEW_APP_PASSWORD;
const OVERWRITE = process.argv.includes("--overwrite");
const SKIP_VIDEOS = process.argv.includes("--skip-videos");
const SKIP_MEDIA = process.argv.includes("--skip-media");

if (!SITE_URL || !USER || !PASSWORD) {
  console.error("Missing WORDPRESS_SITE_URL / WORDPRESS_PREVIEW_APP_USER / WORDPRESS_PREVIEW_APP_PASSWORD env vars.");
  process.exit(1);
}

const authHeader = "Basic " + Buffer.from(`${USER}:${PASSWORD}`).toString("base64");

async function wpRequest(route, options = {}) {
  const res = await fetch(`${SITE_URL}/wp-json${route}`, {
    ...options,
    headers: { Authorization: authHeader, ...(options.headers || {}) },
  });
  if (!res.ok) {
    throw new Error(`${options.method || "GET"} ${route} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

const postJson = (route, body) =>
  wpRequest(route, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

const MIME_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
  pdf: "application/pdf",
};

const uploaded = new Map(); // original URL -> Media Library URL
const failures = [];

function fileNameFor(url) {
  const { pathname } = new URL(url, "https://local.invalid");
  const segments = pathname.split("/").filter(Boolean).map(decodeURIComponent);
  let base = segments.pop() || "file";
  // Bing/Unsplash style URLs have no extension — name them as images.
  if (!/\.[a-z0-9]{2,4}$/i.test(base)) base = `${base.replace(/[^a-z0-9-]+/gi, "-").slice(0, 60)}.jpg`;
  // Keep the folder in the name: the asset repo has different files with the
  // same name in different folders (efforts/YearOfGlacier.webp vs explore/…).
  const folder = segments.pop();
  return folder && folder !== "main" ? `${folder}-${base}` : base;
}

async function readSource(url) {
  if (url.startsWith("/")) {
    const buffer = await readFile(path.join(ROOT, "public", decodeURIComponent(url)));
    return { buffer, contentType: null };
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed (${res.status})`);
  return { buffer: Buffer.from(await res.arrayBuffer()), contentType: res.headers.get("content-type") };
}

async function findExistingMedia(fileName) {
  const stem = fileName.replace(/\.[^.]+$/, "");
  const results = await wpRequest(`/wp/v2/media?search=${encodeURIComponent(stem)}&per_page=20`);
  const match = results.find((m) => m.source_url?.endsWith(`/${fileName}`));
  return match?.source_url || null;
}

async function migrateFile(url, type) {
  if (!url || SKIP_MEDIA) return url;
  if (url.startsWith(SITE_URL) || url.startsWith("#")) return url;
  if (!/^(https?:\/\/|\/)/.test(url)) return url;
  if (SKIP_VIDEOS && type === "video") return url;
  if (uploaded.has(url)) return uploaded.get(url);

  const fileName = fileNameFor(url);
  try {
    const existing = await findExistingMedia(fileName);
    if (existing) {
      uploaded.set(url, existing);
      return existing;
    }
    const { buffer, contentType } = await readSource(url);
    const ext = fileName.split(".").pop().toLowerCase();
    const media = await wpRequest("/wp/v2/media", {
      method: "POST",
      headers: {
        "Content-Type": MIME_TYPES[ext] || contentType || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
      body: buffer,
    });
    console.log(`  ↑ ${fileName} (${Math.round(buffer.length / 1024)} KB)`);
    uploaded.set(url, media.source_url);
    return media.source_url;
  } catch (err) {
    console.warn(`  ! Kept original URL for ${url}: ${err.message.slice(0, 200)}`);
    failures.push(url);
    uploaded.set(url, url);
    return url;
  }
}

/** Replaces every image/video/file value in `values` (walking repeaters) with its Media Library URL. */
async function migrateMedia(fields, values) {
  const out = { ...values };
  for (const field of fields) {
    const value = out[field.key];
    if (value === undefined) continue;
    if (field.type === "repeater" && Array.isArray(value)) {
      out[field.key] = [];
      for (const row of value) out[field.key].push(await migrateMedia(field.fields, row));
    } else if (["image", "video", "file"].includes(field.type)) {
      out[field.key] = await migrateFile(value, field.type);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const readJson = async (file) => JSON.parse(await readFile(file, "utf8"));
const schemaFields = (schema) => schema.fields || schema.sections.flatMap((s) => s.fields);
const defaultsOf = (schema) =>
  Object.fromEntries(schemaFields(schema).filter((f) => "default" in f).map((f) => [f.key, f.default]));

async function schemasIn(dir) {
  const files = (await readdir(path.join(SCHEMA_DIR, dir))).filter((f) => f.endsWith(".json")).sort();
  return Promise.all(files.map((f) => readJson(path.join(SCHEMA_DIR, dir, f))));
}

console.log(`Migrating site content into ${SITE_URL}${OVERWRITE ? " (overwriting existing content)" : ""}\n`);

for (const schema of await schemasIn("pages")) {
  console.log(`Page "${schema.slug}" (${schema.path})`);
  try {
    const content = await migrateMedia(schemaFields(schema), defaultsOf(schema));
    const result = await postJson(`/tvgf/v1/pages/${schema.slug}`, { content, overwrite: OVERWRITE });
    console.log(
      result.skipped
        ? `  - Already has content (page ID ${result.id}) — skipped.`
        : `  ${result.created ? "Created" : "Filled"} page ID ${result.id}: ${SITE_URL}/wp-admin/post.php?post=${result.id}&action=edit`
    );
  } catch (err) {
    console.error(`  ! ${err.message}`);
  }
}

for (const schema of await schemasIn("collections")) {
  console.log(`Collection "${schema.label}" (${schema.defaults.length} items)`);
  try {
    const items = [];
    for (const [index, { title, ...fields }] of schema.defaults.entries()) {
      items.push({ title, menuOrder: index, fields: await migrateMedia(schema.fields, fields) });
    }
    const result = await postJson(`/tvgf/v1/collections/${schema.postType}`, { items, overwrite: OVERWRITE });
    console.log(result.skipped ? "  - Already has items — skipped." : `  Created ${result.created} item(s).`);
  } catch (err) {
    console.error(`  ! ${err.message}`);
  }
}

console.log("Site Settings");
try {
  const schema = await readJson(path.join(SCHEMA_DIR, "site-settings.json"));
  const settings = await migrateMedia(schemaFields(schema), defaultsOf(schema));
  const result = await postJson("/tvgf/v1/site-settings", { settings, overwrite: OVERWRITE });
  console.log(result.skipped ? "  - Already saved — skipped." : "  Saved.");
} catch (err) {
  console.error(`  ! ${err.message}`);
}

if (failures.length) {
  console.log(`\n${failures.length} file(s) kept their original URL — upload them by hand and paste the new URL into the field:`);
  failures.forEach((url) => console.log(`  - ${url}`));
}
console.log("\nDone. Each page refreshes on the live site automatically.");
