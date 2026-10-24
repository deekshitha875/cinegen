"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Send, Loader2, Sparkles, MessageCircle,
  Mic, MicOff, Volume2, VolumeX, ChevronDown, Globe,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Message = { role: "user" | "assistant"; content: string; source?: "voice" | "text" };
type VoiceState = "idle" | "listening" | "processing";

// ─── Language config ──────────────────────────────────────────────────────────
const LANGUAGES = [
  { code: "en-US", label: "English",    short: "EN" },
  { code: "hi-IN", label: "हिन्दी",      short: "HI" },
  { code: "te-IN", label: "తెలుగు",      short: "TE" },
  { code: "ta-IN", label: "தமிழ்",        short: "TA" },
  { code: "kn-IN", label: "ಕನ್ನಡ",        short: "KN" },
  { code: "ml-IN", label: "മലയാളം",      short: "ML" },
  { code: "mr-IN", label: "मराठी",        short: "MR" },
  { code: "bn-IN", label: "বাংলা",        short: "BN" },
  { code: "gu-IN", label: "ગુજરાતી",      short: "GU" },
  { code: "pa-IN", label: "ਪੰਜਾਬੀ",       short: "PA" },
];

const WELCOME = "Hi! I'm the CineGen Assistant 👋 Ask me anything — discovering creators, posting briefs, match scores, the Budget Estimator, or demo login. 🎤 You can also speak to me!";

const QUICK_CHIPS = [
  "How do I find AI creators?",
  "How does brief matching work?",
  "Show demo login credentials",
  "What is the Budget Estimator?",
];

// ─── Web Speech API shim ──────────────────────────────────────────────────────
type SR = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SREvent) => void) | null;
  onerror:  ((e: SRError) => void) | null;
  onend:    (() => void) | null;
  onstart:  (() => void) | null;
};
type SREvent = { results: { length: number; [i: number]: { isFinal: boolean; 0: { transcript: string } } }; resultIndex: number };
type SRError = { error: string };

