const WORDPRESS_GRAPHQL_URL = process.env.WORDPRESS_GRAPHQL_URL;

const DIALOGUE_FIELDS = `
  id
  slug
  title
  dialogueDate
  speakerName
  videoLink
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
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function toCardShape(node) {
  return {
    id: node.id,
    slug: node.slug,
    title: node.title,
    date: node.dialogueDate,
    speaker: node.speakerName,
    videoLink: node.videoLink,
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
