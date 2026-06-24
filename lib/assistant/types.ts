import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

export interface Product {
  name: string;
  description: string;
  price: string;
}

export interface BusinessConfig {
  name: string;
  description: string;
  services: Product[];
  hours: Record<string, string>;
  location: string;
  languages: string[];
  faq: { q: string; a: string }[];
  handoffEmail: string;
}

export interface UserProfile {
  userId: string;
  name?: string | null;
  skinType?: string | null;
  hairType?: string | null;
  concerns?: string | null;
  language?: string | null;
  notes?: string | null;
}

export type ConversationHistory = ChatCompletionMessageParam[];

export interface AssistantRequest {
  conversationId?: string;
  message: string;
  channel?: "web" | "whatsapp";
  userId?: string;
}

export interface AssistantResponse {
  conversationId: string;
  reply: string;
}
