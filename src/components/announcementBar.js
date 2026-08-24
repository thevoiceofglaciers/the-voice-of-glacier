import Link from "next/link";

function isInternalUrl(url) {
  return url.startsWith("/") || url.startsWith("#");
}

export default function AnnouncementBar({ announcement }) {
  if (!announcement) return null;

  const { title, description, ctaLabel, ctaUrl } = announcement;
  const hasCta = ctaLabel && ctaUrl;
  const internal = hasCta && isInternalUrl(ctaUrl);

  return (
    // Fixed and positioned directly below the (also-fixed) Navbar, whose
    // content height is h-14 — see src/components/navbar.js. Existing pages
    // already pad their content well past the navbar's height alone, so this
    // doesn't require touching per-page top padding in the common case.
    <div className="fixed top-14 inset-x-0 z-40 bg-glacier-primary text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
        <p className="text-sm">
          <span className="font-bold">{title}</span>
          {description && <span className="font-normal">{" — " + description}</span>}
        </p>
        {hasCta &&
          (internal ? (
            <Link
              href={ctaUrl}
              className="shrink-0 text-xs font-bold uppercase tracking-wide underline underline-offset-2 hover:no-underline"
            >
              {ctaLabel}
            </Link>
          ) : (
            <a
              href={ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-bold uppercase tracking-wide underline underline-offset-2 hover:no-underline"
            >
              {ctaLabel}
            </a>
          ))}
      </div>
    </div>
  );
}
