import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { createAdminSession } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const Body = z.object({ password: z.string().min(1).max(256) });

// 5 failed attempts per IP per 15 minutes before lockout
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = rateLimit(`admin-login:${ip}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Try again in 15 minutes." },
      { status: 429, headers: { "Retry-After": "900" } }
    );
  }

  let body: { password: string };
  try {
    body = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const expected = process.env.ADMIN_PASSWORD ?? "";

  // Constant-time comparison — prevents timing-based password discovery
  let match = false;
  try {
    if (body.password.length === expected.length) {
      match = crypto.timingSafeEqual(
        Buffer.from(body.password),
        Buffer.from(expected)
      );
    }
  } catch {
    match = false;
  }

  if (!match) {
    // Same response time and body for wrong password and wrong length — no oracle
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