declare global {
  interface Window {
    SpeechRecognition:        new () => SR;
    webkitSpeechRecognition:  new () => SR;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CineGenAssistant() {
  const [open, setOpen]           = useState(false);
  const [messages, setMessages]   = useState<Message[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [pulse, setPulse]         = useState(true);

  // Voice
  const [voiceState, setVoiceState]         = useState<VoiceState>("idle");
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [muted, setMuted]                   = useState(false);
  const [langCode, setLangCode]             = useState("en-US");
  const [showLang, setShowLang]             = useState(false);
  const [interimText, setInterimText]       = useState("");

  const srRef      = useRef<SR | null>(null);
  const synthRef   = useRef<SpeechSynthesis | null>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // Detect browser support once on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasSR = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
      setVoiceSupported(hasSR);
      synthRef.current = window.speechSynthesis ?? null;
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    if (open) {
      setPulse(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [open, messages]);

  // ── TTS ──────────────────────────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (!synthRef.current || muted) return;
    synthRef.current.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang  = langCode;
    utter.rate  = 1.05;

    // Pick the best matching voice
    const voices = synthRef.current.getVoices();
    const langBase = langCode.split("-")[0];
    const match = voices.find(v => v.lang === langCode)
                ?? voices.find(v => v.lang.startsWith(langBase))
                ?? null;
    if (match) utter.voice = match;

    synthRef.current.speak(utter);
  }, [muted, langCode]);

  // ── Send to API ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text?: string, source: "voice" | "text" = "text") => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content, source };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setInterimText("");
    setLoading(true);

    try {
      const res  = await fetch("/api/assistant", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      const reply = data.reply as string;
      setMessages([...history, { role: "assistant", content: reply }]);
      speak(reply);
    } catch {
      const err = "Something went wrong. Please try again!";
      setMessages([...history, { role: "assistant", content: err }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, speak]);

  // ── Start voice recognition ───────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!voiceSupported) return;

    // Stop any existing session
    srRef.current?.abort();
    synthRef.current?.cancel();

    const SRClass = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    const sr = new SRClass();
    sr.lang            = langCode;
    sr.continuous      = false;
    sr.interimResults  = true;

    sr.onresult = (e: SREvent) => {
      let interim = "";
      let final   = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) final += t;
        else interim += t;
      }
      if (interim)  setInterimText(interim);
      if (final)    setInterimText(final);   // show final briefly before submitting
    };

    sr.onerror = (e: SRError) => {
      if (e.error !== "aborted") {
        setVoiceState("idle");
        setInterimText("");
      }
    };

    sr.onend = () => {
      setVoiceState(prev => {
        // If we were listening and got something, submit it
        if (prev === "listening") {
          setInterimText(t => {
            const captured = t.trim();
            if (captured) {
              setVoiceState("processing");
              sendMessage(captured, "voice");
            }
            return "";
          });
        }
        return "idle";
      });
    };

    srRef.current = sr;
    sr.start();
    setVoiceState("listening");
    setInterimText("");
  }, [voiceSupported, langCode, sendMessage]);

  const stopListening = () => {
    srRef.current?.stop();
    setVoiceState("idle");
    setInterimText("");
  };

  // Cleanup on unmount
  useEffect(() => () => {
    srRef.current?.abort();
    synthRef.current?.cancel();
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === langCode) ?? LANGUAGES[0];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20 }}
            className="mb-4 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            style={{
              background: "hsl(240 8% 7%)",
              border: "1px solid rgba(255,255,255,0.1)",
              maxHeight: "520px",
            }}
          >
            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(6,182,212,0.2))" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">CineGen Assistant</div>
                  <div className="text-xs text-green-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    Gemini AI · Voice {voiceSupported ? "ready" : "unavailable"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Mute toggle */}
                <button
                  onClick={() => { setMuted(m => !m); synthRef.current?.cancel(); }}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/50 hover:text-white"
                  title={muted ? "Unmute responses" : "Mute responses"}
                >
                  {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                {/* Language picker */}
                <div className="relative">
                  <button
                    onClick={() => setShowLang(s => !s)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-white/10 transition text-xs text-white/60 hover:text-white"
                  >
                    <Globe className="w-3 h-3" />
                    {currentLang.short}
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform ${showLang ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showLang && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute right-0 top-full mt-1 w-36 rounded-xl overflow-hidden shadow-2xl z-50"
                        style={{ background: "hsl(240 8% 10%)", border: "1px solid rgba(255,255,255,0.12)" }}
                      >
                        {LANGUAGES.map(l => (
                          <button
                            key={l.code}
                            onClick={() => {
                              setLangCode(l.code);
                              setShowLang(false);
                              // Update active recognition if running
                              if (srRef.current) srRef.current.lang = l.code;
                            }}
                            className={`w-full text-left px-3 py-2 text-xs hover:bg-white/8 transition flex justify-between items-center ${l.code === langCode ? "text-violet-400" : "text-white/70"}`}
                          >
                            <span>{l.label}</span>
                            {l.code === langCode && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-sm"
                        : "bg-white/8 text-white/90 rounded-bl-sm border border-white/5"
                    }`}
                  >
                    {msg.content}
                    {msg.source === "voice" && (
                      <span className="ml-1 opacity-50 text-xs">🎤</span>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Interim transcript while listening */}
              {interimText && (
                <div className="flex justify-end">
                  <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm bg-violet-600/30 text-white/60 border border-violet-500/20 italic">
                    {interimText}…
                  </div>
                </div>
              )}

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

              {/* Quick chips — first message only */}
              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {QUICK_CHIPS.map(chip => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="text-xs px-2.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 transition-colors text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* ── Voice status bar ── */}
            <AnimatePresence>
              {voiceState !== "idle" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden flex-shrink-0"
                >
                  <div className="px-4 py-2 border-t border-white/5 flex items-center gap-2"
                    style={{ background: "rgba(139,92,246,0.1)" }}>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                      className={`w-2 h-2 rounded-full ${voiceState === "listening" ? "bg-emerald-400" : "bg-amber-400"}`}
                    />
                    <span className="text-xs text-white/60">
                      {voiceState === "listening" ? "Listening… speak now" : "Processing…"}
                    </span>
                    {voiceState === "listening" && (
                      <button
                        onClick={stopListening}
                        className="ml-auto text-xs text-red-400 hover:text-red-300 transition"
                      >
                        Stop
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input bar ── */}
            <div className="p-3 border-t border-white/10 flex-shrink-0">
              <div className="flex gap-2 items-center">
                {/* Mic button */}
                {voiceSupported && (
                  <button
                    onClick={voiceState === "listening" ? stopListening : startListening}
                    disabled={loading || voiceState === "processing"}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 ${
                      voiceState === "listening"
                        ? "bg-red-500/80 hover:bg-red-500"
                        : "bg-white/8 hover:bg-white/15 border border-white/10"
                    }`}
                    title={voiceState === "listening" ? "Stop listening" : `Speak in ${currentLang.label}`}
                  >
                    {voiceState === "listening" ? (
                      <MicOff className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <Mic className={`w-3.5 h-3.5 ${voiceState === "processing" ? "text-amber-400" : "text-violet-400"}`} />
                    )}
                  </button>
                )}

                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder={voiceSupported ? `Ask or 🎤 speak in ${currentLang.label}…` : "Ask anything about CineGen…"}
                  disabled={loading}
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                />

                <button
                  onClick={() => sendMessage()}
                  disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* Language hint */}
              <div className="mt-1.5 text-center text-[10px] text-white/20">
                {voiceSupported
                  ? `🌐 ${currentLang.label} · 🔊 ${muted ? "muted" : "voice on"} · click 🎤 to speak`
                  : "Use Chrome or Edge for voice support"}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating button ── */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center relative"
        style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}
      >
        {/* Pulse ring */}
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

        {!open && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
            <span className="text-xs font-bold text-amber-900">AI</span>
          </div>
        )}
      </motion.button>
    </div>
  );
}
