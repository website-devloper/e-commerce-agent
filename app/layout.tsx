import type { Metadata } from "next";
import { Syne, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://zinabeauty.ma";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: "Zina Beauty", template: "%s | Zina Beauty" },
  description: "Shop premium Moroccan cosmetics with your personal AI beauty advisor. Personalised skincare routines, instant product recommendations, and easy ordering — 24/7.",
  keywords: ["Moroccan cosmetics", "argan oil", "skincare Morocco", "beauty Casablanca", "AI beauty assistant"],
  authors: [{ name: "Zina Beauty" }],
  openGraph: {
    title: "Zina Beauty",
    description: "Your personal AI beauty advisor. Skincare recommendations and easy ordering — 24/7.",
    type: "website", locale: "fr_MA", siteName: "Zina Beauty",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${syne.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head />
      <body className="min-h-screen antialiased" style={{ backgroundColor: "#FAF8F4" }}>
        {children}
      </body>
    </html>
  );
}
