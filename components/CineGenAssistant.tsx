"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, MessageCircle } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_CHIPS = [
  "How do I find AI creators?",
  "How does brief matching work?",
  "Show me demo login credentials",
  "What is the Budget Estimator?",
  "How do I post a brief?",
];

const WELCOME = "Hi! I'm the CineGen Assistant 👋 I can help you discover creators, build briefs, understand match scores, or navigate any feature. What would you like to know?";

export function CineGenAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulse, setPulse] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setPulse(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages]);

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Something went wrong. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="mb-4 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: "hsl(240 8% 7%)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">CineGen Assistant</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Powered by Gemini AI
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-sm"
                      : "bg-white/8 text-white/90 rounded-bl-sm border border-white/5"
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mr-2">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white/8 border border-white/5">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                  </div>
                </div>
              )}

              {/* Quick chips — show only at start */}
              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_CHIPS.map((chip) => (
                    <button key={chip} onClick={() => sendMessage(chip)}
                      className="text-xs px-2.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 transition-colors text-left">
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask anything about CineGen..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
                <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center relative"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>

        {/* Pulse ring when closed */}
        {!open && pulse && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}
            animate={{ scale: [1, 1.4, 1.4], opacity: [0.7, 0, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        )}

        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        {!open && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
            <span className="text-xs font-bold text-amber-900">AI</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
