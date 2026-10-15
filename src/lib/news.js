import { decodeEntities, htmlToText, getNewsLinks } from "@/lib/wp";

// The "Latest News" section on /media. Its source of truth is WordPress's
// News Links (wordpress/mu-plugins/tvgf-news.php): links editors add by hand
// plus articles a scheduled sync imports from the legacy backend's /news feed.
// If WordPress itself is unreachable, read that feed directly instead so the
// section doesn't vanish. NEXT_PUBLIC_BACKEND_URL is still accepted as a
// fallback until the deployment env is renamed.
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

function sourceFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * Returns [] when neither WordPress nor the feed can be read, so the page
 * just omits the section.
 */
export async function getGlacierNews() {
  try {
    const links = await getNewsLinks();
    return links.slice(0, MAX_ARTICLES).map((a) => ({ ...a, source: a.source || sourceFromUrl(a.url) }));
  } catch {
    return getFeedNews();
  }
}

async function getFeedNews() {
  if (!BACKEND_URL) return [];

  try {
    const res = await fetch(`${BACKEND_URL.replace(/\/+$/, "")}/news`, { next: { tags: ["news"], revalidate: 3600 } });
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
        source: a.source?.name || sourceFromUrl(a.url),
        isPinned: false,
      }));
  } catch {
    return [];
  }
}
