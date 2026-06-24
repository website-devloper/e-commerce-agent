import Groq from "groq-sdk";
import { v4 as uuidv4 } from "uuid";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import type { AssistantRequest, AssistantResponse, BusinessConfig, UserProfile } from "./types";
import { buildSystemPrompt } from "./prompt";
import { getToolDefinitions, runTool } from "./tools";
import { defaultBusinessConfig } from "./defaultConfig";
import { prisma } from "@/lib/db/prisma";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// llama-3.3-70b-versatile: best quality on Groq for Darija + tool use
const model = process.env.ASSISTANT_MODEL ?? "llama-3.3-70b-versatile";

const MAX_HISTORY_PAIRS   = 20;
const MAX_TOOL_ITERATIONS = 5;

async function getBusinessConfig(): Promise<BusinessConfig> {
  try {
    const row = await prisma.businessConfig.findFirst({ orderBy: { id: "desc" } });
    if (!row) return defaultBusinessConfig;
    return {
      name: row.name,
      description: row.description,
      services: JSON.parse(row.servicesJson),
      hours: JSON.parse(row.hoursJson),
      location: row.location,
      languages: JSON.parse(row.languages),
      faq: JSON.parse(row.faqJson),
      handoffEmail: row.handoffEmail,
    };
  } catch {
    return defaultBusinessConfig;
  }
}

async function loadHistory(conversationId: string): Promise<ChatCompletionMessageParam[]> {
  try {
    const conv = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conv) return [];
    return JSON.parse(conv.messagesJson) as ChatCompletionMessageParam[];
  } catch {
    return [];
  }
}

async function loadUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    return await prisma.userProfile.findUnique({ where: { userId } });
  } catch {
    return null;
  }
}

async function saveHistory(
  conversationId: string,
  messages: ChatCompletionMessageParam[],
  needsHuman = false,
  channel = "web"
) {
  const trimmed =
    messages.length > MAX_HISTORY_PAIRS * 2
      ? messages.slice(messages.length - MAX_HISTORY_PAIRS * 2)
      : messages;

  await prisma.conversation.upsert({
    where: { id: conversationId },
    update: { messagesJson: JSON.stringify(trimmed), needsHuman, updatedAt: new Date() },
    create: { id: conversationId, channel, messagesJson: JSON.stringify(trimmed), needsHuman },
  });
}

// Parse tool arguments safely — return null if malformed
function parseToolArgs(raw: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(raw || "{}");
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function runAssistant(request: AssistantRequest): Promise<AssistantResponse> {
  const conversationId = request.conversationId ?? uuidv4();
  const channel = request.channel ?? "web";
  const userId = request.userId;

  const [config, history, profile] = await Promise.all([
    getBusinessConfig(),
    loadHistory(conversationId),
    userId ? loadUserProfile(userId) : Promise.resolve(null),
  ]);

  history.push({ role: "user", content: request.message });

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt(config, profile) },
    ...history,
  ];

  let needsHuman = false;

  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    const response = await groq.chat.completions.create({
      model,
      messages,
      tools: getToolDefinitions(),
      tool_choice: "auto",
      max_tokens: 1024,
      temperature: 0.2,
    });

    const choice = response.choices[0];
    const assistantMessage = choice.message;
    messages.push(assistantMessage as ChatCompletionMessageParam);

    // No tool calls — we have the final text reply
    if (choice.finish_reason !== "tool_calls" || !assistantMessage.tool_calls?.length) {
      const reply = assistantMessage.content?.trim() ?? "Maalik, chi 7aja machi mezyana. 3afak 3awd mera.";
      await saveHistory(conversationId, messages.slice(1), needsHuman, channel);
      return { conversationId, reply };
    }

    // Execute tool calls — with repair/retry on bad args
    const toolResults: ChatCompletionMessageParam[] = [];

    for (const tc of assistantMessage.tool_calls) {
      const args = parseToolArgs(tc.function.arguments ?? "{}");

      if (!args) {
        // Bad args — inject a corrective message and break out of tool loop to retry
        messages.push({
          role: "tool" as const,
          tool_call_id: tc.id,
          content: `Error: could not parse arguments for ${tc.function.name}. Please call the tool again with valid JSON arguments.`,
        });
        continue;
      }

      if (tc.function.name === "handoff_to_human") needsHuman = true;

      let output: string;
      try {
        output = await runTool(tc.function.name, args, config, conversationId, userId);
      } catch (err) {
        output = `Tool ${tc.function.name} failed: ${err instanceof Error ? err.message : "unknown error"}`;
      }

      toolResults.push({ role: "tool" as const, tool_call_id: tc.id, content: output });
    }

    messages.push(...toolResults);
  }

  await saveHistory(conversationId, messages.slice(1), needsHuman, channel);
  return { conversationId, reply: "Maalik, chi 7aja machi mezyana. 3afak 3awd mera." };
}
