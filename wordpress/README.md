# WordPress setup — Glacier Dialogues headless CMS

This folder contains everything that needs to run on the WordPress side
(hosted on Hostinger). Nothing here runs as part of the Next.js app.

## 1. Install WordPress

Use Hostinger's WordPress hosting (a plan with real server-side cron support —
check this explicitly, since WordPress's default pseudo-cron only fires on
page views and this project's revalidation webhook and scheduled-future
publishing both depend on timely cron). A subdomain like
`cms.thevoiceofglaciers.org` is a good choice so it's clearly separate from
the public site.

## 2. Install plugins (all free)

From Plugins > Add New in wp-admin:

1. **WPGraphQL** — adds the `/graphql` endpoint.
2. **WPGraphQL Content Blocks** — exposes each post's Gutenberg blocks
   (`editorBlocks`) over GraphQL, which is how article bodies reach Next.js.

## 3. Install the custom plugin/blocks in this repo

- Upload `mu-plugins/tvgf-glacier-dialogues.php` to `wp-content/mu-plugins/`
  on the server (create that folder if it doesn't exist). mu-plugins load
  automatically — no activation step, and it can't be accidentally
  deactivated from the admin UI.
- Upload the whole `plugins/tvgf-glacier-blocks/` folder to
  `wp-content/plugins/`, then activate **TVGF Glacier Blocks** from
  Plugins in wp-admin. No build step needed — it's plain JS against the
  WordPress packages already bundled with the block editor.

## 4. Define the shared secrets in `wp-config.php`

Add these above the `/* That's all, stop editing! */` line, matching the
values you put in the Next.js app's `.env.local` (see `.env.local.example`
in the repo root):

```php
define( 'TVGF_NEXTJS_URL', 'https://thevoiceofglaciers.org' );
define( 'TVGF_REVALIDATE_SECRET', 'generate-a-long-random-string' );
define( 'TVGF_PREVIEW_SECRET', 'generate-a-different-long-random-string' );
```

## 5. Create a WordPress Application Password

Used only server-side by Next.js to fetch draft content for previews, and by
the one-off migration script. WP Admin > Users > Your Profile > Application
Passwords > add a new one named e.g. "Next.js preview". Copy the generated
password immediately (shown once) into `WORDPRESS_PREVIEW_APP_PASSWORD`.

## 6. Confirm the CPT and blocks appear

In wp-admin you should now see a **Glacier Dialogues** menu item. Add a test
entry: fill in the title, the Dialogue Details box (date/speaker/video link),
set a Featured Image, assign a Topic, and compose the body using the
**Context Strip**, **Speaker Bio**, **Stat Tiles**, **Callout**, and
**Comparison** blocks from the block inserter — plus WordPress's own core
Quote, Gallery, and List blocks for those simpler cases.

## 7. Verify the GraphQL contract

Open `https://<your-wp-domain>/graphql` (WPGraphQL ships a GraphiQL IDE at
`/wp-admin/admin.php?page=graphiql-ide`) and confirm both queries in
`src/lib/wp.js` return data for your test entry before pointing the Next.js
app at it.

## 8. Migrating the 7 existing entries

Run `scripts/migrate-dialogues.mjs` from the repo root (see the script's
header comment for the required env vars) to create draft posts with
title/date/speaker/video-link/featured-image already filled in for all 7
entries currently in `src/data/podcasts.js`. Then, for each one, open it in
the block editor and rebuild the article body using the new blocks — this
part is manual, not scripted, since the existing HTML in
`src/data/dialogues.js` is inconsistent per-article markup that the new
schema is specifically standardizing away. This is also where the two
base64-embedded photo essays get moved into real Media Library uploads.

Publish each one once its body is rebuilt; publishing fires the revalidation
webhook automatically, and the entry should appear on the live Next.js
listing within seconds.
