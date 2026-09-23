import { decodeEntities, htmlToText } from "@/lib/wp";

// Server-only: the automated "Latest News" feed comes from the legacy
// backend's /news proxy (NewsAPI-shaped: { articles: [{ title, description,
// url, urlToImage }] }). Fetched here on the server and cached for an hour
// rather than on every visit in the browser. NEXT_PUBLIC_BACKEND_URL is
// still accepted as a fallback until the deployment env is renamed.
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

const MAX_ARTICLES = 10;

// Publishers fall back to their site logo when an article has no photo
// (e.g. ".../newTsol_logo_socmedia.png"). Only the filename is checked —
// some CDNs have "/logo/" as a folder in every real image path.
function isPlaceholderImage(url) {
  try {
    const filename = new URL(url).pathname.split("/").pop() || "";
    return /logo/i.test(filename);
  } catch {
    return true;
  }
}

/**
 * Returns [] on any error so the page just omits the section.
 */
export async function getGlacierNews() {
  if (!BACKEND_URL) return [];

  try {
    const res = await fetch(`${BACKEND_URL}/news`, { next: { tags: ["news"], revalidate: 3600 } });
    if (!res.ok) return [];

    const data = await res.json();
    const raw = Array.isArray(data) ? data : data?.articles || [];
    const seen = new Set();

    return raw
      .filter((a) => a?.title && a?.url && a?.urlToImage && !isPlaceholderImage(a.urlToImage))
      .filter((a) => (seen.has(a.url) ? false : seen.add(a.url)))
      .slice(0, MAX_ARTICLES)
      .map((a) => ({
        title: decodeEntities(a.title),
        description: htmlToText(a.description),
        url: a.url,
        imageUrl: a.urlToImage,
      }));
  } catch {
    return [];
  }
}
