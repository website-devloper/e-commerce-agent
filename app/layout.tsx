import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://zinabeauty.ma";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Zina Beauty — AI Shopping Assistant",
    template: "%s | Zina Beauty",
  },
  description:
    "Shop premium Moroccan cosmetics with your personal AI beauty advisor. Personalised skincare routines, instant product recommendations, and easy ordering — 24/7 in Darija, French & English.",
  keywords: [
    "Moroccan cosmetics", "argan oil", "skincare Morocco",
    "beauty products Casablanca", "AI shopping assistant", "cosmétiques marocains",
  ],
  authors: [{ name: "Zina Beauty" }],
  openGraph: {
    title: "Zina Beauty — AI Shopping Assistant",
    description: "Your personal AI beauty advisor. Skincare recommendations and easy ordering — 24/7.",
    type: "website",
    locale: "fr_MA",
    alternateLocale: ["ar_MA", "en_US"],
    siteName: "Zina Beauty",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zina Beauty — AI Shopping Assistant",
    description: "Premium Moroccan cosmetics with AI-powered personalised recommendations.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head />
      <body className="min-h-screen antialiased" style={{ backgroundColor: "#FAF8F4" }}>
        {children}
      </body>
    </html>
  );
}
