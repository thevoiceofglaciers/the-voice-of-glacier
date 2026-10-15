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

- Upload `mu-plugins/tvgf-glacier-dialogues.php`, `mu-plugins/tvgf-site-content.php`,
  `mu-plugins/tvgf-media.php`, `mu-plugins/tvgf-news.php`, `mu-plugins/tvgf-core.php` **and the
  `mu-plugins/tvgf-core/` folder** to `wp-content/mu-plugins/`
  on the server (create that folder if it doesn't exist). mu-plugins load
  automatically — no activation step, and it can't be accidentally
  deactivated from the admin UI. (WordPress only runs top-level mu-plugin
  files; the `tvgf-core/` folder holds the field schemas and admin assets.)
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

## 9. Media page (`/media`)

`mu-plugins/tvgf-media.php` adds two things:

- **Media Posts** (wp-admin menu; named so it isn't confused with WordPress's
  own Media Library). Each post is one card on `/media`: the title, the body
  (shown in full in the card's "Show More" popup), and the **Card Image**
  (featured image). Fill in the optional **Video Link** to make it a video
  card — prefer YouTube/Vimeo links over uploading large video files to
  Hostinger; a Media Library `.mp4` URL also works. Posts are shown newest
  first by publish date, so change a post's date to reorder it.
- **Page Hero** fields on every core Page. Create a Page with the slug
  `media`, then set the **Hero Headline**, **Hero Background Video** (a
  direct `.mp4` URL — upload it to the Media Library and paste its File URL)
  and a Featured Image (shown while the video loads). Leaving these empty
  keeps the site's built-in hero.

Saving either one refreshes `/media` through the same revalidation webhook.
Check the GraphQL contract in GraphiQL with:

```graphql
{
  mediaPosts(first: 5) { nodes { title date excerpt videoUrl featuredImage { node { sourceUrl } } } }
  page(id: "media", idType: URI) { heroHeadline heroVideoUrl }
}
```

### Migrating the existing posts

`scripts/migrate-media.mjs` copies every post from the legacy backend's
`/getBlog` into draft Media Posts, moving images from Cloudinary into the
Media Library (see the script header for the env vars). It's safe to re-run
— existing slugs are skipped. Review each draft (the old posts used Unicode
"fake bold" letters, which the script turns back into plain text — re-apply
real bold where it matters), then publish.

Once the WordPress posts are live, stop adding posts in the old backend.
Keep it read-only for a few weeks as a fallback, then retire `/getBlog`.
The backend's `/news` endpoint still feeds the "Latest News" sync (see
below), so the backend itself stays up for now.

If a Media Library upload fails for large videos, raise
`upload_max_filesize` / `post_max_size` in Hostinger's PHP settings, or
use a YouTube link instead.

## 10. Every other page (`tvgf-core.php`)

`mu-plugins/tvgf-core.php` puts the rest of the site under WordPress control:

| Where in wp-admin | Controls |
|---|---|
| **Pages** › Home (`home`) | `/` — hero text/logo/buttons, crisis stats, How We Work pillars, Join the Movement |
| **Pages** › Anurag's Story (`story`) | `/story` — slides, videos |
| **Pages** › Our Strategy (`our-strategy`) | `/ourStrategy` — vision & mission, goals, values, gaps, engines, dual force, pillars, theory of change |
| **Pages** › Programs (`programs`) | `/programs` — hero, effort tiles & sections, programs list, SDG grid, Dushanbe conference + PDF |
| **Pages** › Learn (`learn`) | `/Learn` — hero, introduction, Explore links, section headings |
| **Pages** › Why Glaciers Matter (`glacier-matters`) | `/GlacierMatters` — all text, images, videos, the glacier-loss chart data and references |
| **Pages** › Collaborate (`collaborate`) | `/collaborate` — all text, cards, pathways, form link |
| **Pages** › Glacier Dialogues (`dialogues`) | `/glacier-dialogues` header — tagline, mission, register button |
| **Glossary Terms** | `/Learn` glossary (listed A–Z automatically) |
| **Quiz Questions** | `/Learn` quiz |
| **Glacier Profiles** | `/Learn` before/after glacier cards (sorted by the **Order** box) |
| **Site Settings** | Footer (tagline, logo, social links, founder, email, credits) and the default page title/description for search engines |

How it works:

- A Page is matched to a website page by its **slug** (in brackets above). Opening
  it shows one "… Page Content" box with every text, image and list on that
  page, grouped into sections. The page body editor is hidden because nothing
  on the site uses it.
- Lists (stats, cards, slides…) have **+ Add**, **↑ / ↓** and **Remove**
  buttons. Image, video and PDF fields have a **Choose from Media Library** button.
- Icons are picked from a dropdown of the icons the site's design supports.
- In headings like "Gaps We \*Bridge\*", the word in \*asterisks\* is shown in
  the accent colour. Fields marked "Basic HTML allowed" take `<strong>`, `<em>`,
  `<a href>`, `<p>` and `<ul><li>`.
- **Clearing a field hides it** on the site. A field that has never been saved
  (e.g. one added in a later code update) shows the site's built-in text.
- Clicking **Update** / **Save** refreshes the live page within seconds, like
  the other content types. If WordPress is ever unreachable, the site falls
  back to its built-in copy of this content instead of breaking.

The fields for each page — and the site's built-in copy of the content — live
in `mu-plugins/tvgf-core/schemas/*.json`. The Next.js app reads the same files,
so adding a field means editing that JSON (and using the new key in the page's
component), then re-uploading the `tvgf-core/` folder.

### Filling WordPress with the current content

Once `tvgf-core.php` is installed, run from the repo root:

```bash
WORDPRESS_SITE_URL=https://cms.thevoiceofglaciers.org \
WORDPRESS_PREVIEW_APP_USER=admin \
WORDPRESS_PREVIEW_APP_PASSWORD="xxxx xxxx xxxx xxxx xxxx xxxx" \
node scripts/migrate-site-content.mjs
```

It creates the eight Pages above with today's content already filled in, the
86 glossary terms, 22 quiz questions and 6 glacier profiles, and the Site
Settings — and copies every image, video and PDF into the Media Library
(from the GitHub asset repo, the hotlinked Bing/Britannica/Unsplash images,
and `public/`). It's safe to re-run: anything that already has content is
skipped (`--overwrite` resets it to the built-in content; replaced list items
go to the Trash). Files WordPress refuses are left at their old URL and listed
at the end — typically:

- **SVG icons** (Our Strategy gaps / dual-force) — WordPress blocks SVG uploads
  by default. Either leave them, or upload PNG versions and pick them in the fields.
- **Large videos** — over Hostinger's upload limit. Pass `--skip-videos` to
  leave videos where they are, or move them to the Media Library by hand.

After it runs, the public site looks exactly as before; from then on, edits
in wp-admin show up on the site.

## 11. Latest News (`tvgf-news.php`)

The "Latest News" section on `/media` shows **News Links** (wp-admin menu),
pinned ones first, then newest by publish date, up to 10.

- **Add one by hand:** News Links > Add New. Fill in the headline, Article
  Link, Source, Summary, and either upload an Image or paste an Image Link.
  Tick **Pin to top** to keep it first. Publishing refreshes `/media`
  within seconds.
- **Automatic sync:** News Links > **Sync Settings** imports new articles
  from `https://glacier-server.onrender.com/news` every 24 hours by default.
  From that screen you can turn it off, change how often it runs (every
  hour / 12 hours / 24 hours), choose whether imports go live immediately
  or wait as drafts for review, set how many days imported articles are
  kept (pinned and hand-added links are never removed), change the feed
  URL, and press **Sync now**. It also shows when the last sync ran, what
  it did, and when the next one is due.
- Imported items are ordinary News Links marked "Feed sync" in the list —
  edit or pin them freely; the sync never overwrites an existing item.
  Trash or delete one and it won't be imported again.

If WordPress itself is unreachable, the site reads the feed directly so the
section doesn't disappear (needs `BACKEND_URL` in the Next.js env).

**Make the schedule dependable on Hostinger.** WP-Cron only runs when
WordPress gets a request. Add `define( 'DISABLE_WP_CRON', true );` to
`wp-config.php` and create a real cron job in hPanel (Advanced > Cron Jobs)
that runs every 15 minutes:

```
wget -q -O - https://<your-wp-domain>/wp-cron.php?doing_wp_cron >/dev/null 2>&1
```
