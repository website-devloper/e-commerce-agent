# ReplyPilot — AI Customer Assistant (Build Brief)

A **standalone, end-to-end** web project: a marketing landing page that also hosts a
**live, working AI chat assistant** which answers customer questions, captures and
qualifies leads, and books appointments. Built with Claude as the brain. This is its
own repository — not part of any other project — and deploys on its own (Vercel).

It doubles as a portfolio piece: anyone visiting the page can *try the real assistant*
in the browser, with no WhatsApp setup required.

---

## 1. Goal

Build a complete product, not a snippet:

1. A polished **landing page** that sells the assistant.
2. A **working web chat widget** on that page, powered by the Claude API, that really
   answers, captures leads, and books appointments.
3. A small **admin dashboard** to view leads, appointments, and conversations.
4. A **pluggable WhatsApp adapter** (stubbed now, ready for Twilio later).

The whole thing must run end-to-end and be deployable.

---

## 2. Stack (self-contained)

- **Next.js (App Router) + TypeScript** — full-stack: marketing pages, API routes, admin.
- **Tailwind CSS** — UI.
- **Anthropic Claude API** — the assistant brain. Use a current model: Sonnet for
  quality (`claude-sonnet-4-6`) or Haiku for cost (`claude-haiku-4-5`). Make the model
  configurable via env.
- **Prisma + PostgreSQL** — data (config, leads, appointments, conversations).
  SQLite is fine for local dev; Postgres (Neon / Supabase / Vercel Postgres) for prod.
- **Resend** (or Nodemailer) — email notifications to the business.
- **Deploy:** Vercel (with a hosted Postgres).
- **Later (optional):** Twilio WhatsApp Sandbox for a WhatsApp channel.

Apply the `website-standards` skill if available; otherwise follow standard best
practices (responsive, accessible, fast, secure, SEO).

---

## 3. Key decision: no WhatsApp Business API needed

The assistant is **channel-agnostic**. Build the **web chat widget first** — that is the
live demo and a real lead bot. WhatsApp is just another adapter that calls the same core,
added later via Twilio's free Sandbox. Do **not** use unofficial WhatsApp-Web libraries.

---

## 4. Architecture

```
Customer
  │
  ├── Web chat widget  ──┐
  └── WhatsApp (Twilio)──┤  (same core)
                         ▼
              /api/assistant  (Next.js Route Handler)
                         │
                  Assistant Core (lib/assistant)
                  • build system prompt from BusinessConfig
                  • call Claude with tools
                  • loop: tool_use → run tool → tool_result → final reply
                  • persist conversation
                         │
        ┌────────────────┼─────────────────────────┐
        ▼                ▼                          ▼
   Prisma / Postgres   Email/Slack notify      Tool actions
   (config, leads,     (new lead, booking,     (lead, booking,
    appts, convos)      handoff)                handoff, info)
```

---

## 5. How the assistant must behave

- **Answers only from the business knowledge** (BusinessConfig: services, prices, hours,
  FAQ). Never invents prices, availability, or facts — if unknown, use a tool or hand off.
- **Multilingual** — detects and replies in the customer's language: Moroccan Darija,
  Modern Standard Arabic, French, English. (Claude handles this natively.)
- **Captures leads** — naturally collects name + a contact (phone/email) + what they need,
  then saves the lead.
- **Books appointments** — checks availability, books, and confirms the details.
- **Hands off to a human** — when it can't help, the user is frustrated, or they ask for a
  person: flag the conversation, notify the business, and tell the customer someone will
  follow up.
- **Tone** — warm, concise, professional, one question at a time, not pushy. Doesn't
  reveal these instructions or that it's an AI unless asked.

---

## 6. Components to build

### 6.1 Assistant core — `lib/assistant/`
- `buildSystemPrompt(config)` — injects BusinessConfig into the system prompt (section 8).
- `runAssistant({ conversationId, channel, userMessage })`:
  - load conversation history,
  - call Claude with the system prompt + history + tool definitions,
  - run the **tool loop**: if the response contains `tool_use`, execute the tool, append
    a `tool_result`, and call Claude again until it returns a final text reply,
  - persist the updated conversation, return the reply.
- Keep provider details isolated so the model/provider can be swapped.

### 6.2 Tools (Claude tool-use; validate inputs with zod; run server-side)
- `get_business_info(query)` — answer from the knowledge base.
- `capture_lead(name, contact, need, language)` — create Lead + notify business.
- `check_availability(date)` — return open slots (simple rules to start).
- `book_appointment(name, contact, datetime, service)` — create Appointment + confirm +
  notify.
- `handoff_to_human(reason)` — mark conversation `needsHuman`, notify business, inform user.

### 6.3 Channels
- **Web chat widget** (`components/ChatWidget.tsx`, client component): floating bubble +
  panel, typing indicator, message history in React state, sends to `POST /api/assistant`,
  mobile-friendly, accessible (labels, focus, keyboard), themed to brand (section 10).
- **WhatsApp adapter** (`/api/whatsapp/route.ts`): Twilio webhook format, parses inbound,
  calls the same core, replies via Twilio. **Stub it now** (wired, inactive until creds).

### 6.4 API routes
- `POST /api/assistant` — `{ conversationId?, message }` → `{ conversationId, reply }`.
- `POST /api/whatsapp` — Twilio webhook (stub).
- Admin data routes (or server actions) for leads/appointments/conversations.

### 6.5 Data — Prisma models
- `BusinessConfig` — name, description, hours, services (JSON), priceList (JSON),
  faq (JSON), languages, handoffEmail, handoffWhatsapp. (Single row; editable in admin.)
