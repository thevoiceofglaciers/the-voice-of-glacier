import Link from "next/link";

function isInternalUrl(url) {
  return url.startsWith("/") || url.startsWith("#");
}

export default function AnnouncementBar({ announcement, navbarVisible = true }) {
  if (!announcement) return null;

  const { title, description, ctaLabel, ctaUrl } = announcement;
  const hasCta = ctaLabel && ctaUrl;
  const internal = hasCta && isInternalUrl(ctaUrl);

  return (
    // Fixed, sitting directly below the (also-fixed) Navbar, whose content
    // height is h-14 — see src/components/navbar.js. When the navbar hides
    // itself on scroll-down, it slides up to top-0 instead of staying
    // pinned below an invisible navbar (navbarVisible comes from the shared
    // scroll state in src/components/siteHeader.js).
    <div
      className={`fixed inset-x-0 z-40 bg-glacier-primary text-white transition-[top] duration-300 ${
        navbarVisible ? "top-14" : "top-0"
      }`}
    >
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
