import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runAssistant } from "@/lib/assistant";
import { rateLimit } from "@/lib/rateLimit";

const RequestSchema = z.object({
  conversationId: z.string().uuid().optional(),
  userId: z.string().min(1).max(128).optional(),
  message: z.string().min(1).max(2000),
});

// 20 messages per IP per minute
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, remaining } = rateLimit(`assistant:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": "60", "X-RateLimit-Remaining": "0" } }
    );
  }

  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await runAssistant(parsed.data);
    return NextResponse.json(result, {
      headers: { "X-RateLimit-Remaining": String(remaining) },
    });
  } catch (err) {
    console.error("[/api/assistant]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
