import { schemaDefaults, mergeContent, parseJson } from "@/lib/content";

const WORDPRESS_GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL;

const DIALOGUE_FIELDS = `
  id
  slug
  title
  dialogueDate
  speakerName
  videoLink
  dialogueSubtitle
  sessionNumber
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
  dialogueTopics {
    nodes {
      name
      slug
    }
  }
`;

async function wpFetch(query, variables = {}, { tags, revalidate, preview = false } = {}) {
  if (!WORDPRESS_GRAPHQL_URL) {
    throw new Error("WORDPRESS_GRAPHQL_URL is not set");
  }

  const headers = { "Content-Type": "application/json" };

  if (preview) {
    const user = process.env.WORDPRESS_PREVIEW_APP_USER;
    const pass = process.env.WORDPRESS_PREVIEW_APP_PASSWORD;
    if (user && pass) {
      headers.Authorization = `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`;
    }
  }

  const res = await fetch(WORDPRESS_GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    // Preview requests must always hit WordPress live, never the Data Cache.
    ...(preview ? { cache: "no-store" } : { next: { tags, revalidate: revalidate ?? 3600 } }),
  });

  if (!res.ok) {
    throw new Error(`WordPress GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(`WordPress GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data;
}

export function formatDialogueDate(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  // "23 May 2026" everywhere — day, then month, then year.
  return date.toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" });
}

function toCardShape(node) {
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    date: node.dialogueDate,
    speaker: node.speakerName,
    videoLink: node.videoLink,
    subtitle: node.dialogueSubtitle || null,
    sessionNumber: node.sessionNumber || null,
    image: node.featuredImage?.node?.sourceUrl || null,
    imageAlt: node.featuredImage?.node?.altText || node.title,
    topics: (node.dialogueTopics?.nodes || []).map((t) => t.name),
  };
}

/**
 * Fetches all published dialogues and splits them into upcoming/past by
 * comparing dialogueDate to now — status is derived, never manually set in WP.
 */
export async function getGlacierDialogues() {
  const query = `
    query GetGlacierDialogues {
      glacierDialogues(first: 100, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
        nodes {
          ${DIALOGUE_FIELDS}
        }
      }
    }
  `;

  const data = await wpFetch(query, {}, { tags: ["glacier-dialogues"], revalidate: 3600 });
  const nodes = data?.glacierDialogues?.nodes || [];
  const now = new Date();

  const upcoming = [];
  const past = [];

  for (const node of nodes) {
    const card = toCardShape(node);
    const isUpcoming = card.date && new Date(card.date) >= now;
    (isUpcoming ? upcoming : past).push(card);
  }

  // Upcoming soonest-first, past most-recent-first.
  upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
  past.sort((a, b) => new Date(b.date) - new Date(a.date));

  return { upcoming, past };
}

/**
 * Fetches the main site navigation from WordPress's native Menus feature
 * (Appearance > Menus, assigned to the "primary" location — see
 * wordpress/mu-plugins/tvgf-glacier-dialogues.php). Mapped into the exact
 * shape navbar.js already expects: { name, href, sublinks: [{label, href}] }.
 *
 * This now lives in the root layout, so a WordPress outage would otherwise
 * take down every route — deliberately swallows errors and returns null so
 * navbar.js can fall back to its hardcoded default links instead.
 */
export async function getMainMenu() {
  const query = `
    query GetMainMenu {
      menuItems(where: { location: PRIMARY }, first: 50) {
        nodes {
          id
          label
          url
          parentId
          order
          childItems(first: 20) {
            nodes { id label url order }
          }
        }
      }
    }
  `;

  try {
    const data = await wpFetch(query, {}, { tags: ["site-menu"], revalidate: 3600 });
    const nodes = data?.menuItems?.nodes || [];

    return nodes
      .filter((n) => !n.parentId)
      .sort((a, b) => a.order - b.order)
      .map((n) => ({
        name: n.label,
        href: n.url,
        sublinks: (n.childItems?.nodes || [])
          .sort((a, b) => a.order - b.order)
          .map((c) => ({ label: c.label, href: c.url })),
      }));
  } catch {
    return null;
  }
}

/**
 * Fetches the announcement bar shown below the main menu on every page —
 * the most recently published Announcement with "Active" still checked.
 * Same fail-closed reasoning as getMainMenu(): returns null on any error so
 * the bar just doesn't render rather than breaking every page.
 */
