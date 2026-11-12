/**
 * Classifies a Media Post's video link so the card knows whether to render a
 * YouTube/Vimeo embed or a native <video> for a direct file (e.g. a Media
 * Library .mp4). Returns null for empty or unrecognised links.
 */
export function parseVideoUrl(url) {
  if (!url) return null;

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1).split("/")[0];
    return id ? youtube(id) : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const id =
      parsed.searchParams.get("v") ||
      parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
    return id ? youtube(id) : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = parsed.pathname.match(/\/(\d+)/)?.[1];
    return id
      ? { kind: "vimeo", embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`, thumbnailUrl: null }
      : null;
  }
  if (/\.(mp4|webm|mov|m4v)$/i.test(parsed.pathname)) {
    return { kind: "file", src: url };
  }
  return null;
}

function youtube(id) {
  return {
    kind: "youtube",
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`,
    thumbnailUrl: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}
