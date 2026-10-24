"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Keyboard, ChevronDown, Loader2,
  Sparkles, Send, Volume2, VolumeX,
} from "lucide-react";

const LANGUAGES = [
  { code: "en-US", label: "English" },
  { code: "hi-IN", label: "हिन्दी (Hindi)" },
  { code: "te-IN", label: "తెలుగు (Telugu)" },
  { code: "ta-IN", label: "தமிழ் (Tamil)" },
  { code: "kn-IN", label: "ಕನ್ನಡ (Kannada)" },
  { code: "ml-IN", label: "മലയാളം (Malayalam)" },
  { code: "mr-IN", label: "मराठी (Marathi)" },
  { code: "bn-IN", label: "বাংলা (Bengali)" },
  { code: "gu-IN", label: "ગુજરાતી (Gujarati)" },
  { code: "pa-IN", label: "ਪੰਜਾਬੀ (Punjabi)" },
];

type SR = {
  continuous: boolean; interimResults: boolean; lang: string;
  start(): void; stop(): void; abort(): void;
  onresult: ((e: SREvent) => void) | null;
  onerror:  ((e: SRErr) => void) | null;
  onend:    (() => void) | null;
  onstart:  (() => void) | null;
};
type SREvent = { results: { length: number; [i: number]: { isFinal: boolean; 0: { transcript: string } } }; resultIndex: number };
type SRErr   = { error: string };
type Msg     = { role: "user" | "assistant"; text: string; source?: "voice" | "text" };
type Phase   = "idle" | "listening" | "processing" | "chat";

// Fixed panel height — never changes regardless of content
const PANEL_H = 460;

