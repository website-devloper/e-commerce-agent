"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import { X, Send, Loader2, Mic, MicOff, Sparkles } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Message { role: "user" | "assistant"; content: string; }

const STORAGE_USER_ID = "zina_user_id";
const DARK  = "#1A1028";
const GOLD  = "#C4963A";

function getOrCreateUserId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_USER_ID);
    if (stored) return stored;
    const id = uuidv4();
    localStorage.setItem(STORAGE_USER_ID, id);
    return id;
  } catch { return uuidv4(); }
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

  useEffect(() => {
    setUserId(getOrCreateUserId());
    setMessages([{
      role: "assistant",
      content: "Marhba bik! 🌿 I'm your personal beauty advisor at Zina Beauty.\n\nTell me your skin type or what you're looking for — I'll find the perfect products for you instantly.",
    }]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = typeof window !== "undefined" ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    setVoiceSupported(!!SR);
  }, []);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const sendMessageWithText = useCallback(async (text: string) => {
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
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally { setLoading(false); }
  }, [conversationId, userId, loading]);

  function toggleVoice() {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.continuous = false; r.interimResults = true; r.lang = "fr-MA"; r.maxAlternatives = 1;
    r.onstart = () => setIsListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (e: any) => {
      const t = Array.from(e.results as SpeechRecognitionResultList).map((x) => x[0].transcript).join("");
      lastTranscriptRef.current = t; setInput(t);
    };
    r.onend = () => { setIsListening(false); const t = lastTranscriptRef.current.trim(); lastTranscriptRef.current = ""; if (t) { sendMessageWithText(t); setInput(""); } };
    r.onerror = () => { setIsListening(false); lastTranscriptRef.current = ""; };
    r.start(); recognitionRef.current = r;
  }

  async function sendMessage() { await sendMessageWithText(input); }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  const quickReplies = ["Oily skin routine", "Best argan oil", "Order tracking", "Return policy"];

  return (
    <>
      {/* ── Float button ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open Zina Beauty assistant"}
        aria-expanded={open}
        aria-controls={panelId}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ background: `linear-gradient(135deg, ${DARK} 0%, #2E1A48 100%)` }}
      >
        {open ? <X className="h-5 w-5 text-white" /> : <Sparkles className="h-5 w-5 text-white" />}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-25" style={{ backgroundColor: GOLD }} />
        )}
        {/* Gold ring */}
        <span className="absolute -inset-0.5 rounded-full opacity-40" style={{ border: `1.5px solid ${GOLD}` }} />
      </button>

      {/* ── Chat panel ── */}
      <div
        id={panelId} role="dialog" aria-labelledby={titleId} aria-hidden={!open}
        className={[
          "fixed bottom-24 right-6 z-50 flex flex-col overflow-hidden",
          "w-[calc(100vw-3rem)] max-w-[380px]",
          "transition-all duration-300 ease-out",
          open ? "opacity-100 translate-y-0 pointer-events-auto scale-100" : "opacity-0 translate-y-5 pointer-events-none scale-95",
        ].join(" ")}
        style={{ height: "min(620px, calc(100vh - 8rem))", borderRadius: "1.5rem", boxShadow: "0 24px 64px rgba(26,16,40,0.22), 0 0 0 1px rgba(26,16,40,0.08)", backgroundColor: "#FAF8F4" }}
      >
        {/* Header */}
        <div className="relative flex items-center gap-3 px-5 py-4 shrink-0" style={{ background: `linear-gradient(135deg, ${DARK} 0%, #2E1A48 100%)` }}>
          {/* Gold accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-px opacity-30" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
          <div className="flex h-9 w-9 items-center justify-center rounded-full shrink-0 text-sm font-bold" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #D4A84A 100%)`, color: DARK }}>Z</div>
          <div className="flex-1 min-w-0">
            <h2 id={titleId} className="text-sm font-bold text-white leading-tight" style={{ fontFamily: "var(--font-playfair)" }}>Zina Beauty</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Your personal beauty advisor</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close chat"
            className="rounded-full p-1.5 transition-colors hover:bg-white/10" style={{ color: "rgba(255,255,255,0.6)" }}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" aria-live="polite">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
              {msg.role === "assistant" && (
                <div className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold mb-0.5"
                  style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #D4A84A 100%)`, color: DARK }}>Z</div>
              )}
              <div className={["max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
                msg.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"].join(" ")}
                style={msg.role === "user"
                  ? { background: `linear-gradient(135deg, ${DARK} 0%, #2E1A48 100%)`, color: "#fff" }
                  : { backgroundColor: "#FFFFFF", color: DARK, boxShadow: "0 2px 8px rgba(26,16,40,0.06)", border: "1px solid rgba(26,16,40,0.06)" }}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-end gap-2">
              <div className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: `linear-gradient(135deg, ${GOLD} 0%, #D4A84A 100%)`, color: DARK }}>Z</div>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm px-4 py-3"
                style={{ backgroundColor: "#FFFFFF", boxShadow: "0 2px 8px rgba(26,16,40,0.06)", border: "1px solid rgba(26,16,40,0.06)" }}
                aria-label="Typing…">
                {[0,1,2].map((i) => (
                  <span key={i} className="block h-1.5 w-1.5 rounded-full animate-bounce" style={{ backgroundColor: GOLD, animationDelay: `${i*150}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick replies (only show with first welcome message) */}
        {messages.length === 1 && !loading && (
          <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-hide">
            {quickReplies.map((r) => (
              <button key={r} onClick={() => sendMessageWithText(r)}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 whitespace-nowrap"
                style={{ backgroundColor: "#FFFFFF", color: DARK, border: `1px solid rgba(26,16,40,0.1)`, boxShadow: "0 1px 4px rgba(26,16,40,0.06)" }}>
                {r}
              </button>
            ))}
          </div>
        )}

        {/* Listening banner */}
        {isListening && (
          <div className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold"
            style={{ backgroundColor: `${GOLD}15`, color: GOLD, borderTop: `1px solid ${GOLD}20` }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: GOLD }} />
            Listening… speak now
          </div>
        )}

        {/* Input area */}
        <div className="shrink-0 border-t px-3 py-3" style={{ borderColor: "rgba(26,16,40,0.08)", backgroundColor: "#FFFFFF" }}>
          <div className="flex items-end gap-2">
            <label htmlFor="chat-input" className="sr-only">Type a message</label>
            <textarea
              id="chat-input" ref={inputRef} value={input}
              onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening…" : "Ask about products, skin type, orders…"}
              rows={1} disabled={loading || isListening}
              className="flex-1 resize-none rounded-xl border px-3 py-2.5 text-sm disabled:opacity-60 transition-all focus:outline-none max-h-28 leading-relaxed"
              style={{ borderColor: "rgba(26,16,40,0.12)", color: DARK, backgroundColor: "#FAF8F4", caretColor: GOLD }}
              onFocus={(e) => (e.target.style.borderColor = GOLD)}
              onBlur={(e) => (e.target.style.borderColor = "rgba(26,16,40,0.12)")}
              onInput={(e) => { const el = e.currentTarget; el.style.height = "auto"; el.style.height = `${el.scrollHeight}px`; }}
            />
            {voiceSupported && (
              <button onClick={toggleVoice} disabled={loading} aria-label={isListening ? "Stop" : "Voice input"}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: isListening ? `${GOLD}25` : `${DARK}08`, color: isListening ? GOLD : DARK }}>
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            )}
            <button onClick={sendMessage} disabled={loading || !input.trim() || isListening}
              aria-label="Send" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
              style={{ background: `linear-gradient(135deg, ${DARK} 0%, #2E1A48 100%)` }}>
              {loading ? <Loader2 className="h-4 w-4 text-white animate-spin" /> : <Send className="h-4 w-4 text-white" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
