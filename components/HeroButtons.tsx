"use client";
import { ArrowRight } from "lucide-react";

export function ScrollToDemoButton() {
  return (
    <button
      onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
      className="group flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
      style={{ background: "linear-gradient(135deg, #C4963A 0%, #D4A84A 100%)", boxShadow: "0 4px 20px rgba(196,150,58,0.35)" }}
    >
      Try the Assistant Free
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}

export function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold transition-all duration-300 hover:scale-105"
      style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)" }}
    >
      Start Chatting Now
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
