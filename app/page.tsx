import type { Metadata } from "next";
import ChatWidget from "@/components/ChatWidget";
import { ScrollToDemoButton, ScrollToTopButton } from "@/components/HeroButtons";
import {
  MessageCircle, Zap, Users, Globe, ShieldCheck,
  Star, CheckCircle, Clock, ShoppingBag, Sparkles, Heart, Truck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Zina Beauty — AI Beauty Shopping Assistant",
  description: "Your personal AI beauty advisor for premium Moroccan cosmetics. Get tailored skincare recommendations, instant answers, and easy ordering — 24/7.",
};

const D = "#1A1028"; // dark
const G = "#C4963A"; // gold
const BG = "#FAF8F4"; // background
const CARD = "#FFFFFF";
const SURF = "#F4EFF8"; // surface

export default function Home() {
  return (
    <>
      {/* ── NAV ──────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur-md" style={{ backgroundColor: "rgba(250,248,244,0.85)", borderBottom: "1px solid rgba(26,16,40,0.07)" }}>
        <a href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: `linear-gradient(135deg, ${D} 0%, #3A2050 100%)` }}>Z</span>
          <span className="text-lg font-bold tracking-tight" style={{ fontFamily: "var(--font-playfair)", color: D }}>Zina <em className="not-italic" style={{ color: G }}>Beauty</em></span>
        </a>
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium" style={{ color: "#6B6580" }}>
          <a href="#features" className="hover:text-[#1A1028] transition-colors">Features</a>
          <a href="#products" className="hover:text-[#1A1028] transition-colors">Products</a>
          <a href="#demo" className="hover:text-[#1A1028] transition-colors">Try it</a>
        </div>
        <a href="#demo"
          className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
          style={{ background: `linear-gradient(135deg, ${G} 0%, #D4A84A 100%)` }}>
          Chat Now
        </a>
      </nav>

      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-28 text-center" style={{ backgroundColor: BG }}>
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-[0.06]" style={{ background: `radial-gradient(circle, ${G} 0%, transparent 70%)` }} />
          <div className="absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full opacity-[0.05]" style={{ background: `radial-gradient(circle, #6B3F7A 0%, transparent 70%)` }} />
        </div>
        <div className="relative mx-auto max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: `${G}15`, color: G, border: `1px solid ${G}30` }}>
            <Sparkles className="h-3 w-3" />
            AI-Powered Beauty Shopping
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl" style={{ fontFamily: "var(--font-playfair)", color: D }}>
            Your skin deserves<br />
            <em style={{ color: G, fontStyle: "italic" }}>the right products</em>,<br />
            not guesswork.
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed" style={{ color: "#6B6580" }}>
            Meet your personal AI beauty advisor. Tell it your skin type, your concerns, your budget — and it finds the perfect Moroccan cosmetics for you, instantly.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <ScrollToDemoButton />
            <a href="#features" className="flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80" style={{ color: D }}>
              See how it works →
            </a>
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm" style={{ color: "#8A8298" }}>
            {["23 premium products", "Free delivery over 350 MAD", "Darija · French · English · Arabic"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" style={{ color: G }} />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. TRUST BAR ─────────────────────────────────────────────────────── */}
      <section className="py-5 px-6" style={{ backgroundColor: D }}>
        <div className="mx-auto max-w-4xl flex flex-wrap items-center justify-center gap-x-12 gap-y-3">
          {[
            { label: "Response time", value: "< 3 seconds" },
            { label: "Languages", value: "4 supported" },
            { label: "Availability", value: "24 / 7" },
            { label: "Products", value: "23 in catalogue" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: G }}>{s.value}</span>
              <span className="text-xs uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. PROBLEM ───────────────────────────────────────────────────────── */}
      <section className="px-6 py-24" style={{ backgroundColor: SURF }}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-5 text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: D }}>
            Stop wasting money on products<br />that don&apos;t work for <em style={{ color: G, fontStyle: "italic" }}>your</em> skin
          </h2>
          <p className="mb-12 text-lg leading-relaxed" style={{ color: "#6B6580" }}>
            Every skin is different. Without personalised guidance, most people buy the wrong products — and blame their skin. Our AI fixes that in seconds.
          </p>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { stat: "68%", desc: "of online shoppers leave without buying because they can't find the right product" },
              { stat: "3 min", desc: "average time to get a fully personalised routine recommendation from our assistant" },
              { stat: "24/7", desc: "availability — no waiting for business hours, no unanswered WhatsApp messages" },
            ].map((s) => (
              <div key={s.stat} className="rounded-2xl p-7 text-left" style={{ backgroundColor: CARD, boxShadow: "0 2px 16px rgba(26,16,40,0.06)" }}>
                <p className="mb-2 text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: G }}>{s.stat}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#6B6580" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-24" style={{ backgroundColor: BG }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: G }}>How it works</p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: D }}>
              From first message to doorstep<br />in under 5 minutes
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                n: "01", icon: <MessageCircle className="h-5 w-5" />,
                title: "Tell us about your skin",
                desc: "Share your skin type, concerns (acne, dryness, pigmentation…), or simply describe what you want. Use Darija, French, Arabic, or English.",
              },
              {
                n: "02", icon: <Sparkles className="h-5 w-5" />,
                title: "Get your personalised picks",
                desc: "Our AI analyses your profile and recommends exact products — with ingredients, how to use, prices, and whether they work together.",
              },
              {
                n: "03", icon: <ShoppingBag className="h-5 w-5" />,
                title: "Order directly in the chat",
                desc: "Confirm your address and choose how to pay. Get an order reference number and tracking — no forms, no checkout, no friction.",
              },
            ].map((s) => (
              <div key={s.n} className="relative rounded-2xl p-7" style={{ backgroundColor: CARD, boxShadow: "0 2px 16px rgba(26,16,40,0.06)" }}>
                <span className="absolute right-5 top-5 text-5xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: `${G}18` }}>{s.n}</span>
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${D} 0%, #3A2050 100%)` }}>
                  {s.icon}
                </div>
                <h3 className="mb-2 font-bold" style={{ fontFamily: "var(--font-playfair)", color: D, fontSize: "1.05rem" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B6580" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. FEATURES BENTO ────────────────────────────────────────────────── */}
      <section className="px-6 py-24" style={{ backgroundColor: D }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: G }}>Capabilities</p>
            <h2 className="text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: "var(--font-playfair)" }}>
              Everything a real beauty advisor does —<br />
              <em style={{ color: G, fontStyle: "italic" }}>at the speed of AI</em>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Clock className="h-5 w-5" />, title: "Instant 24/7 Answers", desc: "Questions answered in under 3 seconds, at any hour. No hold music. No waiting until Monday." },
              { icon: <Heart className="h-5 w-5" />, title: "Skin Analysis & Routine Building", desc: "Share your skin type and concerns — get a complete morning or evening routine with the right products in order." },
              { icon: <Star className="h-5 w-5" />, title: "Personalised Recommendations", desc: "The AI remembers your preferences across sessions and improves its suggestions over time." },
              { icon: <Globe className="h-5 w-5" />, title: "Speaks Moroccan Darija", desc: "Communicate naturally in Darija, French, Arabic, or English. The AI detects your language automatically." },
              { icon: <Truck className="h-5 w-5" />, title: "Order & Track in Chat", desc: "Place orders, receive confirmation numbers, and track your delivery — without ever leaving the conversation." },
              { icon: <Users className="h-5 w-5" />, title: "Human Handoff When Needed", desc: "For complex situations, the AI connects you with a real team member and notifies them immediately." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl text-white" style={{ backgroundColor: `${G}25`, color: G }}>
                  {f.icon}
                </div>
                <h3 className="mb-2 font-semibold text-white" style={{ fontFamily: "var(--font-playfair)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. LIVE DEMO ─────────────────────────────────────────────────────── */}
      <section id="demo" className="px-6 py-24" style={{ backgroundColor: BG }}>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: `${G}12`, color: G, border: `1px solid ${G}25` }}>
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Live now — no sign up required
          </div>
          <h2 className="mb-5 text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: D }}>
            Try your personal beauty advisor right now
          </h2>
          <p className="mb-10 text-lg leading-relaxed" style={{ color: "#6B6580" }}>
            Click the chat bubble in the bottom-right corner. It&apos;s the real thing — not a demo, not scripted replies. Ask it anything.
          </p>
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {[
              `"I have oily skin, what should I use?"`,
              `"Build me a morning skincare routine"`,
              `"Fin kayn argan oil?"`,
              `"What's your return policy?"`,
              `"I want something for dark spots"`,
            ].map((q) => (
              <span key={q} className="rounded-full px-4 py-2 text-sm font-medium cursor-default"
                style={{ backgroundColor: CARD, color: D, border: "1.5px solid rgba(26,16,40,0.1)", boxShadow: "0 2px 8px rgba(26,16,40,0.05)" }}>
                {q}
              </span>
            ))}
          </div>
          <ScrollToDemoButton />
        </div>
      </section>

      {/* ── 7. PRODUCTS ──────────────────────────────────────────────────────── */}
      <section id="products" className="px-6 py-24" style={{ backgroundColor: SURF }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: G }}>Our catalogue</p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: D }}>
              23 premium Moroccan cosmetics —<br />the assistant knows them all
            </h2>
            <p className="mt-4 text-base" style={{ color: "#6B6580" }}>
              Ask for any category or describe what you need — the AI finds the right match instantly.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { cat: "Skincare", emoji: "✨", items: ["Argan Oil Face Serum", "Vitamin C Brightening Cream", "Ghassoul Clay Mask", "Retinol Night Cream", "SPF 50 Sunscreen"], accent: "#7C4D6E" },
              { cat: "Makeup", emoji: "💄", items: ["Matte Foundation", "Long-Lasting Lipstick", "18-Shade Eyeshadow", "Kajal Eyeliner", "Setting Spray"], accent: "#B87A8E" },
              { cat: "Haircare", emoji: "✦", items: ["Argan Oil Treatment", "Moisturizing Shampoo", "Deep Conditioning Mask", "Anti-Frizz Serum"], accent: "#C4963A" },
              { cat: "Body", emoji: "🧴", items: ["Beldi Black Soap", "Hammam Kessa Glove", "Rose Body Lotion", "Argan Body Oil"], accent: "#3A5C50" },
              { cat: "Fragrance", emoji: "🌸", items: ["Oud Rose EDP", "Jasmine & White Musk", "Atlas Cedar Cologne"], accent: "#1A1028" },
            ].map((cat) => (
              <div key={cat.cat} className="rounded-2xl p-5 transition-all hover:-translate-y-1 duration-200" style={{ backgroundColor: CARD, boxShadow: "0 2px 16px rgba(26,16,40,0.06)" }}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: cat.accent }}>{cat.cat}</span>
                </div>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-1.5 text-xs leading-snug" style={{ color: "#6B6580" }}>
                      <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: cat.accent }} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. POLICIES ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-24" style={{ backgroundColor: BG }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: G }}>Our promise</p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: D }}>Simple. Transparent. Yours.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: <Truck className="h-5 w-5" />, title: "Free Delivery", desc: "Orders over 350 MAD ship free across Morocco. Standard delivery 30 MAD. Express next-day in Casablanca for 50 MAD." },
              { icon: <ShieldCheck className="h-5 w-5" />, title: "14-Day Returns", desc: "Changed your mind? Return unopened products within 14 days, no questions asked. Damaged items replaced within 48 hours." },
              { icon: <Zap className="h-5 w-5" />, title: "Pay on Delivery", desc: "Cash on delivery — pay when your order arrives. We also accept card and bank transfer." },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl p-7" style={{ backgroundColor: CARD, boxShadow: "0 2px 16px rgba(26,16,40,0.06)" }}>
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${G}15`, color: G }}>
                  {p.icon}
                </div>
                <h3 className="mb-2 font-bold" style={{ fontFamily: "var(--font-playfair)", color: D }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B6580" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ───────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24" style={{ backgroundColor: SURF }}>
        <div className="mx-auto max-w-2xl">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: G }}>FAQ</p>
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-playfair)", color: D }}>Common questions</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "What languages does the assistant speak?", a: "Moroccan Darija, Modern Standard Arabic, French, and English. It detects your language automatically — no need to switch." },
              { q: "Can I actually place an order through the chat?", a: "Yes — tell the assistant what you want, share your name, number, and address, and it confirms your order with a reference number on the spot." },
              { q: "Are the products authentic and safe?", a: "All products are sourced from certified suppliers and meet Moroccan cosmetic safety standards. Our argan and ghassoul are 100% natural, straight from Moroccan producers." },
              { q: "What if I have a complicated request?", a: "The assistant handles the vast majority of questions automatically. For anything beyond its scope, it instantly connects you with a real person from our team." },
              { q: "Is my personal data safe?", a: "We only collect what's needed to process your order. We never sell or share your information with third parties." },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl" style={{ backgroundColor: CARD, boxShadow: "0 2px 12px rgba(26,16,40,0.05)" }}>
                <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-sm font-semibold list-none gap-4" style={{ color: D }}>
                  <span>{f.q}</span>
                  <span className="shrink-0 rounded-full h-6 w-6 flex items-center justify-center transition-transform group-open:rotate-45 text-lg font-light" style={{ backgroundColor: `${G}15`, color: G }}>+</span>
                </summary>
                <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "#6B6580" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-28 text-center" style={{ background: `linear-gradient(135deg, ${D} 0%, #2E1A48 60%, #1A1028 100%)` }}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[600px] rounded-full opacity-10" style={{ background: `radial-gradient(ellipse, ${G} 0%, transparent 70%)` }} />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: G }}>Ready when you are</p>
          <h2 className="mb-5 text-4xl font-bold text-white sm:text-5xl" style={{ fontFamily: "var(--font-playfair)" }}>
            Your perfect skincare routine<br />
            <em style={{ color: G, fontStyle: "italic" }}>starts with one message</em>
          </h2>
          <p className="mb-10 text-lg" style={{ color: "rgba(255,255,255,0.6)" }}>
            No sign-up. No app download. No waiting. Just open the chat and meet your personal beauty advisor.
          </p>
          <ScrollToTopButton />
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="px-6 py-10" style={{ backgroundColor: "#120D1E" }}>
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#FAF8F4" }}>
            Zina <em className="not-italic" style={{ color: G }}>Beauty</em>
          </span>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Zina Beauty. All rights reserved. Casablanca, Morocco.
          </p>
          <div className="flex gap-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            <a href="/admin" className="hover:text-white transition-colors">Admin</a>
            <a href="mailto:hichamsabbar80@gmail.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </>
  );
}
