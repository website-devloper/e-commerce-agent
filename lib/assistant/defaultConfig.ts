import type { BusinessConfig } from "./types";

export const defaultBusinessConfig: BusinessConfig = {
  name: "Zina Beauty",
  description:
    "Zina Beauty is a Moroccan online cosmetics store offering premium skincare, makeup, haircare, and body care products — including authentic Moroccan argan oil, beldi soap, and ghassoul. We ship across Morocco with fast delivery.",
  services: [
    // ── Skincare ──────────────────────────────────────────────────────────────
    { name: "Argan Oil Face Serum 50ml", description: "Pure cold-pressed argan oil serum — anti-aging, deeply hydrating, suitable for all skin types", price: "189 MAD" },
    { name: "Rose Water Toner 200ml", description: "Natural Moroccan rose water toner — soothes, balances pH, refreshes skin", price: "99 MAD" },
    { name: "Vitamin C Brightening Cream 50ml", description: "Brightens dark spots, evens skin tone, boosts collagen", price: "245 MAD" },
    { name: "Ghassoul Clay Mask 200g", description: "100% natural Atlas clay — deep cleanses pores, removes excess oil, silky finish", price: "79 MAD" },
    { name: "SPF 50 Sunscreen 75ml", description: "Lightweight broad-spectrum sun protection, non-greasy, suitable for oily skin", price: "165 MAD" },
    { name: "Retinol Night Cream 50ml", description: "Anti-wrinkle night treatment with 0.3% retinol and niacinamide", price: "285 MAD" },
    // ── Makeup ────────────────────────────────────────────────────────────────
    { name: "Matte Foundation 30ml", description: "Full-coverage matte foundation — 12 shades, lasts 16 hours, no transfer", price: "220 MAD" },
    { name: "Long-Lasting Lipstick", description: "Creamy matte lipstick — 18 shades, 8-hour wear, enriched with vitamin E", price: "89 MAD" },
    { name: "18-Shade Eyeshadow Palette", description: "Warm neutral and smoky palette — matte and shimmer shades, highly pigmented", price: "199 MAD" },
    { name: "Kajal Eyeliner", description: "Intense black kajal — smudge-proof, waterproof, defines eyes dramatically", price: "45 MAD" },
    { name: "Setting Spray 100ml", description: "Lock makeup for 24 hours, controls shine, keeps skin hydrated", price: "135 MAD" },
    { name: "Concealer Pen", description: "Lightweight full-coverage concealer — covers dark circles and blemishes, 8 shades", price: "110 MAD" },
    // ── Haircare ──────────────────────────────────────────────────────────────
    { name: "Pure Argan Oil Hair Treatment 100ml", description: "100% pure argan oil — repairs damage, adds shine, controls frizz", price: "159 MAD" },
    { name: "Moisturizing Shampoo 400ml", description: "Sulfate-free shampoo with argan and keratin — for dry and damaged hair", price: "95 MAD" },
    { name: "Deep Conditioning Mask 300ml", description: "Intensive weekly treatment — restores strength, softness, and elasticity", price: "129 MAD" },
    { name: "Anti-Frizz Hair Serum 50ml", description: "Lightweight serum — tames frizz, adds mirror shine, heat protection up to 230°C", price: "110 MAD" },
    // ── Body Care ─────────────────────────────────────────────────────────────
    { name: "Beldi Black Soap 300g", description: "Traditional Moroccan hammam soap with eucalyptus — exfoliates, softens, purifies", price: "69 MAD" },
    { name: "Hammam Kessa Exfoliating Glove", description: "Professional kessa glove for deep exfoliation — removes dead skin cells effectively", price: "35 MAD" },
    { name: "Rose Body Lotion 400ml", description: "Nourishing rose and shea butter lotion — 48h hydration, non-greasy, floral scent", price: "119 MAD" },
    { name: "Argan Body Oil 200ml", description: "Luxurious dry body oil with argan and jasmine — absorbs quickly, leaves skin silky", price: "145 MAD" },
    // ── Fragrances ────────────────────────────────────────────────────────────
    { name: "Oud Rose Eau de Parfum 50ml", description: "Oriental fragrance — top notes rose & saffron, base notes oud & amber. Lasts 8+ hours", price: "299 MAD" },
    { name: "Jasmine & White Musk EDP 50ml", description: "Soft floral scent — fresh jasmine heart, warm musk base. Ideal for daily wear", price: "259 MAD" },
    { name: "Atlas Cedar Cologne 100ml", description: "Fresh woody unisex cologne — cedar, bergamot, and vetiver. Long-lasting freshness", price: "229 MAD" },
  ],
  hours: {
    Monday: "9:00 – 18:00",
    Tuesday: "9:00 – 18:00",
    Wednesday: "9:00 – 18:00",
    Thursday: "9:00 – 18:00",
    Friday: "9:00 – 18:00",
    Saturday: "10:00 – 16:00",
    Sunday: "Closed (orders processed next business day)",
  },
  location: "Online store — we ship across all of Morocco. Warehouse: Casablanca, Maarif district.",
  languages: ["Moroccan Darija", "Modern Standard Arabic", "French", "English"],
  faq: [
    {
      q: "What are the delivery times and fees?",
      a: "Standard delivery: 2–3 business days to Casablanca, Rabat, Marrakech, Fes, Agadir — 30 MAD. Express next-day in Casablanca — 50 MAD. Free delivery on all orders over 350 MAD.",
    },
    {
      q: "What payment methods do you accept?",
      a: "Cash on delivery (COD), bank transfer, and credit/debit card (Visa, Mastercard) via secure payment.",
    },
    {
      q: "What is your return policy?",
      a: "We accept returns of unopened, sealed products within 14 days of delivery. For damaged or incorrect items, contact us within 48 hours and we will replace at no cost.",
    },
    {
      q: "Are your products authentic and safe?",
      a: "Yes — all products are sourced from certified suppliers and comply with Moroccan cosmetic safety standards. Our argan and ghassoul products are 100% natural from Moroccan producers.",
    },
    {
      q: "Do you offer gift wrapping?",
      a: "Yes! We offer gift wrapping with a personal message card for 20 MAD extra. Select it at checkout or mention it when ordering.",
    },
    {
      q: "Can I track my order?",
      a: "Yes — once your order ships, we send you a tracking number via WhatsApp or email so you can follow it in real time.",
    },
    {
      q: "Do you have a loyalty program?",
      a: "Yes — earn 1 point for every 10 MAD spent. 100 points = 10 MAD discount on your next order. Points are applied automatically to your account.",
    },
    {
      q: "Do you ship internationally?",
      a: "Currently we ship within Morocco only. International shipping to France, Spain, and Belgium is coming soon — leave your email and we'll notify you.",
    },
  ],
  handoffEmail: "hichamsabbar80@gmail.com",
};