export function DirectorPanel() {
  const [phase, setPhase]       = useState<Phase>("idle");
  const [voiceSupported, setVS] = useState(false);
  const [langCode, setLangCode] = useState("en-US");
  const [showLang, setShowLang] = useState(false);
  const [voiceOn, setVoiceOn]   = useState(false);
  const [muted, setMuted]       = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput]       = useState("");
  const [interim, setInterim]   = useState("");
  const [micError, setMicError] = useState("");

  const srRef     = useRef<SR | null>(null);
  const synthRef  = useRef<SpeechSynthesis | null>(null);
  // Scroll the messages DIV, NOT the page
  const msgsRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setVS(!!(window.SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition));
      synthRef.current = window.speechSynthesis ?? null;
    }
  }, []);

  // Scroll only the inner messages container
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, interim]);

  // Cleanup on unmount
  useEffect(() => () => {
    srRef.current?.abort();
    synthRef.current?.cancel();
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthRef.current || muted) return;
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = langCode;
    const voices = synthRef.current.getVoices();
    const base = langCode.split("-")[0];
    const v = voices.find(x => x.lang === langCode) ?? voices.find(x => x.lang.startsWith(base));
    if (v) u.voice = v;
    synthRef.current.speak(u);
  }, [muted, langCode]);

  const sendMessage = useCallback(async (text: string, source: "voice" | "text" = "text") => {
    const content = text.trim();
    if (!content) return;
    const userMsg: Msg = { role: "user", text: content, source };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setInterim("");
    setPhase("processing");

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(m => ({ role: m.role, content: m.text })) }),
      });
      const data = await res.json();
      const reply = data.reply as string;
      setMessages([...history, { role: "assistant", text: reply }]);
      speak(reply);
    } catch {
      setMessages([...history, { role: "assistant", text: "Something went wrong. Please try again!" }]);
    } finally {
      setPhase("chat");
    }
  }, [messages, speak]);

  const startListening = useCallback(() => {
    if (!voiceSupported) return;
    srRef.current?.abort();
    synthRef.current?.cancel();
    const W = window as unknown as { SpeechRecognition: new () => SR; webkitSpeechRecognition: new () => SR };
    const SRClass = W.SpeechRecognition ?? W.webkitSpeechRecognition;
    const sr = new SRClass();
    sr.lang = langCode; sr.continuous = false; sr.interimResults = true;
    sr.onstart = () => {};
    sr.onresult = (e: SREvent) => {
      let fin = ""; let int = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) fin += t; else int += t;
      }
      if (int) setInterim(int);
      if (fin) setInterim(fin);
    };
    sr.onerror = (e: SRErr) => {
      if (e.error === "not-allowed") {
        setMicError("Microphone access denied. Please allow mic in browser settings.");
        setPhase("chat");
      }
    };
    sr.onend = () => {
      setInterim(t => {
        const captured = t.trim();
        if (captured) sendMessage(captured, "voice");
        else setPhase(p => p === "listening" ? "chat" : p);
        return "";
      });
    };
    srRef.current = sr;
    sr.start();
    setPhase("listening");
    setMicError("");
    setInterim("");
  }, [voiceSupported, langCode, sendMessage]);

  const stopListening = () => { srRef.current?.stop(); };

  const checkMic = async () => {
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      setMicError("✓ Microphone is working!");
    } catch {
      setMicError("Microphone access denied. Please allow mic in browser settings.");
    }
  };

  const handleEnableVoice = async () => {
    if (!voiceSupported) {
      setMicError("Voice not supported here. Use Chrome or Edge.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
    } catch {
      setMicError("Microphone access denied.");
      return;
    }
    setVoiceOn(true);
    setMessages([{ role: "assistant", text: "Hi! I'm CineGen Director 🎬 Describe your campaign idea and I'll help shape your brief. What are you creating?" }]);
    setPhase("chat");
    speak("Hi! I'm CineGen Director. Describe your campaign idea and I'll help shape your brief.");
  };

  const handleTypeInstead = () => {
    setMessages([{ role: "assistant", text: "Hi! I'm CineGen Director 🎬 Type your campaign idea and I'll help build your brief. What are you creating?" }]);
    setPhase("chat");
  };

  const currentLang = LANGUAGES.find(l => l.code === langCode) ?? LANGUAGES[0];

  // Shared panel wrapper — FIXED height, no overflow to page
  const panelStyle: React.CSSProperties = {
    height: `${PANEL_H}px`,
    background: "linear-gradient(135deg, rgba(30,20,60,0.92) 0%, rgba(15,25,50,0.96) 100%)",
    border: "1px solid rgba(139,92,246,0.3)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 50px -12px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
    overflow: "hidden",   // ← NEVER lets content push past the box
  };

  // ─── IDLE panel ────────────────────────────────────────────────────────────
  if (phase === "idle") {
    return (
      <div className="rounded-2xl relative flex flex-col" style={panelStyle}>

        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Scrollable inner — so language list never breaks layout */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col">

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 flex items-center justify-center border border-violet-500/20"
            >
              <Sparkles className="w-6 h-6 text-violet-300" />
            </motion.div>
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <h3 className="text-xl font-bold text-white mb-1">CineGen Director</h3>
            <p className="text-white/70 text-sm font-medium">Your idea. Say it out loud.</p>
            <p className="text-white/40 text-xs mt-1">Describe your campaign. Shape your brief.</p>
          </div>

          {/* Language dropdown */}
          <div className="mb-4 relative z-20">
            <button
              onClick={() => setShowLang(s => !s)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-white/60 transition"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2">
                <span className="text-violet-400 text-xs">🌐</span>
                <span>Voice &amp; Language Settings</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">{voiceOn ? "On" : "Off"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLang ? "rotate-180" : ""}`} />
              </div>
            </button>

            <AnimatePresence>
              {showLang && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="absolute left-0 right-0 top-full mt-1 rounded-xl z-30 shadow-2xl"
                  style={{
                    background: "hsl(240 8% 10%)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    maxHeight: "220px",
                    overflowY: "auto",   // ← list scrolls inside dropdown, not page
                  }}
                >
                  <div className="sticky top-0 p-2 border-b border-white/5 flex items-center justify-between px-3"
                    style={{ background: "hsl(240 8% 10%)" }}>
                    <span className="text-xs text-white/40">Select language</span>
                    <button
                      onClick={() => { setMuted(m => !m); synthRef.current?.cancel(); }}
                      className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition"
                    >
                      {muted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      {muted ? "Unmute" : "Mute"} TTS
                    </button>
                  </div>
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { setLangCode(l.code); setShowLang(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition flex justify-between ${l.code === langCode ? "text-violet-400" : "text-white/70"}`}>
                      {l.label}
                      {l.code === langCode && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 self-center" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mic error / success */}
          {micError && (
            <p className={`text-xs text-center mb-3 ${micError.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>
              {micError}
            </p>
          )}

          {/* Action buttons */}
          <div className="space-y-2.5 mt-auto">
            <button
              onClick={handleEnableVoice}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
            >
              <Mic className="w-4 h-4" />
              Enable Voice Assistant
            </button>

            <button
              onClick={checkMic}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-white/70 hover:text-white transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Mic className="w-3.5 h-3.5" />
              Check microphone
            </button>

            <button
              onClick={handleTypeInstead}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm text-white/70 hover:text-white transition-all"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Keyboard className="w-3.5 h-3.5" />
              Type instead
            </button>
          </div>

          <p className="text-center text-xs text-white/25 mt-4 leading-relaxed">
            Voice recognition processes audio through your browser&apos;s speech service. No audio is stored.
          </p>
        </div>
      </div>
    );
  }

  // ─── CHAT panel ────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl flex flex-col" style={panelStyle}>

      {/* Header — fixed, never scrolls */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">CineGen Director</div>
            <div className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              {phase === "listening" ? "Listening…" : phase === "processing" ? "Thinking…" : "Live"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mute */}
          <button onClick={() => { setMuted(m => !m); synthRef.current?.cancel(); }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/40 hover:text-white/70">
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Language */}
          <div className="relative">
            <button onClick={() => setShowLang(s => !s)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition text-xs text-white/40 hover:text-white/70">
              🌐 {currentLang.code.split("-")[0].toUpperCase()}
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
            <AnimatePresence>
              {showLang && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 top-full mt-1 w-44 rounded-xl z-50 shadow-2xl"
                  style={{
                    background: "hsl(240 8% 10%)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    maxHeight: "240px",
                    overflowY: "auto",
                  }}>
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { setLangCode(l.code); setShowLang(false); if (srRef.current) srRef.current.lang = l.code; }}
                      className={`w-full text-left px-3 py-2 text-xs hover:bg-white/5 transition ${l.code === langCode ? "text-violet-400" : "text-white/60"}`}>
                      {l.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Close back to idle */}
          <button onClick={() => { setPhase("idle"); setMessages([]); setInterim(""); srRef.current?.abort(); synthRef.current?.cancel(); }}
            className="text-xs text-white/30 hover:text-white/60 transition px-1.5 py-1 rounded hover:bg-white/10">
            ✕
          </button>
        </div>
      </div>

      {/* Messages — this scrolls, NOT the page */}
      <div ref={msgsRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ minHeight: 0 }}>
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            )}
            <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-sm"
                : "text-white/90 rounded-bl-sm"
            }`} style={msg.role === "assistant"
              ? { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.06)" }
              : {}}>
              {msg.text}
              {msg.source === "voice" && <span className="ml-1 opacity-40 text-xs">🎤</span>}
            </div>
          </motion.div>
        ))}

        {/* Interim voice transcript */}
        {interim && (
          <div className="flex justify-end">
            <div className="px-3.5 py-2.5 rounded-2xl rounded-br-sm text-sm italic text-white/50 border border-violet-500/20"
              style={{ background: "rgba(139,92,246,0.1)" }}>
              {interim}…
            </div>
          </div>
        )}

        {/* Thinking indicator */}
        {phase === "processing" && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mr-2 flex-shrink-0">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
            </div>
          </div>
        )}
      </div>

      {/* Listening bar — fixed height slot */}
      <AnimatePresence>
        {phase === "listening" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 36, opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="flex-shrink-0 overflow-hidden flex items-center gap-2 px-4"
            style={{ background: "rgba(139,92,246,0.12)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.7 }}
              className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-xs text-white/50 flex-1 truncate">Listening in {currentLang.label}… speak now</span>
            <button onClick={stopListening} className="text-xs text-red-400 hover:text-red-300 transition flex-shrink-0">Stop</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input bar — fixed, never scrolls */}
      <div className="flex-shrink-0 p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        {micError && (
          <p className={`text-xs mb-2 text-center ${micError.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>
            {micError}
          </p>
        )}
        <div className="flex gap-2 items-center">
          {voiceSupported && (
            <button
              onClick={phase === "listening" ? stopListening : startListening}
              disabled={phase === "processing"}
              title={phase === "listening" ? "Stop listening" : `Speak in ${currentLang.label}`}
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 ${
                phase === "listening" ? "bg-red-500/80 hover:bg-red-500" : ""
              }`}
              style={phase !== "listening" ? { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" } : {}}
            >
              {phase === "listening"
                ? <MicOff className="w-3.5 h-3.5 text-white" />
                : <Mic className="w-3.5 h-3.5 text-violet-400" />}
            </button>
          )}

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder={voiceSupported ? `Ask or 🎤 speak in ${currentLang.label}…` : "Type your campaign idea…"}
            disabled={phase === "processing"}
            className="flex-1 px-3.5 py-2.5 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          />

          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || phase === "processing"}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
          >
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
