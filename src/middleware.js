import { NextResponse } from "next/server";

// Staging is a real custom domain (not *.vercel.app), so it needs an
// explicit noindex header — Vercel only auto-adds one for its own
// preview subdomains, not domains you attach yourself.
const NOINDEX_HOSTS = ["staging.thevoiceofglaciers.org"];

export function middleware(request) {
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
