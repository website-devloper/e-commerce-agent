"use client";
import { ArrowRight } from "lucide-react";

export function ScrollToDemoButton() {
  return (
    <button
      onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
      className="flex items-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
      style={{ backgroundColor: "#E5501E" }}
    >
      Try the Assistant <ArrowRight className="h-4 w-4" />
    </button>
  );
}

export function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold shadow-lg transition-all hover:scale-105"
      style={{ color: "#E5501E" }}
    >
      Chat with the Assistant <ArrowRight className="h-4 w-4" />
    </button>
  );
}
