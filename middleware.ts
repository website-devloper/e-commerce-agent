import { NextRequest, NextResponse } from "next/server";

const ADMIN_API_PATHS = [
  "/api/admin/data",
  "/api/admin/config",
  "/api/admin/logout",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // ── 1. Force HTTPS in production ──────────────────────────────────────────
  if (
    process.env.NODE_ENV === "production" &&
    req.headers.get("x-forwarded-proto") === "http"
  ) {
    return NextResponse.redirect(
      `https://${req.headers.get("host")}${req.nextUrl.pathname}${req.nextUrl.search}`,
      301
    );
  }

  // ── 2. Block oversized bodies early (before API handlers) ─────────────────
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 64_000) {
    return new NextResponse(JSON.stringify({ error: "Payload too large" }), {
      status: 413,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── 3. Enforce Content-Type: application/json on JSON API routes ──────────
  //    (skip WhatsApp — GreenAPI webhook verified by instance ID, not Content-Type)
  if (
    req.method === "POST" &&
    pathname.startsWith("/api/") &&
    pathname !== "/api/whatsapp"
  ) {
    const ct = req.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) {
      return new NextResponse(
        JSON.stringify({ error: "Content-Type must be application/json" }),
        { status: 415, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // ── 4. Admin API routes: cookie check (belt-and-suspenders) ──────────────
  if (ADMIN_API_PATHS.some((p) => pathname.startsWith(p))) {
    const sessionCookie = req.cookies.get("zb_admin");
    if (!sessionCookie?.value) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // ── 5. Security response headers ──────────────────────────────────────────
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(self), geolocation=()");
  res.headers.set("X-DNS-Prefetch-Control", "on");

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
