"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, Mic, MicOff } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STORAGE_USER_ID = "zina_user_id";

function getOrCreateUserId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_USER_ID);
    if (stored) return stored;
    const id = uuidv4();
    localStorage.setItem(STORAGE_USER_ID, id);
    return id;
  } catch {
    return uuidv4();
  }
}

// Dynamically built welcome so it renders on client after we know the user
function buildWelcome(): Message {
  return {
    role: "assistant",
    content: "Marhba! 🌹 Welcome to Zina Beauty. Tell me your skin type or what you're looking for and I'll find the perfect products for you — or ask me anything about our store.",
  };
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [userId, setUserId] = useState<string | undefined>();
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const lastTranscriptRef = useRef("");
  const panelId = useId();
  const titleId = useId();

  // Initialise userId + welcome message on mount (client-only)
  useEffect(() => {
    const id = getOrCreateUserId();
    setUserId(id);
    setMessages([buildWelcome()]);

    const SR =
      typeof window !== "undefined"
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;
    setVoiceSupported(!!SR);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Voice input ─────────────────────────────────────────────────────────────

  const sendMessageWithText = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      setInput("");
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setLoading(true);

      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId, userId, message: text }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Request failed");

        setConversationId(data.conversationId);
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [conversationId, userId, loading]
  );

  function toggleVoice() {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    // fr-MA is closest to Moroccan Darija for recognition — also captures French well
    recognition.lang = "fr-MA";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results as SpeechRecognitionResultList)
        .map((r) => r[0].transcript)
        .join("");
      lastTranscriptRef.current = transcript;
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      const text = lastTranscriptRef.current.trim();
      lastTranscriptRef.current = "";
      if (text) {
        // Auto-send after voice finishes — the user spoke, they're ready
        sendMessageWithText(text);
        setInput("");
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      lastTranscriptRef.current = "";
    };

    recognition.start();
    recognitionRef.current = recognition;
  }

  // ── Text send ────────────────────────────────────────────────────────────────

  async function sendMessage() {
    await sendMessageWithText(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open Zina Beauty assistant"}
        aria-expanded={open}
        aria-controls={panelId}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-200 ease-out hover:scale-110 active:scale-95"
        style={{ backgroundColor: "#E5501E" }}
      >
        {open ? (
          <X className="h-6 w-6 text-white" aria-hidden />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" aria-hidden />
        )}
        {/* Pulse ring when closed */}
        {!open && (
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ backgroundColor: "#E5501E" }}
          />
        )}
      </button>

      {/* Chat panel */}
      <div
        id={panelId}
        role="dialog"
        aria-labelledby={titleId}
        aria-hidden={!open}
        className={[
          "fixed bottom-24 right-6 z-50 flex w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl shadow-2xl",
          "transition-all duration-240 ease-out",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
            : "opacity-0 translate-y-4 pointer-events-none scale-95",
        ].join(" ")}
        style={{ height: "min(600px, calc(100vh - 8rem))", backgroundColor: "#FBF8F2" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: "#E5501E" }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white font-bold text-sm shrink-0">
            Z
          </div>
          <div className="flex-1 min-w-0">
            <h2 id={titleId} className="text-sm font-bold text-white leading-tight">
              Zina Beauty
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-300" />
              <p className="text-xs text-white/80">Online — replies instantly</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          aria-live="polite"
          aria-label="Chat messages"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={["flex", msg.role === "user" ? "justify-end" : "justify-start"].join(" ")}
            >
              {msg.role === "assistant" && (
                <div
                  className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                  style={{ backgroundColor: "#E5501E" }}
                >
                  Z
                </div>
              )}
              <div
                className={[
                  "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
                  msg.role === "user"
                    ? "rounded-br-sm text-white"
                    : "rounded-bl-sm",
                ].join(" ")}
                style={
                  msg.role === "user"
                    ? { backgroundColor: "#E5501E", color: "#fff" }
                    : { backgroundColor: "#EDE8DF", color: "#1B1714" }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start items-end gap-2">
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                style={{ backgroundColor: "#E5501E" }}
              >
                Z
              </div>
              <div
                className="flex items-center gap-1 rounded-2xl rounded-bl-sm px-4 py-3"
                style={{ backgroundColor: "#EDE8DF" }}
                aria-label="Assistant is typing"
              >
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block h-1.5 w-1.5 rounded-full bg-[#1B1714]/40 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Voice listening banner */}
        {isListening && (
          <div
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "#B5431A" }}
          >
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Listening… speak now
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {/* Input bar */}
        <div
          className="flex items-end gap-2 border-t px-3 py-3"
          style={{ borderColor: "#E8E2D9" }}
        >
          <label htmlFor="chat-input" className="sr-only">Type a message</label>
          <textarea
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? "Listening…" : "Type or speak a message…"}
            rows={1}
            disabled={loading || isListening}
            className={[
              "flex-1 resize-none rounded-xl border px-3 py-2 text-sm text-[#1B1714] placeholder-[#1B1714]/40",
              "focus:outline-none focus:ring-2 focus:ring-[#E5501E]/40 focus:border-[#E5501E]",
              "disabled:opacity-60 transition-colors max-h-28 leading-relaxed bg-white",
            ].join(" ")}
            style={{ borderColor: "#D6CFC5" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
          />

          {/* Mic button — only shown when browser supports it */}
          {voiceSupported && (
            <button
              onClick={toggleVoice}
              disabled={loading}
              aria-label={isListening ? "Stop listening" : "Start voice input"}
              title={isListening ? "Stop" : "Speak"}
              className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-160",
                "disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95",
                isListening ? "text-white" : "text-white",
              ].join(" ")}
              style={{
                backgroundColor: isListening ? "#B5431A" : "#D89B3F",
              }}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" aria-hidden />
              ) : (
                <Mic className="h-4 w-4" aria-hidden />
              )}
            </button>
          )}

          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim() || isListening}
            aria-label="Send message"
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-160",
              "disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95",
            ].join(" ")}
            style={{ backgroundColor: "#E5501E" }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 text-white animate-spin" aria-hidden />
            ) : (
              <Send className="h-4 w-4 text-white" aria-hidden />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
