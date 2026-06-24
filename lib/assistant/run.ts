import Groq from "groq-sdk";
import { v4 as uuidv4 } from "uuid";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import type { AssistantRequest, AssistantResponse, BusinessConfig, UserProfile } from "./types";
import { buildSystemPrompt } from "./prompt";
import { getToolDefinitions, runTool } from "./tools";
import { defaultBusinessConfig } from "./defaultConfig";
import { prisma } from "@/lib/db/prisma";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const model = process.env.ASSISTANT_MODEL ?? "meta-llama/llama-4-scout-17b-16e-instruct";

const MAX_HISTORY_PAIRS = 20;
const MAX_TOOL_ITERATIONS = 8;

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
    });

    const choice = response.choices[0];
    const assistantMessage = choice.message;
    messages.push(assistantMessage as ChatCompletionMessageParam);

    if (choice.finish_reason !== "tool_calls" || !assistantMessage.tool_calls?.length) {
      const reply = assistantMessage.content ?? "I'm sorry, something went wrong. Please try again.";
      const historyWithoutSystem = messages.slice(1);
      await saveHistory(conversationId, historyWithoutSystem, needsHuman, channel);
      return { conversationId, reply };
    }

    const toolResults = await Promise.all(
      assistantMessage.tool_calls.map(async (tc) => {
        const input = JSON.parse(tc.function.arguments ?? "{}");
        if (tc.function.name === "handoff_to_human") needsHuman = true;
        const output = await runTool(tc.function.name, input, config, conversationId, userId);
        return { role: "tool" as const, tool_call_id: tc.id, content: output };
      })
    );

    messages.push(...toolResults);
  }

  await saveHistory(conversationId, messages.slice(1), needsHuman, channel);
  return { conversationId, reply: "I'm sorry, something went wrong. Please try again." };
}
