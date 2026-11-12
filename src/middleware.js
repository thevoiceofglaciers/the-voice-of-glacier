import { NextResponse } from "next/server";

// Staging is a real custom domain (not *.vercel.app), so it needs an
// explicit noindex header — Vercel only auto-adds one for its own
// preview subdomains, not domains you attach yourself.
const NOINDEX_HOSTS = ["staging.thevoiceofglaciers.org"];

// next.config.js redirects() match case-insensitively, so a /Learn -> /learn
// rule there would also match "/learn" itself and loop. An exact string
// check here avoids that entirely.
const LEGACY_CASE_REDIRECTS = { "/Learn": "/learn" };

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const newPathname = LEGACY_CASE_REDIRECTS[pathname];
  if (newPathname) {
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();
  const host = request.headers.get("host") || "";

  if (NOINDEX_HOSTS.some((h) => host === h)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};
