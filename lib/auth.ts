import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "zb_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

// Derive a signed token from the password — never stores the raw password in the cookie.
// Token changes automatically when ADMIN_PASSWORD changes, invalidating all old sessions.
function deriveSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret || secret === "changeme") {
    console.warn(
      "[SECURITY] ADMIN_PASSWORD is not set or is the default 'changeme'. " +
      "Set a strong password in .env.local before deploying."
    );
  }
  return crypto
    .createHmac("sha256", secret ?? "changeme")
    .update("zina-beauty-admin-v1")
    .digest("base64url");
}

// Constant-time comparison prevents timing attacks.
function safeEqual(a: string, b: string): boolean {
  try {
    const aBuf = Buffer.from(a, "base64url");
    const bBuf = Buffer.from(b, "base64url");
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
  } catch {
    return false;
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, deriveSessionToken());
}

export async function createAdminSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, deriveSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",   // strictly no cross-site sending
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function destroyAdminSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