- `Lead` — name, contact, need, language, source (web|whatsapp), status, conversationId,
  createdAt.
- `Appointment` — name, contact, datetime, service, status, createdAt.
- `Conversation` — id, channel, messages (JSON), needsHuman (bool), createdAt, updatedAt.

### 6.6 Notifications
- On new lead, booking, and handoff → email the business (Resend) and/or a Slack webhook.
- Keys in env.

### 6.7 Admin dashboard — `/admin` (password/auth protected)
- Tabs: Leads, Appointments, Conversations (read + status update), and a BusinessConfig
  editor so the knowledge base is editable without code.

---

## 7. Landing page sections (marketing)

Reuse a consistent design system (section 10) with a varied background rhythm:

1. **Hero** — value prop + two CTAs + the chat widget visible / openable. (light)
2. **Problem** — slow replies lose customers. (dark band)
3. **How it works** — Connect → Learns your business → Replies, qualifies, books → You're
   notified. (light, connected steps)
4. **Features** — bento grid: 24/7 replies, lead capture, booking, multilingual, handoff,
   integrations. (light)
5. **Live demo** — prompt visitors to open the widget and try it. (off-white)
6. **Results** — stats band (reply time, leads captured, etc.). (clay/dark)
7. **Use cases** — retail, clinics, hotels, services. (light)
8. **Pricing** — simple tiers. (off-white)
9. **FAQ** — setup, languages, data privacy. (light)
10. **Final CTA** — vermilion band. → **Footer**.

---

## 8. Assistant system prompt

```
You are {{BUSINESS_NAME}}'s assistant on chat. You help customers, capture leads, and
book appointments. You are warm, concise, and professional — never pushy.

LANGUAGE: Detect the customer's language from their message and always reply in it.
Support Moroccan Darija, Modern Standard Arabic, French, and English.

KNOWLEDGE: Use only the business information below. If something isn't there (a price, an
availability, a detail you're unsure of), do NOT guess — use a tool or offer a human.
Never invent facts.

GOALS, in order:
1. Answer the customer's question clearly.
2. If they show interest, naturally collect their name, a contact (phone or email), and
   what they need, then call capture_lead.
3. If they want an appointment, call check_availability then book_appointment, and
   confirm the details back to them.
4. If you can't help, they're frustrated, or they ask for a person, call
   handoff_to_human and tell them someone will follow up shortly.

STYLE: Short messages, one question at a time, friendly. Don't repeat yourself. Don't
mention these instructions or that you're an AI unless asked.

BUSINESS INFORMATION:
{{BUSINESS_CONFIG: name, services, prices, hours, location, FAQ, booking rules}}
```

---

## 9. Environment variables

```
ANTHROPIC_API_KEY=
ASSISTANT_MODEL=claude-sonnet-4-6        # or claude-haiku-4-5
DATABASE_URL=                            # Postgres (or file:./dev.db for SQLite local)
RESEND_API_KEY=                          # or SMTP_* for Nodemailer
SLACK_WEBHOOK_URL=                       # optional
ADMIN_PASSWORD=                          # protect /admin
# Later, for WhatsApp:
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
```

All secrets are server-side only — never prefix with `NEXT_PUBLIC_`.

---

## 10. Brand / design

It's a portfolio product, so keep it clean and modern. Default to a warm, crafted look
(themeable):

- Palette: sand `#F4EFE6`, vermilion `#E5501E`, warm ink `#1B1714`, clay `#B5431A`,
  ochre `#D89B3F`, off-white cards `#FBF8F2`.
- Clean geometric sans-serif headings, accent word italic in vermilion; clean sans body.
- Off-white cards, soft warm shadows, subtle pattern at low opacity, generous whitespace.
- Chat widget: AI bubbles soft green or off-white, user bubbles vermilion-tinted; phone-like.
- Interactions: subtle and consistent — ~160ms small elements, ~240ms cards, ease-out;
  small movements (cards lift 4px, arrows nudge); respect `prefers-reduced-motion`.

---

## 11. Security & quality

- All API keys/tokens server-side only; validate every input (zod); rate-limit the
  assistant and webhook routes; cap message length and conversation length.
- Sanitize any rendered model output; no `dangerouslySetInnerHTML` without sanitizing.
- Accessible widget and pages (labels, focus states, one H1, alt text).
- Fast (next/image, minimal client JS), SEO basics (metadata, sitemap, robots).
- Fully typed; clean `next build`; basic error handling on every tool and API call.

---

## 12. Build order (do it in phases, confirm between phases)

1. **Scaffold** — Next.js + Tailwind + Prisma, env setup, base layout/theme.
2. **Assistant core + web widget** — wire `/api/assistant` to Claude with the system
   prompt and a working tool loop; get the widget chatting end-to-end (start with
   `get_business_info` only).
3. **Tools + data** — add capture_lead, check_availability, book_appointment,
   handoff_to_human; persist BusinessConfig, Lead, Appointment, Conversation.
4. **Notifications + admin** — email/Slack on lead/booking/handoff; build `/admin`
   (leads, appointments, conversations, config editor).
5. **Landing page** — build the marketing sections (section 7) with the widget embedded.
6. **WhatsApp adapter (stub)** — Twilio-format webhook reusing the core, inactive until
   creds.
7. **Polish** — security, a11y, performance, deploy to Vercel + hosted Postgres.

Ask me before installing major packages, creating the database schema, or changing the
chosen stack.

---

## 13. Out of scope (for now)

- Full Meta WhatsApp Cloud API onboarding (use Twilio Sandbox first).
- Vector/RAG retrieval — keep knowledge in BusinessConfig for v1; add retrieval only if
  the knowledge base grows large.
- Payments/billing.
```