export async function getAnnouncement() {
  const query = `
    query GetAnnouncement {
      announcements(first: 5, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          description
          ctaLabel
          ctaUrl
          isActive
        }
      }
    }
  `;

  try {
    const data = await wpFetch(query, {}, { tags: ["announcement"], revalidate: 3600 });
    const nodes = data?.announcements?.nodes || [];
    const active = nodes.find((n) => n.isActive);
    if (!active) return null;

    return {
      title: active.title,
      description: active.description || "",
      ctaLabel: active.ctaLabel || "",
      ctaUrl: active.ctaUrl || "",
    };
  } catch {
    return null;
  }
}

// WPGraphQL's public (RENDERED) title/excerpt fields come through
// wptexturize, so "&" arrives as "&#038;", "..." as "&hellip;", etc. React
// would print those literally — decode the handful WordPress actually emits.
const NAMED_ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”" };

export function decodeEntities(str) {
  if (!str) return "";
  return str.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(n) ? match : String.fromCodePoint(n);
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

export function htmlToText(html) {
  return decodeEntities((html || "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function truncateWords(text, maxChars) {
  if (text.length <= maxChars) return text;
  const cut = text.slice(0, maxChars);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : maxChars).replace(/[\s,.;:–—-]+$/, "")}…`;
}

/**
 * Fetches the /media page feed (the "Media Posts" CPT from
 * wordpress/mu-plugins/tvgf-media.php), newest first. Returns [] on any
 * WordPress error so the page still renders its hero and news sections.
 */
export async function getMediaPosts() {
  const query = `
    query GetMediaPosts {
      mediaPosts(first: 100, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          slug
          title
          date
          excerpt
          content
          videoUrl
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  try {
    const data = await wpFetch(query, {}, { tags: ["media"], revalidate: 3600 });
    const nodes = data?.mediaPosts?.nodes || [];

    return nodes.map((node) => {
      const title = decodeEntities(node.title);
      // The auto-generated excerpt ends in "[…]" — drop it and re-truncate
      // to the card's length ourselves.
      const contentText = htmlToText(node.content);
      const excerptSource = htmlToText(node.excerpt).replace(/\s*\[…\]\s*$/, "") || contentText;
      let excerpt = truncateWords(excerptSource, 140);
      // Whether the modal has anything the card doesn't already show.
      const hasMore = contentText.length > excerpt.replace(/…$/, "").length;
      // A short hand-written excerpt still needs to read as "continued".
      if (hasMore && !excerpt.endsWith("…")) excerpt = `${excerpt.replace(/[\s,.;:–—-]+$/, "")}…`;

      return {
        id: node.id,
        slug: node.slug,
        title,
        date: node.date,
        excerpt,
        hasMore,
        contentHtml: node.content || "",
        videoUrl: node.videoUrl || null,
        imageUrl: node.featuredImage?.node?.sourceUrl || null,
        imageAlt: node.featuredImage?.node?.altText || title,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Hero fields for a core WordPress Page, matched by slug (e.g. "media").
 * Returns null on any error or when the Page doesn't exist, so callers fall
 * back to their built-in hero.
 */
export async function getPageHero(slug) {
  const query = `
    query GetPageHero($uri: ID!) {
      page(id: $uri, idType: URI) {
        heroHeadline
        heroVideoUrl
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  `;

  try {
    const data = await wpFetch(query, { uri: slug }, { tags: [`page:${slug}`], revalidate: 3600 });
    const page = data?.page;
    if (!page) return null;

    return {
      headline: page.heroHeadline || null,
      videoUrl: page.heroVideoUrl || null,
      posterUrl: page.featuredImage?.node?.sourceUrl || null,
    };
  } catch {
    return null;
  }
}

/**
 * Text, images and lists for a page described by a schema in
 * wordpress/mu-plugins/tvgf-core/schemas/pages (edited on the WordPress Page
 * with the schema's slug). Always resolves: saved values are merged over the
 * schema's defaults, and any WordPress error returns the defaults alone.
 */
export async function getPageContent(schema) {
  const defaults = schemaDefaults(schema);
  const query = `
    query GetPageContent($uri: ID!) {
      page(id: $uri, idType: URI) {
        pageContent
      }
    }
  `;

  try {
    const data = await wpFetch(query, { uri: schema.slug }, { tags: [`page:${schema.slug}`], revalidate: 3600 });
    return mergeContent(defaults, parseJson(data?.page?.pageContent));
  } catch {
    return defaults;
  }
}

/**
 * Published items of a collection (tvgf-core/schemas/collections), as
 * [{ id, title, ...fields }]. Falls back to the schema's built-in items when
 * WordPress is unreachable or the collection has no published items yet.
 */
export async function getCollection(schema) {
  const orderby =
    schema.orderBy === "TITLE"
      ? "[{ field: TITLE, order: ASC }]"
      : "[{ field: MENU_ORDER, order: ASC }, { field: TITLE, order: ASC }]";
  const query = `
    query GetCollection {
      ${schema.graphqlPlural}(first: 500, where: { status: PUBLISH, orderby: ${orderby} }) {
        nodes {
          databaseId
          title
          tvgfFields
        }
      }
    }
  `;
  const fallback = schema.defaults.map((item, i) => ({ id: `default-${i}`, ...item }));

  try {
    const data = await wpFetch(query, {}, { tags: [`collection:${schema.postType}`], revalidate: 3600 });
    const nodes = data?.[schema.graphqlPlural]?.nodes || [];
    if (nodes.length === 0) return fallback;

    return nodes.map((node) => ({
      ...(parseJson(node.tvgfFields) || {}),
      id: node.databaseId,
      title: decodeEntities(node.title),
    }));
  } catch {
    return fallback;
  }
}

/** Site Settings screen (footer, social links, SEO defaults), merged over its defaults. */
export async function getSiteSettings(schema) {
  const defaults = schemaDefaults(schema);
  const query = `
    query GetSiteSettings {
      tvgfSiteSettings
    }
  `;

  try {
    const data = await wpFetch(query, {}, { tags: ["site-settings"], revalidate: 3600 });
    return mergeContent(defaults, parseJson(data?.tvgfSiteSettings));
  } catch {
    return defaults;
  }
}

export async function getGlacierDialogueBySlug(slug, { preview = false } = {}) {
  const query = `
    query GetGlacierDialogueBySlug($slug: ID!) {
      glacierDialogue(id: $slug, idType: SLUG, asPreview: ${preview ? "true" : "false"}) {
        ${DIALOGUE_FIELDS}
        editorBlocks {
          name
          renderedHtml
          ... on TvgfContextStrip { attributes { items } }
          ... on TvgfSpeakerBio { attributes { name role org bio photoUrl photoAlt } }
          ... on TvgfStatTiles { attributes { tiles } }
          ... on TvgfCallout { attributes { variant title body } }
          ... on TvgfComparison { attributes { columns } }
          ... on TvgfTakeaways { attributes { items } }
          ... on TvgfDataTable { attributes { header rows } }
          ... on TvgfTwoPhase { attributes { leftHeader leftColor leftLead leftText rightHeader rightColor rightLead rightText } }
        }
      }
    }
  `;

  const data = await wpFetch(
    query,
    { slug },
    preview
      ? { preview: true }
      : { tags: ["glacier-dialogues", `glacier-dialogue:${slug}`], revalidate: 3600 }
  );

  const node = data?.glacierDialogue;
  if (!node) return null;

  return {
    ...toCardShape(node),
    blocks: (node.editorBlocks || []).map(normalizeBlockAttributes),
  };
}

// WPGraphQL Content Blocks serializes array-of-object attributes (declared as
// "type":"array", "items":{"type":"object"} in block.json) as a list whose
// elements are each individually JSON-encoded strings, not native objects —
// confirmed against a real WordPress instance. Flat string/number attributes
// (speaker-bio, callout) come through already-typed and need no parsing.
const JSON_ENCODED_ARRAY_FIELDS = {
  "tvgf/context-strip": "items",
  "tvgf/stat-tiles": "tiles",
  "tvgf/comparison": "columns",
  "tvgf/takeaways": "items",
  "tvgf/data-table": "rows",
};

function parseJsonEncodedArray(raw) {
  // Older/alternate shape: the whole array serialized as one JSON string.
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  // Current shape: a real list whose elements are each a JSON-encoded string.
  if (Array.isArray(raw)) {
    return raw.map((item) => {
      if (typeof item !== "string") return item;
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    });
  }
  return [];
}

function normalizeBlockAttributes(block) {
  const field = JSON_ENCODED_ARRAY_FIELDS[block.name];
  if (!field || !block.attributes) return block;

  return {
    ...block,
    attributes: { ...block.attributes, [field]: parseJsonEncodedArray(block.attributes[field]) },
  };
}
