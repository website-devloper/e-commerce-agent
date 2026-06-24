import type { Metadata } from "next";
import ChatWidget from "@/components/ChatWidget";
import { ScrollToDemoButton, ScrollToTopButton } from "@/components/HeroButtons";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "Zina Beauty",
  description: "Premium Moroccan cosmetics. Ask the assistant, get the right products, order in the chat.",
};

const D = "#1A1028";
const G = "#C4963A";
const SPACE = "var(--font-space)";
const JAKARTA = "var(--font-jakarta)";

export default function Home() {
  return (
    <>
      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur-md"
        style={{ backgroundColor: "rgba(250,248,244,0.92)", borderBottom: "1px solid rgba(26,16,40,0.07)" }}>
        <a href="/" className="flex items-center gap-2.5">
          <span className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: D }}>Z</span>
          <span className="font-bold tracking-tight" style={{ fontFamily: SPACE, color: D, fontSize: "1.05rem" }}>
            Zina<span style={{ color: G }}> Beauty</span>
          </span>
        </a>
        <div className="hidden sm:flex items-center gap-7 text-sm font-medium" style={{ color: "#6B6580" }}>
          <a href="#products" className="hover:text-[#1A1028] transition-colors">Catalogue</a>
          <a href="#demo" className="hover:text-[#1A1028] transition-colors">Try it</a>
        </div>
        <a href="#demo"
          className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: D }}>
          Open chat
        </a>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-24" style={{ backgroundColor: "#FAF8F4" }}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-14 lg:grid-cols-[1fr_420px] lg:items-center">

            {/* Left */}
            <div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-widest" style={{ color: G }}>
                Moroccan cosmetics · Casablanca
              </p>
              <h1 style={{ fontFamily: JAKARTA, color: D, fontSize: "clamp(3.2rem, 8vw, 5.5rem)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.02em" }} className="mb-6">
                Ask before<br />you buy.
              </h1>
              <p className="mb-9 text-lg leading-relaxed" style={{ color: "#6B6580", maxWidth: "400px", fontFamily: JAKARTA }}>
                Describe your skin. Zina finds the right products, builds your routine, and takes your order — all in one conversation.
              </p>
              <div className="flex flex-wrap gap-3">
                <ScrollToDemoButton />
                <a href="#products"
                  className="rounded-full border px-6 py-3.5 text-sm font-semibold transition-all hover:bg-black/5"
                  style={{ borderColor: "rgba(26,16,40,0.18)", color: D }}>
                  Browse catalogue
                </a>
              </div>
            </div>

            {/* Right — mock chat */}
            <div>
              <div className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(26,16,40,0.09)", boxShadow: "0 20px 60px rgba(26,16,40,0.13)" }}>
                <div className="flex items-center gap-3 px-4 py-3.5" style={{ backgroundColor: D }}>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: G, color: D, fontFamily: SPACE }}>Z</div>
                  <div>
                    <p className="text-sm font-semibold text-white" style={{ fontFamily: SPACE }}>Zina Beauty</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Online now</p>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-4 space-y-3">
                  {[
                    { from: "zina", text: "Hi! Tell me your skin type and I'll find the perfect products for you." },
                    { from: "user", text: "I have oily skin with dark spots" },
                    { from: "zina", text: <>For oily skin + dark spots: <strong>Vitamin C Cream (245 MAD)</strong> clears spots in 4–6 weeks. Want to order it?</> },
                    { from: "user", text: "Yes, order it" },
                  ].map((m, i) => (
                    <div key={i} className={`flex gap-2 items-end ${m.from === "user" ? "justify-end" : ""}`}>
                      {m.from === "zina" && (
                        <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ backgroundColor: G, color: D }}>Z</div>
                      )}
                      <div className="rounded-2xl px-3.5 py-2.5 text-sm max-w-[80%]"
                        style={m.from === "zina"
                          ? { backgroundColor: "#F4EFF8", color: D, borderBottomLeftRadius: "4px" }
                          : { backgroundColor: D, color: "#fff", borderBottomRightRadius: "4px" }}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 border-t px-3 py-3" style={{ borderColor: "rgba(26,16,40,0.07)" }}>
                  <div className="flex-1 rounded-xl px-3 py-2 text-sm" style={{ backgroundColor: "#FAF8F4", color: "rgba(26,16,40,0.3)" }}>
                    Type a message…
                  </div>
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: D }}>
                    <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-center" style={{ color: "#9B8FAC" }}>
                Responds in Darija, French & English
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT DOES — editorial horizontal list ─────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: D }}>
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-14 text-4xl font-bold text-white sm:text-5xl"
            style={{ fontFamily: SPACE, letterSpacing: "-0.02em" }}>
            Not a chatbot.<br />An advisor.
          </h2>
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
            {[
              { n: "01", title: "Knows your skin", body: "Tell it once. It remembers your type, concerns, and what worked before." },
              { n: "02", title: "Builds routines", body: "Morning, evening, or weekly — a full plan with real prices." },
              { n: "03", title: "Takes orders", body: "Name, phone, city. Done. You get a reference number on the spot." },
              { n: "04", title: "Speaks Darija", body: "No stiff formal Arabic. Chat exactly the way you text a friend." },
            ].map((c) => (
              <div key={c.n} className="p-6" style={{ backgroundColor: D }}>
                <p className="mb-4 text-xs font-semibold" style={{ color: G, fontFamily: SPACE }}>{c.n}</p>
                <p className="mb-2 text-base font-semibold text-white" style={{ fontFamily: SPACE }}>{c.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ────────────────────────────────────────────────────────── */}
      <section id="products" className="px-6 py-20" style={{ backgroundColor: "#FAF8F4" }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: SPACE, color: D, letterSpacing: "-0.02em" }}>
                The catalogue
              </h2>
              <p className="mt-2 text-base" style={{ color: "#6B6580" }}>
                Ask about any of these — or just describe what you need.
              </p>
            </div>
            <a href="#demo"
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 shrink-0"
              style={{ backgroundColor: D }}>
              Ask about a product
            </a>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Argan Oil Face Serum", size: "50ml", price: "189 MAD", cat: "Skincare" },
              { name: "Vitamin C Brightening Cream", size: "50ml", price: "245 MAD", cat: "Skincare" },
              { name: "Ghassoul Clay Mask", size: "200g", price: "79 MAD", cat: "Skincare" },
              { name: "SPF 50 Sunscreen", size: "75ml", price: "165 MAD", cat: "Skincare" },
              { name: "Retinol Night Cream", size: "50ml", price: "285 MAD", cat: "Skincare" },
              { name: "Matte Foundation", size: "30ml · 12 shades", price: "220 MAD", cat: "Makeup" },
              { name: "Long-Lasting Lipstick", size: "18 shades", price: "89 MAD", cat: "Makeup" },
              { name: "18-Shade Eyeshadow Palette", size: "", price: "199 MAD", cat: "Makeup" },
              { name: "Pure Argan Oil Hair Treatment", size: "100ml", price: "159 MAD", cat: "Haircare" },
              { name: "Moisturizing Shampoo", size: "400ml", price: "95 MAD", cat: "Haircare" },
              { name: "Beldi Black Soap", size: "300g", price: "69 MAD", cat: "Body" },
              { name: "Oud Rose Eau de Parfum", size: "50ml", price: "299 MAD", cat: "Fragrance" },
            ].map((p) => (
              <div key={p.name}
                className="rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(26,16,40,0.07)" }}>
                <div className="mb-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: G }}>{p.cat}</div>
                <p className="mb-1 text-sm font-semibold leading-snug" style={{ color: D, fontFamily: JAKARTA }}>{p.name}</p>
                {p.size && <p className="text-xs" style={{ color: "#9B8FAC" }}>{p.size}</p>}
                <p className="mt-2.5 text-sm font-bold" style={{ color: D, fontFamily: SPACE }}>{p.price}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm" style={{ color: "#9B8FAC" }}>
            + Rose Water Toner, Kajal, Setting Spray, Kessa Glove, Rose Body Lotion, Argan Body Oil, Anti-Frizz Serum, Deep Conditioning Mask, Jasmine EDP, Atlas Cedar Cologne
          </p>
        </div>
      </section>

      {/* ── DEMO ────────────────────────────────────────────────────────────── */}
      <section id="demo" className="px-6 py-20" style={{ backgroundColor: "#F0EBF5" }}>
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-sm font-medium" style={{ color: "#6B6580" }}>Online right now</p>
          </div>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl" style={{ fontFamily: SPACE, color: D, letterSpacing: "-0.02em" }}>
            Try it. No sign-up,<br />no waiting.
          </h2>
          <p className="mb-8 text-base leading-relaxed" style={{ color: "#6B6580" }}>
            Click the chat button. Ask in Darija, French, or English. Not scripted — ask anything about your skin, the products, or place a real order.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "3andi jeld dhn, ch n9der dir?",
              "Build me a morning routine",
              "Bch7al l argan oil?",
              "I have sensitive skin",
            ].map((q) => (
              <span key={q} className="rounded-full px-4 py-2 text-sm"
                style={{ backgroundColor: "#FFFFFF", color: D, border: "1px solid rgba(26,16,40,0.1)" }}>
                &ldquo;{q}&rdquo;
              </span>
            ))}
          </div>
          <ScrollToDemoButton />
        </div>
      </section>

      {/* ── POLICIES ────────────────────────────────────────────────────────── */}
      <section className="px-6 py-14 border-t border-b" style={{ backgroundColor: "#FAF8F4", borderColor: "rgba(26,16,40,0.07)" }}>
        <div className="mx-auto max-w-4xl grid gap-8 sm:grid-cols-3">
          {[
            { icon: <Truck className="h-5 w-5" />, title: "Free delivery over 350 MAD", body: "Standard 30 MAD. Express next-day in Casablanca 50 MAD." },
            { icon: <RotateCcw className="h-5 w-5" />, title: "14-day returns", body: "Unopened products, no questions asked. Damaged items replaced in 48h." },
            { icon: <ShieldCheck className="h-5 w-5" />, title: "Pay on delivery", body: "Cash when it arrives. Card and bank transfer also accepted." },
          ].map((p) => (
            <div key={p.title} className="flex gap-4">
              <div className="mt-0.5 shrink-0" style={{ color: G }}>{p.icon}</div>
              <div>
                <p className="mb-1 text-sm font-semibold" style={{ color: D, fontFamily: SPACE }}>{p.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#6B6580" }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16" style={{ backgroundColor: "#FAF8F4" }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-2xl font-bold" style={{ fontFamily: SPACE, color: D, letterSpacing: "-0.01em" }}>
            Common questions
          </h2>
          <div className="space-y-1">
            {[
              { q: "Can I actually order through the chat?", a: "Yes. Tell the assistant what you want, give your name, phone number, and city — it confirms the order and gives you a reference number on the spot." },
              { q: "What languages does it understand?", a: "Darija, French, Modern Arabic, and English. It picks up your language automatically and replies in the same one." },
              { q: "Are the products real and certified?", a: "Yes. All products are sourced from certified suppliers. Our argan oil and ghassoul are 100% natural, from Moroccan producers." },
              { q: "What if I need to talk to a real person?", a: "Just say the word. The assistant will flag your conversation and someone from our team will follow up directly." },
            ].map((f) => (
              <details key={f.q} className="group border-b" style={{ borderColor: "rgba(26,16,40,0.08)" }}>
                <summary className="flex cursor-pointer items-center justify-between py-4 text-sm font-semibold list-none gap-4" style={{ color: D, fontFamily: SPACE }}>
                  {f.q}
                  <span className="shrink-0 text-xl font-light transition-transform group-open:rotate-45" style={{ color: G }}>+</span>
                </summary>
                <p className="pb-4 text-sm leading-relaxed" style={{ color: "#6B6580" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24" style={{ backgroundColor: D }}>
        <div className="mx-auto max-w-5xl flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <h2 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: SPACE, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
            Right products.<br />
            <span style={{ color: G }}>Right skin.</span>
          </h2>
          <div className="flex flex-col gap-3 lg:items-end">
            <p className="text-sm lg:text-right" style={{ color: "rgba(255,255,255,0.45)", maxWidth: "260px" }}>
              Stop guessing. Get your recommendation in under 2 minutes.
            </p>
            <ScrollToTopButton />
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="px-6 py-8" style={{ backgroundColor: "#100C1C" }}>
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <span className="font-bold" style={{ fontFamily: SPACE, color: "#FAF8F4" }}>
            Zina<span style={{ color: G }}> Beauty</span>
          </span>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.18)" }}>
            © {new Date().getFullYear()} Zina Beauty · Casablanca, Morocco
          </p>
          <div className="flex gap-6 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
            <a href="/admin" className="hover:text-white transition-colors">Admin</a>
            <a href="mailto:hichamsabbar80@gmail.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </>
  );
}
