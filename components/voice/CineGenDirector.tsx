"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  ChevronDown,
  Loader2,
  Film,
  Keyboard,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { SUPPORTED_LANGUAGES, getLanguageByCode } from "@/lib/voice/languages";
import { getTranslations } from "@/lib/voice/translations";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { ConversationMessage, CampaignDraft, DirectorResponse } from "@/types";

// Re-use the same SR shim shape as CineGenAssistant (no global redeclaration)
type SR = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SREvent) => void) | null;
  onerror:  ((event: SRError) => void) | null;
  onend:    (() => void) | null;
  onstart:  (() => void) | null;
};
type SREvent = {
  results: { length: number; [i: number]: { isFinal: boolean; 0: { transcript: string } } };
  resultIndex: number;
};
type SRError = { error: string };

type VoiceState = "idle" | "listening" | "processing" | "speaking";

export default function CineGenDirector() {
  const { user } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  // Language
  const [langCode, setLangCode] = useState("en");
  const t = getTranslations(langCode);
  const lang = getLanguageByCode(langCode);

  // UI state
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [isTypingMode, setIsTypingMode] = useState(false);
  const [typedInput, setTypedInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Conversation
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CampaignDraft>({});
  const [isAwake, setIsAwake] = useState(false);

  // Refs
  const recognitionRef = useRef<SR | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Scroll to bottom on new messages ────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Init speech synthesis ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // ─── Speak text via TTS ───────────────────────────────────────────────────
  const speak = useCallback(
    (text: string) => {
      if (!synthRef.current || isMuted) return;
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang.voiceLang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Pick a matching voice if available
      const voices = synthRef.current.getVoices();
      const match = voices.find((v) => v.lang.startsWith(lang.voiceLang.split("-")[0]));
      if (match) utterance.voice = match;

      utterance.onstart = () => setVoiceState("speaking");
      utterance.onend = () => setVoiceState("idle");
      utterance.onerror = () => setVoiceState("idle");

      synthRef.current.speak(utterance);
    },
    [isMuted, lang.voiceLang]
  );

  // ─── Send message to API ──────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string, source: "voice" | "text" = "text") => {
      if (!text.trim()) return;

      const userMsg: ConversationMessage = {
        role: "user",
        text: text.trim(),
        timestamp: Date.now(),
        source,
      };

      setMessages((prev) => [...prev, userMsg]);
      setVoiceState("processing");

      try {
        const res = await fetch("/api/director/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg],
            conversationId,
            userId: user?.id || null,
          }),
        });

        if (res.status === 429) {
          const data = await res.json();
          toast.error(t.rateLimit);
          setVoiceState("idle");
          return;
        }

        if (!res.ok) throw new Error(`API error ${res.status}`);

        const data: DirectorResponse = await res.json();

        const assistantMsg: ConversationMessage = {
          role: "assistant",
          text: data.reply,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        if (data.campaignDraft) {
          setDraft((prev) => ({ ...prev, ...data.campaignDraft }));
        }

        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId);
        }

        // Handle actions
        if (data.action === "open_discovery") {
          toast.info("Opening creator discovery…");
          setTimeout(() => (window.location.href = "/creators"), 1500);
        } else if (data.action === "prepare_brief") {
          toast.info("Preparing your brief…");
          setTimeout(() => (window.location.href = "/briefs/new"), 1500);
        }

        // TTS response
        if (!isMuted) {
          speak(data.reply);
        }

        setVoiceState("idle");
      } catch (err) {
        console.error("sendMessage error:", err);
        toast.error(t.errorApi);
        setVoiceState("idle");
      }
    },
    [messages, conversationId, user?.id, t, isMuted, speak]
  );

  // ─── Init conversation ────────────────────────────────────────────────────
  const initConversation = useCallback(async () => {
    if (user?.id) {
      try {
        const res = await fetch("/api/director/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, title: "New Campaign Brief" }),
        });
        const data = await res.json();
        if (data.conversation?.id) {
          setConversationId(data.conversation.id);
        }
      } catch {
        // Non-fatal, continue without persisting
      }
    }

    const greeting: ConversationMessage = {
      role: "assistant",
      text: t.greeting,
      timestamp: Date.now(),
    };
    setMessages([greeting]);
    speak(t.greeting);
  }, [user?.id, t.greeting, speak]);

  // ─── Enable voice assistant ───────────────────────────────────────────────
  const enableVoice = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      toast.error(t.errorMic);
      setIsTypingMode(true);
      return;
    }

    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRec) {
      toast.warning("Voice not supported in this browser. Using typing mode.");
      setIsTypingMode(true);
      setVoiceEnabled(true);
      await initConversation();
      return;
    }

    setVoiceEnabled(true);
    await initConversation();

    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = lang.voiceLang;

    recognition.onresult = (event: SREvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim();

          if (!isAwake) {
            // Check for wake word
            if (transcript.toLowerCase().includes("hey cinegen")) {
              setIsAwake(true);
              setVoiceState("listening");
              speak("I'm listening! What's your campaign idea?");
            }
          } else {
            // Process command
            if (
              transcript.toLowerCase().includes("stop") ||
              transcript.toLowerCase().includes("cancel")
            ) {
              setIsAwake(false);
              setVoiceState("idle");
            } else {
              sendMessage(transcript, "voice");
              setIsAwake(false);
            }
          }
        }
      }
    };

    recognition.onerror = (event: SRError) => {
      if (event.error === "not-allowed") {
        toast.error(t.errorMic);
        setVoiceEnabled(false);
      }
    };

    recognition.onstart = () => {};

    recognition.onend = () => {
      // Auto-restart for continuous listening
      if (voiceEnabled) {
        try {
          recognition.start();
        } catch {
          // Already started
        }
      }
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      // ignore
    }
  }, [lang.voiceLang, t.errorMic, isAwake, voiceEnabled, initConversation, speak, sendMessage]);

  // ─── Cleanup on unmount ───────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      synthRef.current?.cancel();
    };
  }, []);

  // ─── Handle typing mode submit ────────────────────────────────────────────
  const handleTypedSubmit = async () => {
    if (!typedInput.trim()) return;
    const text = typedInput;
    setTypedInput("");

    if (!voiceEnabled) {
      setVoiceEnabled(true);
      await initConversation();
    }

    sendMessage(text, "text");
  };

  // ─── Pulse animation for voice orb ───────────────────────────────────────
  const orbVariants = {
    idle: { scale: 1 },
    listening: { scale: [1, 1.15, 1], transition: { repeat: Infinity, duration: 1.2 } },
    processing: { scale: [1, 0.95, 1], transition: { repeat: Infinity, duration: 0.8 } },
    speaking: { scale: [1, 1.08, 1], transition: { repeat: Infinity, duration: 0.6 } },
  };

  const orbColor = {
    idle: "from-violet-600 to-purple-800",
    listening: "from-emerald-500 to-teal-600",
    processing: "from-amber-500 to-orange-600",
    speaking: "from-blue-500 to-cyan-600",
  };

  // ─── Draft summary panel ──────────────────────────────────────────────────
  const hasDraft = Object.values(draft).some((v) =>
    Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== ""
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Voice Director</h1>
            <p className="text-xs text-white/40">Powered by Gemini AI</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition text-sm"
            >
              <span>{lang.nativeName}</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </button>

            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-[#141420] border border-white/10 shadow-2xl z-50 overflow-hidden"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLangCode(l.code);
                        setShowLangMenu(false);
                        if (recognitionRef.current) {
                          recognitionRef.current.lang = l.voiceLang;
                        }
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition flex justify-between items-center ${
                        l.code === langCode ? "text-violet-400" : "text-white/70"
                      }`}
                    >
                      <span>{l.name}</span>
                      <span className="text-xs opacity-50">{l.nativeName}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mute toggle */}
          <button
            onClick={() => setIsMuted((p) => !p)}
            className="p-2 rounded-lg hover:bg-white/10 transition"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white/40" />
            ) : (
              <Volume2 className="w-4 h-4 text-white/60" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main conversation area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {!voiceEnabled && messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-8 text-center">
                <motion.div
                  animate={prefersReducedMotion ? {} : { scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className={`w-28 h-28 rounded-full bg-gradient-to-br ${orbColor.idle} flex items-center justify-center shadow-2xl shadow-violet-900/40`}
                >
                  <Mic className="w-10 h-10 text-white" />
                </motion.div>

                <div>
                  <h2 className="text-2xl font-semibold mb-2">CineGen Voice Director</h2>
                  <p className="text-white/50 text-sm max-w-xs mx-auto">
                    Create your video campaign brief using your voice or keyboard — in 10 languages.
                  </p>
                </div>

                <div className="flex flex-col gap-3 w-full max-w-sm">
                  <button
                    onClick={enableVoice}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 transition font-medium text-sm shadow-lg shadow-violet-900/30"
                  >
                    <Mic className="w-4 h-4" />
                    {t.enableVoice}
                  </button>

                  <button
                    onClick={() => {
                      setIsTypingMode(true);
                      setVoiceEnabled(true);
                      initConversation();
                    }}
                    className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm text-white/70"
                  >
                    <Keyboard className="w-4 h-4" />
                    {t.typeInstead}
                  </button>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <Film className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-violet-600/80 text-white rounded-br-sm"
                      : "bg-white/8 text-white/90 rounded-bl-sm border border-white/5"
                  }`}
                >
                  {msg.text}
                  {msg.source === "voice" && (
                    <span className="ml-2 text-xs opacity-40">🎤</span>
                  )}
                </div>
              </motion.div>
            ))}

            {voiceState === "processing" && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center mr-2 flex-shrink-0">
                  <Film className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-white/8 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Voice orb status bar */}
          {voiceEnabled && !isTypingMode && (
            <div className="px-6 py-3 border-t border-white/5 flex items-center justify-center gap-4">
              <motion.div
                variants={prefersReducedMotion ? {} : orbVariants}
                animate={voiceState}
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${orbColor[voiceState]} flex items-center justify-center shadow-lg cursor-pointer`}
                onClick={() => {
                  if (voiceState === "speaking") {
                    synthRef.current?.cancel();
                    setVoiceState("idle");
                  }
                }}
              >
                {voiceState === "processing" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : voiceState === "speaking" ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <Mic className={`w-5 h-5 ${isAwake ? "text-emerald-200" : "text-white"}`} />
                )}
              </motion.div>

              <div className="text-xs text-white/40">
                {voiceState === "idle" && !isAwake && t.listeningHint}
                {voiceState === "idle" && isAwake && "Listening… speak now"}
                {voiceState === "processing" && t.thinking}
                {voiceState === "speaking" && "Speaking… (tap to stop)"}
              </div>

              <button
                onClick={() => setIsTypingMode(true)}
                className="text-xs text-white/30 hover:text-white/60 transition flex items-center gap-1"
              >
                <Keyboard className="w-3 h-3" />
                {t.typeInstead}
              </button>
            </div>
          )}

          {/* Input area */}
          {(isTypingMode || voiceEnabled) && (
            <div className="px-6 py-4 border-t border-white/10 flex gap-3">
              {isTypingMode && !prefersReducedMotion && (
                <button
                  onClick={() => setIsTypingMode(false)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition flex-shrink-0"
                  title={t.useVoice}
                >
                  <Mic className="w-4 h-4 text-violet-400" />
                </button>
              )}

              <input
                ref={inputRef}
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleTypedSubmit()}
                placeholder={t.placeholder}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 transition"
                disabled={voiceState === "processing"}
                autoFocus={isTypingMode}
              />

              <button
                onClick={handleTypedSubmit}
                disabled={!typedInput.trim() || voiceState === "processing"}
                className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Draft sidebar */}
        <AnimatePresence>
          {hasDraft && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-white/10 overflow-hidden flex-shrink-0"
            >
              <div className="w-[280px] h-full p-4 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/70">Campaign Draft</h3>
                  <button
                    onClick={() => setDraft({})}
                    className="p-1 hover:bg-white/10 rounded transition"
                  >
                    <X className="w-3.5 h-3.5 text-white/30" />
                  </button>
                </div>

                <div className="space-y-3">
                  {draft.campaignTitle && (
                    <DraftField label="Title" value={draft.campaignTitle} />
                  )}
                  {draft.objective && (
                    <DraftField label="Objective" value={draft.objective} />
                  )}
                  {draft.contentType && (
                    <DraftField label="Content Type" value={draft.contentType} />
                  )}
                  {draft.style && (
                    <DraftField label="Style" value={draft.style} />
                  )}
                  {draft.aspectRatios && draft.aspectRatios.length > 0 && (
                    <DraftField label="Aspect Ratios" value={draft.aspectRatios.join(", ")} />
                  )}
                  {draft.durationSeconds && (
                    <DraftField label="Duration" value={`${draft.durationSeconds}s`} />
                  )}
                  {draft.quantity && (
                    <DraftField label="Quantity" value={String(draft.quantity)} />
                  )}
                  {draft.budgetMin && draft.budgetMax && (
                    <DraftField
                      label="Budget"
                      value={`$${draft.budgetMin.toLocaleString()} – $${draft.budgetMax.toLocaleString()}`}
                    />
                  )}
                  {draft.deadline && (
                    <DraftField label="Deadline" value={draft.deadline} />
                  )}
                  {draft.toolsPreferred && draft.toolsPreferred.length > 0 && (
                    <DraftField label="Tools" value={draft.toolsPreferred.join(", ")} />
                  )}
                </div>

                {draft.campaignTitle && (
                  <a
                    href="/briefs/new"
                    className="mt-6 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-violet-600/80 hover:bg-violet-600 transition text-sm font-medium"
                  >
                    Create Brief →
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function DraftField({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/4 rounded-lg p-3 border border-white/5">
      <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">{label}</p>
      <p className="text-sm text-white/80">{value}</p>
    </div>
  );
}
