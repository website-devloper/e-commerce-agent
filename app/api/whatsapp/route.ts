import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { runAssistant } from "@/lib/assistant";
import { rateLimit } from "@/lib/rateLimit";

const GRAPH_API = "https://graph.facebook.com/v19.0";

// ── Config check ──────────────────────────────────────────────────────────────

function isConfigured(): boolean {
  return !!(
    process.env.META_WHATSAPP_PHONE_NUMBER_ID &&
    process.env.META_WHATSAPP_ACCESS_TOKEN &&
    process.env.META_WHATSAPP_VERIFY_TOKEN
  );
}

// ── Signature verification — HMAC-SHA256 with App Secret ─────────────────────

function verifySignature(rawBody: Buffer, signature: string): boolean {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) return true; // skip in dev when not set
  if (!signature.startsWith("sha256=")) return false;
  const expected = crypto
    .createHmac("sha256", appSecret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature.slice(7), "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

// ── Send reply via Meta Graph API ─────────────────────────────────────────────

async function sendReply(to: string, text: string): Promise<void> {
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const accessToken   = process.env.META_WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !accessToken) return;

  // Split long replies — WhatsApp has a 4096-char limit per message
  const chunks = splitMessage(text, 4000);

  for (const chunk of chunks) {
    await fetch(`${GRAPH_API}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: chunk },
      }),
    });
  }
}

function splitMessage(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = start + maxLen;
    if (end < text.length) {
      const breakAt = text.lastIndexOf(". ", end);
      if (breakAt > start) end = breakAt + 1;
    }
    chunks.push(text.slice(start, end).trim());
    start = end;
  }
  return chunks;
}

// ── GET — Meta webhook verification ──────────────────────────────────────────
// Meta calls this once when you save the webhook URL in the dashboard.
// We must return the hub.challenge value to prove we own the endpoint.

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge ?? "", { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// ── POST — incoming WhatsApp messages from Meta ───────────────────────────────

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "WhatsApp not configured — add META_* vars to .env.local" },
      { status: 503 }
    );
  }

  // Read as raw bytes for signature verification
  const rawBody = Buffer.from(await req.arrayBuffer());

  // Verify Meta's HMAC-SHA256 signature in production
  if (process.env.NODE_ENV === "production") {
    const sig = req.headers.get("x-hub-signature-256") ?? "";
    if (!verifySignature(rawBody, sig)) {
      return new NextResponse("Invalid signature", { status: 403 });
    }
  }

  let payload: MetaPayload;
  try {
    payload = JSON.parse(rawBody.toString("utf8")) as MetaPayload;
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // Only handle whatsapp_business_account events
  if (payload.object !== "whatsapp_business_account") {
    return NextResponse.json({ status: "ok" });
  }

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;

      for (const message of change.value?.messages ?? []) {
        // Only handle text messages
        if (message.type !== "text") {
          await sendReply(message.from, "Sorry, I can only read text messages. Please type your question!");
          continue;
        }

        const from = message.from;
        const text = message.text?.body?.trim() ?? "";
        if (!from || !text) continue;

        // Rate-limit: 20 messages per number per minute
        const { allowed } = rateLimit(`wa:${from}`, 20, 60_000);
        if (!allowed) {
          await sendReply(from, "Too many messages — please wait a moment.");
          continue;
        }

        // Phone number = conversationId = userId → persistent memory across sessions
        const userId = `wa_${from.replace(/\W/g, "")}`;

        const { reply } = await runAssistant({
          message: text,
          conversationId: userId,
          channel: "whatsapp",
          userId,
        });

        await sendReply(from, reply);
      }
    }
  }

  // Meta requires 200 OK — any other status triggers a retry storm
  return NextResponse.json({ status: "ok" });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface MetaPayload {
  object: string;
  entry?: Array<{
    id: string;
    changes?: Array<{
      field: string;
      value?: {
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
        }>;
      };
    }>;
  }>;
}
