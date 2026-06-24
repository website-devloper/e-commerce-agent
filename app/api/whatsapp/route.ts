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

// ── Signature verification ────────────────────────────────────────────────────

function verifySignature(rawBody: Buffer, signature: string): boolean {
  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) return true;
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

// ── Meta API helper ───────────────────────────────────────────────────────────

async function postMessage(body: object): Promise<void> {
  const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  const accessToken   = process.env.META_WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !accessToken) return;

  await fetch(`${GRAPH_API}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
}

// ── Plain text (with automatic splitting for long replies) ────────────────────

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

async function sendText(to: string, text: string): Promise<void> {
  for (const chunk of splitMessage(text, 4000)) {
    await postMessage({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: chunk },
    });
  }
}

// ── Interactive buttons (max 3) ───────────────────────────────────────────────

interface WaButton { id: string; title: string }

async function sendButtons(to: string, body: string, buttons: WaButton[]): Promise<void> {
  await postMessage({
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body.slice(0, 1024) },
      action: {
        buttons: buttons.slice(0, 3).map((b) => ({
          type: "reply",
          reply: { id: b.id, title: b.title.slice(0, 20) },
        })),
      },
    },
  });
}

// ── Interactive list (max 10 rows) ────────────────────────────────────────────

interface WaListRow { id: string; title: string; description?: string }

async function sendList(to: string, bodyText: string, sectionTitle: string, rows: WaListRow[]): Promise<void> {
  await postMessage({
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: bodyText.slice(0, 1024) },
      action: {
        button: "View products",
        sections: [{
          title: sectionTitle.slice(0, 24),
          rows: rows.slice(0, 10).map((r) => ({
            id: r.id,
            title: r.title.slice(0, 24),
            description: r.description?.slice(0, 72),
          })),
        }],
      },
    },
  });
}

// ── Smart reply: detect format from assistant reply ───────────────────────────
// Strategy:
//  • 3+ product prices in the reply → list message (products grid)
//  • 1–2 prices + clear order/yes-no question → buttons
//  • anything else → plain text

function countPrices(text: string): number {
  return (text.match(/\d+\s*(?:MAD|درهم|drhm)/gi) ?? []).length;
}

function hasYesNoSignal(text: string): boolean {
  return /bghiti\s*\?|bghit\s*\?|wesh bghit|voulez-vous|do you want|would you like|want (it|them|both)|les deux\?|nzidha l commande|ndir lik/i.test(text);
}

// Pull product lines out of the reply: "- Name (XXX MAD) — desc" or "Name: desc — XXX MAD"
function parseProductRows(text: string): WaListRow[] {
  const rows: WaListRow[] = [];
  const seen = new Set<string>();

  for (const line of text.split(/\n/)) {
    // Match: optional bullet, then name, then price
    const m = line.match(/[-•*]?\s*(.+?)\s*[\(:]?\s*(\d{2,4})\s*(?:MAD|درهم)/i);
    if (!m) continue;
    const raw = m[1].replace(/^[-•*\s]+/, "").replace(/[()]/g, "").trim();
    const price = m[2];
    if (raw.length < 3 || seen.has(raw)) continue;
    seen.add(raw);
    rows.push({
      id: `p${rows.length + 1}`,
      title: raw.slice(0, 24),
      description: `${price} MAD`,
    });
  }
  return rows;
}

function detectLang(text: string): "arabic" | "arabizi" | "french" | "english" {
  if (/[؀-ۿ]/.test(text)) return "arabic";
  if (/\b(bghit|3andi|wesh|kayn|mzyan|wakha|3afak|machi|daba|chno)\b/i.test(text)) return "arabizi";
  if (/\b(bonjour|merci|oui|non|vous|nous|voici|votre|livraison|commande)\b/i.test(text)) return "french";
  return "english";
}

function buildButtons(lang: ReturnType<typeof detectLang>): WaButton[] {
  switch (lang) {
    case "arabic":
      return [
        { id: "btn_yes",  title: "نعم، أريده" },
        { id: "btn_more", title: "مزيد من المعلومات" },
        { id: "btn_no",   title: "ليس الآن" },
      ];
    case "arabizi":
      return [
        { id: "btn_yes",  title: "Iyeh, bghitu" },
        { id: "btn_more", title: "3tini mazyan" },
        { id: "btn_no",   title: "Machi daba" },
      ];
    case "french":
      return [
        { id: "btn_yes",  title: "Oui, je veux" },
        { id: "btn_more", title: "Plus d'infos" },
        { id: "btn_no",   title: "Pas maintenant" },
      ];
    default:
      return [
        { id: "btn_yes",  title: "Yes, order it" },
        { id: "btn_more", title: "Tell me more" },
        { id: "btn_no",   title: "Not now" },
      ];
  }
}

async function sendSmartReply(to: string, reply: string): Promise<void> {
  const priceCount = countPrices(reply);
  const lang       = detectLang(reply);

  // 3+ products → list message
  if (priceCount >= 3) {
    const products = parseProductRows(reply);
    if (products.length >= 2) {
      // Use the non-product lines as the intro text
      const intro = reply
        .split(/\n/)
        .filter((l) => !l.match(/\d+\s*(?:MAD|درهم)/i) || l.split(/\n/).length === 1)
        .slice(0, 4)
        .join(" ")
        .trim()
        .slice(0, 500) || reply.slice(0, 500);

      await sendList(to, intro, "Our Products", products);
      return;
    }
  }

  // 1–2 products + yes/no question → buttons
  if (priceCount >= 1 && hasYesNoSignal(reply)) {
    await sendButtons(to, reply, buildButtons(lang));
    return;
  }

  // Default — plain text
  await sendText(to, reply);
}

// ── GET — Meta webhook verification ──────────────────────────────────────────

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

// ── POST — incoming WhatsApp messages ────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "WhatsApp not configured — add META_* env vars" },
      { status: 503 }
    );
  }

  const rawBody = Buffer.from(await req.arrayBuffer());

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

  if (payload.object !== "whatsapp_business_account") {
    return NextResponse.json({ status: "ok" });
  }

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;

      for (const message of change.value?.messages ?? []) {
        const from = message.from;
        if (!from) continue;

        // ── Extract user text ─────────────────────────────────────────────
        let userText: string;

        if (message.type === "text") {
          userText = message.text?.body?.trim() ?? "";
        } else if (message.type === "interactive") {
          // User tapped a button or selected a list item
          const ia = message.interactive;
          if (ia?.type === "button_reply") {
            userText = ia.button_reply?.title?.trim() ?? "";
          } else if (ia?.type === "list_reply") {
            userText = ia.list_reply?.title?.trim() ?? "";
          } else {
            continue;
          }
        } else {
          // image, audio, video, sticker, etc.
          await sendText(from, "Please type your message — I can read text and button replies 🙏");
          continue;
        }

        if (!userText) continue;

        // ── Rate limit ────────────────────────────────────────────────────
        const { allowed } = rateLimit(`wa:${from}`, 20, 60_000);
        if (!allowed) {
          await sendText(from, "Too many messages — please wait a moment.");
          continue;
        }

        // ── Run assistant ─────────────────────────────────────────────────
        // Phone number = stable conversationId + userId → persistent memory
        const userId = `wa_${from.replace(/\W/g, "")}`;

        const { reply } = await runAssistant({
          message: userText,
          conversationId: userId,
          channel: "whatsapp",
          userId,
        });

        // ── Send smart reply (text / buttons / list) ──────────────────────
        await sendSmartReply(from, reply);
      }
    }
  }

  // Meta requires 200 OK — any other status triggers a retry storm
  return NextResponse.json({ status: "ok" });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface MetaInteractive {
  type: "button_reply" | "list_reply";
  button_reply?: { id: string; title: string };
  list_reply?: { id: string; title: string; description?: string };
}

interface MetaMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  interactive?: MetaInteractive;
}

interface MetaPayload {
  object: string;
  entry?: Array<{
    id: string;
    changes?: Array<{
      field: string;
      value?: { messages?: MetaMessage[] };
    }>;
  }>;
}
