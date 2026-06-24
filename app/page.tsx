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

export default function Home() {
  return (
    <>
      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur-md"
        style={{ backgroundColor: "rgba(250,248,244,0.9)", borderBottom: "1px solid rgba(26,16,40,0.07)" }}>
        <a href="/" className="flex items-center gap-2.5">
          <span className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: `linear-gradient(135deg, ${D}, #3A2050)` }}>Z</span>
          <span className="font-bold tracking-tight" style={{ fontFamily: "var(--font-syne)", color: D, fontSize: "1.1rem" }}>
            Zina<span style={{ color: G }}> Beauty</span>
          </span>
        </a>
        <div className="hidden sm:flex items-center gap-7 text-sm font-medium" style={{ color: "#6B6580" }}>
          <a href="#products" className="hover:text-[#1A1028] transition-colors">Catalogue</a>
          <a href="#demo" className="hover:text-[#1A1028] transition-colors">Try it free</a>
        </div>
        <a href="#demo" className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: `linear-gradient(135deg, ${G}, #D4A84A)` }}>
          Open chat
        </a>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-20" style={{ backgroundColor: "#FAF8F4" }}>
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left */}
            <div>
              <p className="mb-4 text-sm font-medium" style={{ color: G }}>Free · No sign-up · Replies in Darija</p>
              <h1 className="mb-6 text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl"
                style={{ fontFamily: "var(--font-syne)", color: D }}>
                Ask before<br />you buy.
              </h1>
              <p className="mb-8 text-lg leading-relaxed" style={{ color: "#6B6580", maxWidth: "420px" }}>
                Tell our assistant your skin type, what bothers you, your budget. It finds exactly what you need from our Moroccan cosmetics catalogue — then takes your order.
              </p>
              <div className="flex flex-wrap gap-3">
                <ScrollToDemoButton />
                <a href="#products" className="rounded-full border px-6 py-3.5 text-sm font-semibold transition-all hover:bg-black/5"
                  style={{ borderColor: "rgba(26,16,40,0.2)", color: D }}>
                  Browse catalogue
                </a>
              </div>
            </div>

            {/* Right — fake chat preview */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(26,16,40,0.08)" }}>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3" style={{ background: `linear-gradient(135deg, ${D}, #2E1A48)` }}>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: `linear-gradient(135deg, ${G}, #D4A84A)`, color: D }}>Z</div>
                  <div>
                    <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne)" }}>Zina Beauty</p>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>Online now</p>
                    </div>
                  </div>
                </div>
                {/* Messages */}
                <div className="px-4 py-4 space-y-3">
                  <div className="flex gap-2 items-end">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: `linear-gradient(135deg, ${G}, #D4A84A)`, color: D }}>Z</div>
                    <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm max-w-[75%]"
                      style={{ backgroundColor: "#F4EFF8", color: D }}>
                      Marhba! Describe your skin type and I&apos;ll find the right products for you.
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm text-white max-w-[75%]"
                      style={{ background: `linear-gradient(135deg, ${D}, #2E1A48)` }}>
                      Jldi dial les taches noires, wesh kayn chi 7aja?
                    </div>
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: `linear-gradient(135deg, ${G}, #D4A84A)`, color: D }}>Z</div>
                    <div className="rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-sm max-w-[80%]"
                      style={{ backgroundColor: "#F4EFF8", color: D }}>
                      Iyeh! I recommend our <strong>Vitamin C Brightening Cream (245 MAD)</strong> — it targets dark spots in 4–6 weeks. Want me to add it to an order?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-br-sm px-3.5 py-2.5 text-sm text-white"
                      style={{ background: `linear-gradient(135deg, ${D}, #2E1A48)` }}>
                      Yes, order it
                    </div>
                  </div>
                </div>
                {/* Input bar */}
                <div className="flex items-center gap-2 border-t px-3 py-3" style={{ borderColor: "rgba(26,16,40,0.07)" }}>
                  <div className="flex-1 rounded-xl px-3 py-2 text-sm" style={{ backgroundColor: "#FAF8F4", color: "rgba(26,16,40,0.35)" }}>
                    Type a message…
                  </div>
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${D}, #2E1A48)` }}>
                    <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 rounded-xl px-4 py-2.5 shadow-lg"
                style={{ backgroundColor: CARD_WHITE, border: "1px solid rgba(26,16,40,0.08)" }}>
                <p className="text-xs font-semibold" style={{ color: D }}>Responds in Darija, French & English</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT IT DOES ────────────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-20" style={{ backgroundColor: D }}>
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-5 text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: "var(--font-syne)" }}>
                Not a chatbot.<br />An advisor.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", maxWidth: "400px" }}>
                It knows the difference between oily and combination skin. It knows argan oil isn&apos;t for everyone. It asks the right questions and gives you a straight answer — then takes your order directly in the chat.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "Knows your skin", body: "Tell it once. It remembers your type, concerns, and what worked." },
                { title: "Builds routines", body: "Morning, evening, or weekly — a full step-by-step plan with prices." },
                { title: "Takes orders", body: "Name, address, done. You get a reference number immediately." },
                { title: "Speaks Darija", body: "No awkward formal Arabic. Chat the way you actually talk." },
              ].map((c) => (
                <div key={c.title} className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="mb-1 text-sm font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>{c.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ────────────────────────────────────────────────────────── */}
      <section id="products" className="px-6 py-20" style={{ backgroundColor: "#FAF8F4" }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-syne)", color: D }}>
                The catalogue
              </h2>
              <p className="mt-2 text-base" style={{ color: "#6B6580" }}>
                Ask the assistant about any of these — or just describe what you need.
              </p>
            </div>
            <a href="#demo" className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 shrink-0"
              style={{ background: `linear-gradient(135deg, ${G}, #D4A84A)` }}>
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
              <div key={p.name} className="group rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(26,16,40,0.07)", boxShadow: "0 1px 8px rgba(26,16,40,0.05)" }}>
                <div className="mb-3 text-xs font-medium" style={{ color: G }}>{p.cat}</div>
                <p className="mb-1 text-sm font-semibold leading-snug" style={{ color: D }}>{p.name}</p>
                {p.size && <p className="text-xs" style={{ color: "#9B8FAC" }}>{p.size}</p>}
                <p className="mt-2 text-sm font-bold" style={{ color: D }}>{p.price}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm" style={{ color: "#9B8FAC" }}>
            + Rose Water Toner, Kajal Eyeliner, Setting Spray, Hammam Kessa Glove, Rose Body Lotion, Argan Body Oil, Anti-Frizz Serum, Deep Conditioning Mask, Jasmine & White Musk EDP, Atlas Cedar Cologne
          </p>
        </div>
      </section>

      {/* ── DEMO ────────────────────────────────────────────────────────────── */}
      <section id="demo" className="px-6 py-20" style={{ backgroundColor: "#F2EDF5" }}>
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium" style={{ color: G }}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Online right now
          </div>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl" style={{ fontFamily: "var(--font-syne)", color: D }}>
            Try it. No sign-up,<br />no waiting.
          </h2>
          <p className="mb-8 text-base leading-relaxed" style={{ color: "#6B6580" }}>
            Click the chat button on the right. Ask in Darija, French, or English. It&apos;s not scripted — ask it anything about your skin, our products, or place a real order.
          </p>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {[
              "3andi jeld dhn, ch n9der dir?",
              "Build me a morning routine",
              "Fin kayn l argan oil?",
              "I have sensitive skin",
            ].map((q) => (
              <span key={q} className="rounded-full px-4 py-2 text-sm font-medium"
                style={{ backgroundColor: "#FFFFFF", color: D, border: "1px solid rgba(26,16,40,0.1)" }}>
                &ldquo;{q}&rdquo;
              </span>
            ))}
          </div>
          <ScrollToDemoButton />
        </div>
      </section>

      {/* ── POLICIES ────────────────────────────────────────────────────────── */}
      <section className="px-6 py-14" style={{ backgroundColor: "#FAF8F4" }}>
        <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-3">
          {[
            { icon: <Truck className="h-5 w-5" />, title: "Free delivery over 350 MAD", body: "Standard 30 MAD. Express next-day in Casablanca 50 MAD." },
            { icon: <RotateCcw className="h-5 w-5" />, title: "14-day returns", body: "Unopened products, no questions asked. Damaged items replaced in 48h." },
            { icon: <ShieldCheck className="h-5 w-5" />, title: "Pay on delivery", body: "Cash when it arrives. Card and bank transfer also accepted." },
          ].map((p) => (
            <div key={p.title} className="flex gap-4">
              <div className="mt-0.5 shrink-0" style={{ color: G }}>{p.icon}</div>
              <div>
                <p className="mb-1 text-sm font-semibold" style={{ color: D }}>{p.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#6B6580" }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16" style={{ backgroundColor: "#F2EDF5" }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-8 text-2xl font-bold" style={{ fontFamily: "var(--font-syne)", color: D }}>Questions</h2>
          <div className="space-y-2">
            {[
              { q: "Can I actually order through the chat?", a: "Yes. Tell the assistant what you want, give your name, phone number, and city — it confirms the order and gives you a reference number on the spot." },
              { q: "What languages does it understand?", a: "Darija, French, Modern Arabic, and English. It picks up your language automatically." },
              { q: "Are the products real and certified?", a: "Yes. All products are sourced from certified suppliers. Our argan oil and ghassoul are 100% natural, from Moroccan producers." },
              { q: "What if I need to talk to a real person?", a: "Say the word — the assistant will flag your conversation and someone from our team will follow up directly." },
            ].map((f) => (
              <details key={f.q} className="group rounded-xl" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(26,16,40,0.07)" }}>
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold list-none gap-4" style={{ color: D }}>
                  {f.q}
                  <span className="shrink-0 text-xl font-light transition-transform group-open:rotate-45" style={{ color: G }}>+</span>
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "#6B6580" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 text-center" style={{ background: `linear-gradient(135deg, ${D} 0%, #2E1A48 100%)` }}>
        <div className="mx-auto max-w-lg">
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl" style={{ fontFamily: "var(--font-syne)" }}>
            Right products.<br />
            <span style={{ color: G }}>Right skin.</span>
          </h2>
          <p className="mb-8 text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
            Stop guessing. Open the chat and get your personalised recommendation in under 2 minutes.
          </p>
          <ScrollToTopButton />
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="px-6 py-8" style={{ backgroundColor: "#120D1E" }}>
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <span className="font-bold" style={{ fontFamily: "var(--font-syne)", color: "#FAF8F4" }}>
            Zina<span style={{ color: G }}> Beauty</span>
          </span>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} Zina Beauty · Casablanca, Morocco
          </p>
          <div className="flex gap-6 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            <a href="/admin" className="hover:text-white transition-colors">Admin</a>
            <a href="mailto:hichamsabbar80@gmail.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </>
  );
}

const CARD_WHITE = "#FFFFFF";
