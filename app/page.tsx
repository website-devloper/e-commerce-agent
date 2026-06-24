import type { Metadata } from "next";
import ChatWidget from "@/components/ChatWidget";
import { ScrollToDemoButton, ScrollToTopButton } from "@/components/HeroButtons";
import {
  MessageCircle, Zap, Users, Globe, Calendar, ShieldCheck,
  Star, CheckCircle, Clock, TrendingUp, Smartphone, ShoppingBag,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Zina Beauty — Smart AI Shopping Assistant",
  description: "Shop premium Moroccan cosmetics with our AI assistant. Get personalised skincare recommendations, instant answers, and easy ordering — 24/7.",
};

export default function Home() {
  return (
    <>
      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24 text-center" style={{ backgroundColor: "#F4EFE6" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #E5501E 0%, transparent 50%), radial-gradient(circle at 80% 20%, #D89B3F 0%, transparent 40%)" }} />
        <div className="relative mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "#E5501E15", color: "#E5501E" }}>
            AI-Powered Beauty Shopping
          </span>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl" style={{ color: "#1B1714" }}>
            Your personal<br /><em className="not-italic" style={{ color: "#E5501E" }}>beauty advisor</em>,<br />available 24/7
          </h1>
          <p className="mb-8 text-lg leading-relaxed" style={{ color: "#1B171480" }}>
            Shop Zina Beauty with confidence. Our AI assistant recommends the right products for your skin, answers every question, and places your order — all in one chat.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <ScrollToDemoButton />
            <a href="#features" className="flex items-center gap-2 rounded-2xl border-2 px-8 py-4 text-base font-semibold transition-all hover:bg-black/5" style={{ borderColor: "#1B1714", color: "#1B1714" }}>
              See How It Works
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: "#1B171460" }}>
            {["23 premium products", "Free delivery over 350 MAD", "Replies in Darija, French & English"].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5" style={{ color: "#E5501E" }} />{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. PROBLEM ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: "#1B1714" }}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl" style={{ color: "#F4EFE6" }}>
            Choosing the right product<br />shouldn&apos;t be <em style={{ color: "#E5501E" }}>guesswork</em>
          </h2>
          <p className="text-lg" style={{ color: "#F4EFE680" }}>
            With hundreds of products and ingredients to navigate, most customers leave without buying — or buy the wrong thing. Our assistant solves this in seconds.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              { stat: "68%", desc: "of customers abandon when they can't find the right product" },
              { stat: "3 min", desc: "average time to get a personalised recommendation from our AI" },
              { stat: "24/7", desc: "availability — no waiting for business hours or WhatsApp replies" },
            ].map((s) => (
              <div key={s.stat} className="rounded-2xl p-6" style={{ backgroundColor: "#FFFFFF10" }}>
                <p className="text-4xl font-bold" style={{ color: "#E5501E" }}>{s.stat}</p>
                <p className="mt-2 text-sm" style={{ color: "#F4EFE680" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="features" className="px-6 py-20" style={{ backgroundColor: "#F4EFE6" }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "#1B1714" }}>How it works</h2>
            <p className="mt-3" style={{ color: "#1B171460" }}>From question to order in under 3 minutes</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { n: "01", icon: <MessageCircle className="h-6 w-6" />, title: "Tell us what you need", desc: "Describe your skin type, concern, or what you're looking for — in Darija, French, Arabic, or English." },
              { n: "02", icon: <Zap className="h-6 w-6" />, title: "Get personalised picks", desc: "Our AI analyses your needs and recommends the exact products — with ingredients, how to use, and prices." },
              { n: "03", icon: <CheckCircle className="h-6 w-6" />, title: "Order in the chat", desc: "Place your order directly in the conversation. Get a confirmation and tracking number — no forms, no checkout friction." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl p-6" style={{ backgroundColor: "#FBF8F2" }}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-4xl font-bold" style={{ color: "#E5501E15" }}>{s.n}</span>
                  <div className="rounded-xl p-2" style={{ backgroundColor: "#E5501E", color: "#fff" }}>{s.icon}</div>
                </div>
                <h3 className="mb-2 font-bold" style={{ color: "#1B1714" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#1B171480" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FEATURES BENTO ───────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: "#FBF8F2" }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "#1B1714" }}>Everything you need to shop smarter</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Clock className="h-5 w-5" />, title: "24/7 Instant Replies", desc: "No waiting — get answers in seconds at any hour, any day." },
              { icon: <Star className="h-5 w-5" />, title: "Personalised Recommendations", desc: "AI analyses your skin type and concerns to suggest the perfect products." },
              { icon: <Smartphone className="h-5 w-5" />, title: "Routine Builder", desc: "Ask for a morning or evening routine and get a complete step-by-step plan with products and prices." },
              { icon: <Globe className="h-5 w-5" />, title: "Multilingual", desc: "Speaks Moroccan Darija, Modern Arabic, French, and English — naturally." },
              { icon: <ShoppingBag className="h-5 w-5" />, title: "Order in Chat", desc: "Place orders, get order references, and track delivery — all without leaving the chat." },
              { icon: <Users className="h-5 w-5" />, title: "Human Handoff", desc: "When you need a real person, the AI connects you instantly and notifies our team." },
            ].map((f) => (
              <div key={f.title} className="group rounded-2xl p-5 transition-all duration-240 hover:-translate-y-1" style={{ backgroundColor: "#F4EFE6" }}>
                <div className="mb-3 inline-flex rounded-xl p-2.5" style={{ backgroundColor: "#E5501E", color: "#fff" }}>{f.icon}</div>
                <h3 className="mb-1 font-bold" style={{ color: "#1B1714" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#1B171480" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. LIVE DEMO ────────────────────────────────────────────────── */}
      <section id="demo" className="px-6 py-20" style={{ backgroundColor: "#EDE8DF" }}>
        <div className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest" style={{ backgroundColor: "#E5501E15", color: "#E5501E" }}>
            Live Demo
          </span>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl" style={{ color: "#1B1714" }}>Try it right now</h2>
          <p className="mb-8 text-lg" style={{ color: "#1B171480" }}>
            Click the chat bubble in the bottom-right corner. Ask about products, your skin type, building a routine, or placing an order. It&apos;s the real thing.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "\"I have oily skin, what should I use?\"",
              "\"Build me a morning routine\"",
              "\"Fin kayn argan oil?\"",
              "\"What's your return policy?\"",
            ].map((q) => (
              <span key={q} className="rounded-full px-4 py-2 text-sm font-medium" style={{ backgroundColor: "#FBF8F2", color: "#1B1714" }}>{q}</span>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 rounded-full px-4 py-2 text-sm" style={{ backgroundColor: "#E5501E15" }}>
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span style={{ color: "#E5501E" }}>Assistant is online</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. RESULTS ──────────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: "#B5431A" }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Built for Moroccan e-commerce</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-4">
            {[
              { stat: "<3s", label: "Average response time" },
              { stat: "4+", label: "Languages supported" },
              { stat: "23", label: "Products in catalogue" },
              { stat: "100%", label: "Available every day" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-6 text-center" style={{ backgroundColor: "#FFFFFF15" }}>
                <p className="text-4xl font-bold text-white">{s.stat}</p>
                <p className="mt-1 text-sm" style={{ color: "#FFFFFF80" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. PRODUCTS PREVIEW ─────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: "#F4EFE6" }}>
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "#1B1714" }}>Premium Moroccan cosmetics</h2>
            <p className="mt-3" style={{ color: "#1B171460" }}>Ask the assistant about any of these — or describe what you need and let it guide you</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { cat: "Skincare", items: ["Argan Oil Face Serum", "Vitamin C Cream", "Ghassoul Clay Mask", "Retinol Night Cream", "SPF 50 Sunscreen"], color: "#E5501E" },
              { cat: "Makeup", items: ["Matte Foundation", "Long-Lasting Lipstick", "18-Shade Eyeshadow", "Kajal Eyeliner", "Setting Spray"], color: "#B5431A" },
              { cat: "Haircare", items: ["Argan Oil Treatment", "Moisturizing Shampoo", "Deep Conditioning Mask", "Anti-Frizz Serum"], color: "#D89B3F" },
              { cat: "Body Care", items: ["Beldi Black Soap", "Hammam Kessa Glove", "Rose Body Lotion", "Argan Body Oil"], color: "#1B1714" },
              { cat: "Fragrances", items: ["Oud Rose EDP", "Jasmine & White Musk", "Atlas Cedar Cologne"], color: "#5B4037" },
            ].map((cat) => (
              <div key={cat.cat} className="rounded-2xl p-5" style={{ backgroundColor: "#FBF8F2" }}>
                <div className="mb-3 rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wider text-white w-fit" style={{ backgroundColor: cat.color }}>{cat.cat}</div>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-xs" style={{ color: "#1B171480" }}>
                      <span className="h-1 w-1 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. DELIVERY & POLICIES ──────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: "#FBF8F2" }}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "#1B1714" }}>Simple, transparent policies</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: <TrendingUp className="h-5 w-5" />, title: "Free Delivery", desc: "Orders over 350 MAD ship free. Standard: 30 MAD. Express next-day in Casablanca: 50 MAD." },
              { icon: <ShieldCheck className="h-5 w-5" />, title: "14-Day Returns", desc: "Return unopened products within 14 days. Damaged items replaced within 48 hours — no questions asked." },
              { icon: <Calendar className="h-5 w-5" />, title: "Cash on Delivery", desc: "Pay when your order arrives. We also accept card and bank transfer." },
            ].map((p) => (
              <div key={p.title} className="rounded-2xl p-6" style={{ backgroundColor: "#F4EFE6" }}>
                <div className="mb-3 inline-flex rounded-xl p-2.5" style={{ backgroundColor: "#E5501E", color: "#fff" }}>{p.icon}</div>
                <h3 className="mb-1 font-bold" style={{ color: "#1B1714" }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#1B171480" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. FAQ ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-20" style={{ backgroundColor: "#F4EFE6" }}>
        <div className="mx-auto max-w-2xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "#1B1714" }}>Frequently asked</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "What languages does the assistant speak?", a: "Moroccan Darija, Modern Standard Arabic, French, and English. It detects your language automatically." },
              { q: "Can I really place an order through the chat?", a: "Yes — tell the assistant what you want, give your name, contact, and address, and it confirms your order with a reference number." },
              { q: "Are the products authentic?", a: "All products are sourced from certified suppliers and meet Moroccan cosmetic safety standards. Our argan and ghassoul products are 100% natural." },
              { q: "What if I have a complex question?", a: "The assistant handles most questions automatically. For anything it can't resolve, it transfers you to a human from our team." },
              { q: "Is my data safe?", a: "Yes. We only collect what's needed to process your order. We never sell or share your personal information." },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl" style={{ backgroundColor: "#FBF8F2" }}>
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold list-none" style={{ color: "#1B1714" }}>
                  {f.q}
                  <span className="ml-4 shrink-0 transition-transform group-open:rotate-45" style={{ color: "#E5501E" }}>+</span>
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "#1B171480" }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 10. FINAL CTA ───────────────────────────────────────────────── */}
      <section className="px-6 py-24 text-center" style={{ backgroundColor: "#E5501E" }}>
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">Start shopping smarter today</h2>
          <p className="mb-8 text-lg" style={{ color: "#FFFFFF90" }}>
            Your personal beauty advisor is ready. No sign-up, no app download — just open the chat.
          </p>
          <ScrollToTopButton />
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="px-6 py-10" style={{ backgroundColor: "#1B1714" }}>
        <div className="mx-auto max-w-5xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <span className="text-lg font-bold" style={{ color: "#F4EFE6" }}>Zina <em className="not-italic" style={{ color: "#E5501E" }}>Beauty</em></span>
          <p className="text-sm" style={{ color: "#F4EFE640" }}>© {new Date().getFullYear()} Zina Beauty. All rights reserved. Casablanca, Morocco.</p>
          <div className="flex gap-6 text-sm" style={{ color: "#F4EFE660" }}>
            <a href="/admin" className="hover:text-white transition-colors">Admin</a>
            <a href="mailto:hichamsabbar80@gmail.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </>
  );
}
