import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";

// Presence gate only: block cookie-less visitors from /dashboard/* early.
// Role is enforced inside pages (requireOrganizer) and APIs
// (requireOrganizerApi), which resolve the session from the DB + cache.
export function middleware(req: NextRequest): NextResponse {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!req.cookies.get(SESSION_COOKIE)?.value) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
