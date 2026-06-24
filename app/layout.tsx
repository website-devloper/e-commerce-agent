import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://zinabeauty.ma";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Zina Beauty — Smart AI Shopping Assistant",
    template: "%s | Zina Beauty",
  },
  description:
    "Shop premium Moroccan cosmetics with our AI assistant. Personalised skincare recommendations, instant answers, and easy ordering — 24/7 in Darija, French & English.",
  keywords: [
    "Moroccan cosmetics",
    "argan oil",
    "skincare Morocco",
    "beauty products Casablanca",
    "AI shopping assistant",
    "cosmétiques marocains",
  ],
  authors: [{ name: "Zina Beauty" }],
  openGraph: {
    title: "Zina Beauty — Smart AI Shopping Assistant",
    description:
      "Personalised skincare recommendations and easy ordering — 24/7 in Darija, French & English.",
    type: "website",
    locale: "fr_MA",
    alternateLocale: ["ar_MA", "en_US"],
    siteName: "Zina Beauty",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zina Beauty — Smart AI Shopping Assistant",
    description: "Premium Moroccan cosmetics with AI-powered personalised recommendations.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body className="min-h-screen antialiased" style={{ backgroundColor: "#F4EFE6" }}>
        {children}
      </body>
    </html>
  );
}
