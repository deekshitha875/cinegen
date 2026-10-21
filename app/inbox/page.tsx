"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Thread = {
  id: string;
  brand_id: string;
  creator_id: string;
  last_message: string;
  last_message_at: string;
  other_name: string;
  brief_title?: string;
};

type Message = {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

// Demo threads for localStorage-based sessions
const DEMO_THREADS: Thread[] = [
  {
    id: "thread-001",
    brand_id: "brand-001",
    creator_id: "creator-001",
    last_message: "Hi Aryan, I love your work on the Luminary campaign. Are you available for our new project?",
    last_message_at: new Date(Date.now() - 3600000).toISOString(),
    other_name: "Aryan Kapoor",
    brief_title: "Nexus Energy Drink — Urban Warriors Launch",
  },
  {
    id: "thread-002",
    brand_id: "brand-001",
    creator_id: "creator-005",
    last_message: "The match score looks great. Can we discuss the timeline?",
    last_message_at: new Date(Date.now() - 7200000).toISOString(),
    other_name: "Marcus Chen",
    brief_title: "FreshLeaf Organic — Brand Film",
  },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
  "thread-001": [
    { id: "m1", thread_id: "thread-001", sender_id: "brand-001", content: "Hi Aryan, I love your work on the Luminary campaign. Are you available for our new project?", created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: "m2", thread_id: "thread-001", sender_id: "creator-001", content: "Thanks! Yes, I'm available starting next week. What's the brief?", created_at: new Date(Date.now() - 3000000).toISOString() },
    { id: "m3", thread_id: "thread-001", sender_id: "brand-001", content: "It's a 30-second cinematic ad for an energy drink. Budget is $6,500. Would love to work with you!", created_at: new Date(Date.now() - 2400000).toISOString() },
    { id: "m4", thread_id: "thread-001", sender_id: "creator-001", content: "Sounds perfect. I'll use Runway Gen-3 for the main shots and ComfyUI for VFX. Can send a full proposal in 2 hours.", created_at: new Date(Date.now() - 1800000).toISOString() },
  ],
  "thread-002": [
    { id: "m5", thread_id: "thread-002", sender_id: "creator-005", content: "I saw your brief for the brand film. My VFX pipeline would be perfect for this.", created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: "m6", thread_id: "thread-002", sender_id: "brand-001", content: "The match score looks great. Can we discuss the timeline?", created_at: new Date(Date.now() - 5400000).toISOString() },
  ],
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function InboxPage() {
  const { session } = useSession();
  const [threads, setThreads] = useState<Thread[]>(DEMO_THREADS);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedThread) {
      setMessages(DEMO_MESSAGES[selectedThread.id] || []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [selectedThread]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThread || !session) return;
    setSending(true);

    const msg: Message = {
      id: `msg-${Date.now()}`,
      thread_id: selectedThread.id,
      sender_id: session.userId,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    };

    // Update local state
    setMessages((prev) => [...prev, msg]);
    DEMO_MESSAGES[selectedThread.id] = [...(DEMO_MESSAGES[selectedThread.id] || []), msg];

    // Update thread last message
    setThreads((prev) => prev.map((t) =>
      t.id === selectedThread.id
        ? { ...t, last_message: newMessage.trim(), last_message_at: new Date().toISOString() }
        : t
    ));

    setNewMessage("");
    setSending(false);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    // Smart AI reply using Gemini
    const otherName = selectedThread.other_name;
    setTyping(true);
    const isUserBrand = session.role === "brand";
    const otherRole = isUserBrand ? "AI creator" : "brand manager";

    setTimeout(async () => {
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{
              role: "user",
              content: `You are ${otherName}, a ${otherRole} on CineGen marketplace. 
Reply naturally and briefly (1-2 sentences max) to this message from a ${isUserBrand ? "brand" : "creator"}:
"${msg.content}"
${selectedThread.brief_title ? `Context: discussing the brief "${selectedThread.brief_title}"` : ""}
Be professional, friendly, and specific to what they said. Don't start with "I".`,
            }],
          }),
        });
        const data = await res.json();
        const autoReply: Message = {
          id: `auto-${Date.now()}`,
          thread_id: selectedThread.id,
          sender_id: isUserBrand ? selectedThread.creator_id : selectedThread.brand_id,
          content: data.reply,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, autoReply]);
        DEMO_MESSAGES[selectedThread.id] = [...(DEMO_MESSAGES[selectedThread.id] || []), autoReply];
        setTyping(false);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } catch {
        setTyping(false);
        const autoReply: Message = {
          id: `auto-${Date.now()}`,
          thread_id: selectedThread.id,
          sender_id: isUserBrand ? selectedThread.creator_id : selectedThread.brand_id,
          content: "Thanks for reaching out! I'll get back to you shortly.",
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, autoReply]);
      }
    }, 1500);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl mb-3">Sign in to access your inbox</h2>
          <Link href="/login" className="text-violet-400 hover:text-violet-300">Go to login →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-2xl">Inbox</h1>
          <p className="text-muted-foreground text-sm">Messages with brands and creators</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        {/* Thread list */}
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <h2 className="font-semibold text-sm">Conversations</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-57px)]">
            {threads.map((thread) => (
              <button key={thread.id} onClick={() => setSelectedThread(thread)}
                className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${selectedThread?.id === thread.id ? "bg-violet-500/10 border-l-2 border-l-violet-500" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {thread.other_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-sm truncate">{thread.other_name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(thread.last_message_at)}</span>
                    </div>
                    {thread.brief_title && (
                      <div className="text-xs text-violet-400 mb-1 truncate">{thread.brief_title}</div>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2">{thread.last_message}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message area */}
        <div className="md:col-span-2 glass rounded-2xl border border-white/10 flex flex-col overflow-hidden">
          {selectedThread ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                  {selectedThread.other_name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{selectedThread.other_name}</div>
                  {selectedThread.brief_title && (
                    <div className="text-xs text-violet-400">{selectedThread.brief_title}</div>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.sender_id === session.userId || msg.sender_id === session.brandId || msg.sender_id === session.creatorId;
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-sm"
                          : "bg-white/10 text-foreground rounded-bl-sm"
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? "text-violet-200" : "text-muted-foreground"}`}>
                          {timeAgo(msg.created_at)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />

                {/* Typing indicator */}
                {typing && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 mt-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {selectedThread?.other_name.charAt(0)}
                    </div>
                    <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/5 flex items-center gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{selectedThread?.other_name.split(' ')[0]} is typing...</span>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/5">
                <div className="flex gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all placeholder:text-muted-foreground"
                  />
                  <button onClick={sendMessage} disabled={sending || !newMessage.trim()}
                    className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl hover:from-violet-500 hover:to-violet-400 transition-all disabled:opacity-50">
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-1">Select a conversation</h3>
                <p className="text-sm text-muted-foreground">Choose a thread from the left to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
