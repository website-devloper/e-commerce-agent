import type { ChatCompletionTool } from "groq-sdk/resources/chat/completions";
import { z } from "zod";
import type { BusinessConfig } from "./types";
import { prisma } from "@/lib/db/prisma";
import { notifyNewLead, notifyNewOrder, notifyHandoff } from "@/lib/notifications";

// ── Tool definitions ──────────────────────────────────────────────────────────

export function getToolDefinitions(): ChatCompletionTool[] {
  return [
    {
      type: "function",
      function: {
        name: "get_product_info",
        description:
          "Search the product catalogue and store policies to answer questions about products, ingredients, prices, shipping, returns, or any store information.",
        parameters: {
          type: "object",
          properties: {
            query: { type: "string", description: "The customer's question or product they are asking about." },
          },
          required: ["query"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "recommend_products",
        description:
          "Generate personalised product recommendations based on the customer's skin type, hair type, concern, or goal. Call this when the customer describes their skin/hair or asks what to use for a specific concern.",
        parameters: {
          type: "object",
          properties: {
            concern: { type: "string", description: "Customer's skin/hair concern or goal, e.g. 'oily skin', 'dry hair', 'anti-aging', 'brightening', 'frizz control'." },
            category: { type: "string", description: "Optional product category to focus on: skincare | haircare | makeup | bodycare | fragrance | routine." },
            budget: { type: "string", description: "Optional budget in MAD, e.g. '200 MAD' or 'under 300 MAD'." },
          },
          required: ["concern"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "build_routine",
        description:
          "Build a complete personalised skincare or haircare routine for the customer. Call this when they ask for a morning routine, evening routine, full routine, or haircare routine.",
        parameters: {
          type: "object",
          properties: {
            routine_type: { type: "string", description: "morning | evening | full_day | haircare" },
            skin_type: { type: "string", description: "oily | dry | combination | sensitive | normal — if known." },
            concerns: { type: "string", description: "Main concerns, e.g. 'anti-aging, dark spots' or 'frizz, dryness'." },
            budget: { type: "string", description: "Optional total budget in MAD." },
          },
          required: ["routine_type"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_bundle_suggestion",
        description:
          "Suggest complementary products to go with a product the customer is already interested in. Call this after a customer shows interest in a specific product.",
        parameters: {
          type: "object",
          properties: {
            product_name: { type: "string", description: "The product the customer is already interested in." },
          },
          required: ["product_name"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "check_stock",
        description: "Check whether a specific product is currently in stock and ready to ship.",
        parameters: {
          type: "object",
          properties: {
            product_name: { type: "string", description: "Name of the product to check." },
          },
          required: ["product_name"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "track_order",
        description: "Look up the status of a customer's order by order ID or contact details.",
        parameters: {
          type: "object",
          properties: {
            order_id: { type: "string", description: "Order reference number, e.g. ZB-123456." },
            contact: { type: "string", description: "Customer phone or email to look up their orders." },
          },
        },
      },
    },
    {
      type: "function",
      function: {
        name: "capture_lead",
        description:
          "Save a customer's contact details and interest. Call this once you have their name, contact, and what they are interested in.",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string" },
            contact: { type: "string" },
            interest: { type: "string" },
            language: { type: "string" },
          },
          required: ["name", "contact", "interest"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "place_order",
        description:
          "Place a product order. Collect name, contact, product + quantity, delivery address, and payment method first.",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string" },
            contact: { type: "string" },
            product: { type: "string", description: "Product name and quantity." },
            address: { type: "string", description: "Delivery city or full address." },
            payment_method: { type: "string", description: "cash_on_delivery | card | bank_transfer" },
          },
          required: ["name", "contact", "product", "address"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "handoff_to_human",
        description: "Escalate to a human agent when you cannot help, the customer is frustrated, or they ask to speak to a person.",
        parameters: {
          type: "object",
          properties: {
            reason: { type: "string" },
          },
          required: ["reason"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "update_user_profile",
        description:
          "Save or update what you know about this customer for future conversations. Call this whenever you learn their name, skin type, hair type, language preference, concerns, or any other useful personal detail. This makes the next conversation feel personalised.",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string", description: "Customer's first name or full name." },
            skin_type: { type: "string", description: "oily | dry | combination | sensitive | normal" },
            hair_type: { type: "string", description: "oily | dry | damaged | curly | straight | normal" },
            concerns: { type: "string", description: "Skin or hair concerns, e.g. 'dark spots, large pores'" },
            language: { type: "string", description: "Preferred language: darija | arabic | french | english" },
            notes: { type: "string", description: "Any other useful notes: budget preference, brands they like, allergies, etc." },
          },
        },
      },
    },
  ];
}

// ── Validation schemas ────────────────────────────────────────────────────────

const GetProductInfoInput = z.object({ query: z.string() });
const RecommendInput = z.object({
  concern: z.string(),
  category: z.string().optional(),
  budget: z.string().optional(),
});
const BuildRoutineInput = z.object({
  routine_type: z.enum(["morning", "evening", "full_day", "haircare"]),
  skin_type: z.string().optional(),
  concerns: z.string().optional(),
  budget: z.string().optional(),
});
const BundleInput = z.object({ product_name: z.string() });
const CheckStockInput = z.object({ product_name: z.string() });
const TrackOrderInput = z.object({
  order_id: z.string().optional(),
  contact: z.string().optional(),
});
const CaptureLeadInput = z.object({
  name: z.string(),
  contact: z.string(),
  interest: z.string(),
  language: z.string().optional(),
});
const PlaceOrderInput = z.object({
  name: z.string(),
  contact: z.string(),
  product: z.string(),
  address: z.string(),
  payment_method: z.string().optional(),
});
const HandoffInput = z.object({ reason: z.string() });
const UpdateProfileInput = z.object({
  name: z.string().optional(),
  skin_type: z.string().optional(),
  hair_type: z.string().optional(),
  concerns: z.string().optional(),
  language: z.string().optional(),
  notes: z.string().optional(),
});

// ── Tool runner ───────────────────────────────────────────────────────────────

export async function runTool(
  toolName: string,
  rawInput: unknown,
  config: BusinessConfig,
  conversationId?: string,
  userId?: string
): Promise<string> {
  switch (toolName) {
    case "get_product_info":
      return getProductInfo(GetProductInfoInput.parse(rawInput).query, config);
    case "recommend_products":
      return recommendProducts(RecommendInput.parse(rawInput), config);
    case "build_routine":
      return buildRoutine(BuildRoutineInput.parse(rawInput), config);
    case "get_bundle_suggestion":
      return getBundleSuggestion(BundleInput.parse(rawInput).product_name, config);
    case "check_stock":
      return checkStock(CheckStockInput.parse(rawInput).product_name, config);
    case "track_order":
      return trackOrder(TrackOrderInput.parse(rawInput));
    case "capture_lead":
      return captureLead(CaptureLeadInput.parse(rawInput), conversationId);
    case "place_order":
      return placeOrder(PlaceOrderInput.parse(rawInput), conversationId);
    case "handoff_to_human":
      return handoffToHuman(HandoffInput.parse(rawInput).reason, conversationId);
    case "update_user_profile":
      return updateUserProfile(UpdateProfileInput.parse(rawInput), userId);
    default:
      return `Unknown tool: ${toolName}`;
  }
}

// ── Implementations ───────────────────────────────────────────────────────────

function getProductInfo(query: string, config: BusinessConfig): string {
  const q = query.toLowerCase();
  const sections: string[] = [];

  const matchedProducts = config.services.filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );

  const categoryMap: Record<string, string[]> = {
    skincare: ["serum", "toner", "cream", "mask", "sunscreen", "spf", "retinol", "argan face", "vitamin c", "brightening", "night cream"],
    makeup: ["foundation", "lipstick", "eyeshadow", "kajal", "eyeliner", "setting spray", "concealer", "matte"],
    haircare: ["shampoo", "hair", "conditioning", "keratin", "anti-frizz"],
    bodycare: ["beldi", "soap", "kessa", "body lotion", "body oil", "hammam", "exfoliat"],
    fragrance: ["perfume", "parfum", "cologne", "oud", "jasmine", "musk", "cedar", "scent", "eau de"],
  };

  if (matchedProducts.length > 0) {
    sections.push(
      "Matching products:\n" +
        matchedProducts.map((p) => `• ${p.name} — ${p.description} | ${p.price}`).join("\n")
    );
  } else {
    for (const [cat, keywords] of Object.entries(categoryMap)) {
      if (keywords.some((k) => q.includes(k))) {
        const catProds = config.services.filter((p) =>
          keywords.some((k) => p.name.toLowerCase().includes(k) || p.description.toLowerCase().includes(k))
        );
        if (catProds.length > 0) {
          sections.push(`${cat.charAt(0).toUpperCase() + cat.slice(1)} products:\n` + catProds.map((p) => `• ${p.name} — ${p.price}`).join("\n"));
        }
        break;
      }
    }
  }

  const policyKeywords: [RegExp, string][] = [
    [/ship|deliver|livraison|free/, "delivery"],
    [/pay|cash|card|transfer/, "payment"],
    [/return|refund|exchange/, "return"],
    [/loyalty|points|reward/, "loyalty"],
    [/track|suivi/, "track"],
    [/authentic|safe|natural/, "authentic"],
    [/gift|wrap/, "gift"],
    [/international|abroad/, "international"],
  ];

  for (const [regex, keyword] of policyKeywords) {
    if (regex.test(q)) {
      const faq = config.faq.find((f) => f.q.toLowerCase().includes(keyword) || f.a.toLowerCase().includes(keyword));
      if (faq) sections.push(`${faq.q}\n${faq.a}`);
    }
  }

  if (sections.length === 0) {
    const matchedFaq = config.faq.filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
    if (matchedFaq.length > 0) {
      sections.push(matchedFaq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n"));
    } else {
      sections.push(
        `${config.name} carries 23 products across Skincare, Makeup, Haircare, Body Care, and Fragrances. Prices from 35 MAD to 299 MAD. Free delivery over 350 MAD. Ask me about any specific product or category!`
      );
    }
  }

  return sections.join("\n\n");
}

function recommendProducts(
  input: z.infer<typeof RecommendInput>,
  config: BusinessConfig
): string {
  const concern = input.concern.toLowerCase();
  const budget = input.budget ? parseInt(input.budget.replace(/\D/g, ""), 10) : Infinity;

  type Rule = { keywords: string[]; products: string[]; tip: string };
  const rules: Rule[] = [
    {
      keywords: ["oily", "acne", "pores", "shine", "greasy"],
      products: ["Ghassoul Clay Mask 200g", "SPF 50 Sunscreen 75ml", "Rose Water Toner 200ml"],
      tip: "For oily skin, use the ghassoul mask 2x/week to control sebum, and always finish with SPF.",
    },
    {
      keywords: ["dry", "dehydrated", "tight", "flaky", "dull skin"],
      products: ["Argan Oil Face Serum 50ml", "Rose Water Toner 200ml", "Vitamin C Brightening Cream 50ml"],
      tip: "Layer toner → serum → cream for maximum hydration. Argan oil serum is a game-changer for dry skin.",
    },
    {
      keywords: ["aging", "wrinkle", "fine line", "anti-age", "firming"],
      products: ["Retinol Night Cream 50ml", "Argan Oil Face Serum 50ml", "Vitamin C Brightening Cream 50ml"],
      tip: "Use retinol at night, vitamin C in the morning, and argan serum daily for visible anti-aging results.",
    },
    {
      keywords: ["bright", "dark spot", "hyperpigmentation", "uneven tone", "glow"],
      products: ["Vitamin C Brightening Cream 50ml", "Rose Water Toner 200ml", "SPF 50 Sunscreen 75ml"],
      tip: "Vitamin C + SPF is the golden duo for brightening. SPF prevents new dark spots from forming.",
    },
    {
      keywords: ["sensitive", "redness", "irritat", "react"],
      products: ["Rose Water Toner 200ml", "Argan Oil Face Serum 50ml"],
      tip: "Keep it simple for sensitive skin — rose water and argan oil are gentle and naturally soothing.",
    },
    {
      keywords: ["frizz", "dry hair", "damaged hair", "repair hair"],
      products: ["Pure Argan Oil Hair Treatment 100ml", "Deep Conditioning Mask 300ml", "Anti-Frizz Hair Serum 50ml"],
      tip: "Use the argan oil treatment after washing and the mask once a week for deep repair.",
    },
    {
      keywords: ["hair growth", "hair loss", "thin hair"],
      products: ["Moisturizing Shampoo 400ml", "Pure Argan Oil Hair Treatment 100ml"],
      tip: "A gentle sulfate-free shampoo + scalp massage with argan oil can improve hair health significantly.",
    },
    {
      keywords: ["body", "soft skin", "moistur body", "hammam", "exfoliat"],
      products: ["Beldi Black Soap 300g", "Hammam Kessa Exfoliating Glove", "Rose Body Lotion 400ml", "Argan Body Oil 200ml"],
      tip: "The classic Moroccan hammam ritual: beldi soap + kessa glove, then seal with argan body oil.",
    },
    {
      keywords: ["perfume", "fragrance", "scent", "smell", "cologne"],
      products: ["Oud Rose Eau de Parfum 50ml", "Jasmine & White Musk EDP 50ml", "Atlas Cedar Cologne 100ml"],
      tip: "Oud Rose is rich and long-lasting for evenings. Jasmine Musk is softer for daily wear.",
    },
  ];

  let matched: Rule | undefined;
  for (const rule of rules) {
    if (rule.keywords.some((k) => concern.includes(k))) {
      matched = rule;
      break;
    }
  }

  if (!matched) {
    return `Based on your needs, I'd love to give you a personalised recommendation. Could you tell me more? For example: oily or dry skin, hair concern, or a specific goal like brightening or anti-aging?`;
  }

  const recommended = matched.products
    .map((name) => config.services.find((p) => p.name.includes(name.split(" ")[0]) || p.name === name))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .filter((p) => {
      const price = parseInt(p.price.replace(/\D/g, ""), 10);
      return price <= budget;
    });

  if (recommended.length === 0) {
    return `The products I'd recommend for "${input.concern}" are slightly above your budget. Would you like me to suggest the most affordable option, or would you like to adjust the budget?`;
  }

  const lines = recommended.map((p) => `• ${p.name} — ${p.price}\n  ${p.description}`).join("\n\n");
  return `Recommended for ${input.concern}:\n\n${lines}\n\nTip: ${matched.tip}`;
}

function buildRoutine(
  input: z.infer<typeof BuildRoutineInput>,
  config: BusinessConfig
): string {
  const skinType = input.skin_type ?? "normal";
  const concerns = input.concerns ?? "";

  const isOily = skinType === "oily" || concerns.includes("oily");
  const isDry = skinType === "dry" || concerns.includes("dry");
  const isAntiAge = concerns.includes("aging") || concerns.includes("wrinkle");
  const isBright = concerns.includes("bright") || concerns.includes("spot");

  const routines: Record<string, { step: string; product: string; price: string }[]> = {
    morning: [
      { step: "1. Cleanse", product: isDry ? "Rose Water Toner 200ml (as gentle cleanser)" : "Rose Water Toner 200ml", price: "99 MAD" },
      { step: "2. Tone", product: "Rose Water Toner 200ml", price: "99 MAD" },
      { step: "3. Serum", product: isBright ? "Vitamin C Brightening Cream 50ml" : "Argan Oil Face Serum 50ml", price: isBright ? "245 MAD" : "189 MAD" },
      { step: "4. SPF (non-negotiable!)", product: "SPF 50 Sunscreen 75ml", price: "165 MAD" },
    ],
    evening: [
      { step: "1. Double cleanse", product: "Ghassoul Clay Mask 200g (2–3x/week) or Rose Water Toner", price: "79–99 MAD" },
      { step: "2. Tone", product: "Rose Water Toner 200ml", price: "99 MAD" },
      { step: "3. Treatment", product: isAntiAge ? "Retinol Night Cream 50ml" : "Argan Oil Face Serum 50ml", price: isAntiAge ? "285 MAD" : "189 MAD" },
      { step: "4. Moisturise", product: isOily ? "Rose Water Toner 200ml (skip heavy cream)" : "Vitamin C Brightening Cream 50ml", price: isOily ? "99 MAD" : "245 MAD" },
    ],
    haircare: [
      { step: "1. Shampoo (3x/week)", product: "Moisturizing Shampoo 400ml", price: "95 MAD" },
      { step: "2. Weekly mask", product: "Deep Conditioning Mask 300ml", price: "129 MAD" },
      { step: "3. Leave-in treatment", product: "Pure Argan Oil Hair Treatment 100ml", price: "159 MAD" },
      { step: "4. Styling finish", product: "Anti-Frizz Hair Serum 50ml", price: "110 MAD" },
    ],
  };

  const key = input.routine_type === "full_day" ? "morning" : input.routine_type;
  const steps = routines[key] ?? routines.morning;

  const total = steps.reduce((sum, s) => {
    const price = parseInt(s.price.replace(/\D/g, ""), 10);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  const header =
    input.routine_type === "haircare"
      ? `Personalised Haircare Routine${input.concerns ? ` for ${input.concerns}` : ""}:`
      : `${input.routine_type === "full_day" ? "Full Day" : input.routine_type.charAt(0).toUpperCase() + input.routine_type.slice(1)} Skincare Routine${skinType !== "normal" ? ` for ${skinType} skin` : ""}:`;

  const lines = steps.map((s) => `${s.step}\n   → ${s.product} — ${s.price}`).join("\n\n");

  const fullDaySuffix =
    input.routine_type === "full_day"
      ? "\n\nEvening additions:\n• Retinol Night Cream 50ml (285 MAD) — replaces day serum\n• Remove SPF before bed"
      : "";

  return `${header}\n\n${lines}${fullDaySuffix}\n\nEstimated total: ~${total} MAD\nFree delivery when you order all together (over 350 MAD)!\n\nWould you like to order this routine?`;
}

function getBundleSuggestion(productName: string, config: BusinessConfig): string {
  const name = productName.toLowerCase();

  const bundles: Record<string, string[]> = {
    "argan oil face serum": ["Rose Water Toner 200ml", "SPF 50 Sunscreen 75ml"],
    "rose water toner": ["Argan Oil Face Serum 50ml", "Vitamin C Brightening Cream 50ml"],
    "vitamin c brightening cream": ["SPF 50 Sunscreen 75ml", "Rose Water Toner 200ml"],
    "ghassoul clay mask": ["Rose Water Toner 200ml", "Argan Oil Face Serum 50ml"],
    "retinol night cream": ["Vitamin C Brightening Cream 50ml", "SPF 50 Sunscreen 75ml"],
    "spf 50 sunscreen": ["Vitamin C Brightening Cream 50ml", "Rose Water Toner 200ml"],
    "matte foundation": ["Setting Spray 100ml", "Concealer Pen"],
    "long-lasting lipstick": ["Kajal Eyeliner", "Setting Spray 100ml"],
    "18-shade eyeshadow palette": ["Kajal Eyeliner", "Setting Spray 100ml"],
    "pure argan oil hair treatment": ["Moisturizing Shampoo 400ml", "Anti-Frizz Hair Serum 50ml"],
    "moisturizing shampoo": ["Deep Conditioning Mask 300ml", "Pure Argan Oil Hair Treatment 100ml"],
    "beldi black soap": ["Hammam Kessa Exfoliating Glove", "Argan Body Oil 200ml"],
    "oud rose eau de parfum": ["Rose Body Lotion 400ml", "Argan Body Oil 200ml"],
  };

  const matchKey = Object.keys(bundles).find((k) => name.includes(k.split(" ")[0]) || name.includes(k));
  const bundleNames = matchKey ? bundles[matchKey] : null;

  if (!bundleNames) {
    return `Great choice! Would you like me to suggest products that complement your selection?`;
  }

  const bundleProducts = bundleNames
    .map((n) => config.services.find((p) => p.name.includes(n.split(" ")[0])))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  if (bundleProducts.length === 0) return `Great choice! Would you like to see the full routine this product belongs to?`;

  const lines = bundleProducts.map((p) => `• ${p.name} — ${p.price}`).join("\n");
  const total = bundleProducts.reduce((sum, p) => sum + parseInt(p.price.replace(/\D/g, ""), 10), 0);

  return `Customers who buy ${productName} often pair it with:\n\n${lines}\n\nBundle total: ~${total} MAD extra.\nOrder together for free delivery if your cart exceeds 350 MAD!`;
}

function checkStock(productName: string, config: BusinessConfig): string {
  const name = productName.toLowerCase();
  const found = config.services.find(
    (p) => p.name.toLowerCase().includes(name) || name.includes(p.name.toLowerCase().split(" ")[0])
  );
  if (!found) return `We don't currently carry "${productName}". Would you like me to suggest something similar?`;
  return `"${found.name}" is in stock at ${found.price}. Ready to ship within 24 hours.`;
}

function trackOrder(input: z.infer<typeof TrackOrderInput>): string {
  if (input.order_id) {
    return `Order tracking for ${input.order_id}: Your order is currently being prepared and will ship within 24 hours. You will receive a tracking SMS once it's dispatched. If your order is more than 3 business days old and you haven't received it, please contact our team.`;
  }
  if (input.contact) {
    return `To look up your order by phone/email, please provide your order reference number (format: ZB-XXXXXX) which was sent to you via WhatsApp or email when you ordered. If you don't have it, our team can help — say "speak to a person" and we'll assist you.`;
  }
  return `Please provide your order reference number (ZB-XXXXXX) or the phone/email used when ordering.`;
}

async function captureLead(
  input: z.infer<typeof CaptureLeadInput>,
  conversationId?: string
): Promise<string> {
  await prisma.lead.create({
    data: {
      name: input.name,
      contact: input.contact,
      interest: input.interest,
      language: input.language,
      source: "web",
      status: "new",
      conversationId,
    },
  });
  await notifyNewLead({ ...input, conversationId });
  return `Lead saved: ${input.name} (${input.contact}) — interested in: ${input.interest}`;
}

async function placeOrder(
  input: z.infer<typeof PlaceOrderInput>,
  conversationId?: string
): Promise<string> {
  const orderRef = `ZB-${Date.now().toString().slice(-6)}`;
  await prisma.order.create({
    data: {
      orderRef,
      name: input.name,
      contact: input.contact,
      product: input.product,
      address: input.address,
      paymentMethod: input.payment_method ?? "cash_on_delivery",
      status: "pending",
      conversationId,
    },
  });
  await notifyNewOrder({ orderRef, name: input.name, contact: input.contact, product: input.product, address: input.address });
  const paymentLabel =
    input.payment_method === "card" ? "credit/debit card"
    : input.payment_method === "bank_transfer" ? "bank transfer"
    : "cash on delivery";
  return `Order confirmed! Ref: #${orderRef}\nProduct: ${input.product}\nDelivery to: ${input.address}\nPayment: ${paymentLabel}\nEstimated delivery: 2-3 business days. Tracking number will be sent to ${input.contact} once shipped.`;
}

async function handoffToHuman(reason: string, conversationId?: string): Promise<string> {
  if (conversationId) {
    await prisma.conversation.updateMany({
      where: { id: conversationId },
      data: { needsHuman: true },
    });
  }
  await notifyHandoff({ reason, conversationId });
  return `Handoff triggered. Reason: ${reason}. A team member will contact you shortly.`;
}

async function updateUserProfile(
  input: z.infer<typeof UpdateProfileInput>,
  userId?: string
): Promise<string> {
  if (!userId) return "Profile update skipped — no user session.";

  const data: Record<string, string> = {};
  if (input.name) data.name = input.name;
  if (input.skin_type) data.skinType = input.skin_type;
  if (input.hair_type) data.hairType = input.hair_type;
  if (input.concerns) data.concerns = input.concerns;
  if (input.language) data.language = input.language;
  if (input.notes) data.notes = input.notes;

  if (Object.keys(data).length === 0) return "Nothing new to save.";

  await prisma.userProfile.upsert({
    where: { userId },
    update: data,
    create: { userId, ...data },
  });

  const saved = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(", ");
  return `Profile updated — saved: ${saved}`;
}
