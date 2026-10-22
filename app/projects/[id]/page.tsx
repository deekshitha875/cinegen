"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Star, Send, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

type Project = {
  id: string;
  briefTitle: string;
  brandId: string;
  creatorId: string;
  creatorName: string;
  brandName: string;
  status: "active" | "completed";
  startedAt: string;
  completedAt?: string;
  review?: { rating: number; comment: string };
};

type Message = { id: string; senderId: string; content: string; createdAt: string };

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { session } = useSession();
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [completing, setCompleting] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (params.id && session) {
      const proj = storage.read<Project>(`project_${params.id}`);
      if (proj) {
        setProject(proj);
        const msgs = storage.read<Message[]>(`project_messages_${params.id}`) ?? [];
        setMessages(msgs);
      }
    }
  }, [params.id, session]);

  const sendMessage = () => {
    if (!newMessage.trim() || !project || !session) return;
    const msg: Message = {
      id: `msg-${Date.now()}`,
      senderId: session.userId,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...messages, msg];
    setMessages(updated);
    storage.write(`project_messages_${params.id}`, updated);
    setNewMessage("");
  };

  const markComplete = async () => {
    if (!project) return;
    setCompleting(true);
    await new Promise((r) => setTimeout(r, 500));
    const updated = { ...project, status: "completed" as const, completedAt: new Date().toISOString() };
    setProject(updated);
    storage.write(`project_${params.id}`, updated);
    setCompleting(false);
    toast.success("Project marked as complete!");
  };

  const submitReview = async () => {
    if (!project) return;
    setSubmittingReview(true);
    await new Promise((r) => setTimeout(r, 500));
    const updated = { ...project, review: { rating, comment: reviewComment.trim() } };
    setProject(updated);
    storage.write(`project_${params.id}`, updated);
    setSubmittingReview(false);
    toast.success("Review submitted! The creator will see it on their profile.");
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground mr-3">Sign in to view projects.</p>
        <Link href="/login" className="text-violet-400">Login →</Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  const isBrand = session.role === "brand";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display font-bold text-2xl">{project.briefTitle}</h1>
          <p className="text-muted-foreground text-sm">
            {isBrand ? `Working with ${project.creatorName}` : `Working with ${project.brandName}`}
          </p>
        </div>
        {project.status === "completed" && (
          <span className="ml-auto px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs border border-green-500/20 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Messages */}
        <div className="glass rounded-2xl border border-white/10 p-6">
          <h2 className="font-semibold mb-4">Project Messages</h2>
          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
            {messages.map((msg) => {
              const isMe = msg.senderId === session.userId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMe ? "bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-br-sm" : "bg-white/10 rounded-bl-sm"
                  }`}>
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${isMe ? "text-violet-200" : "text-muted-foreground"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {project.status === "active" && (
            <div className="flex gap-2">
              <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all" />
              <button onClick={sendMessage} disabled={!newMessage.trim()}
                className="px-4 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-all disabled:opacity-40">
                <Send className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        {isBrand && project.status === "active" && (
          <div className="space-y-3">
            {/* Payment Button */}
            <Link
              href={`/payment?projectId=${params.id}&creator=${encodeURIComponent(project.creatorName)}&title=${encodeURIComponent(project.briefTitle)}&amount=12500`}
              className="block w-full text-center py-4 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-2xl font-semibold hover:opacity-90 transition-all shadow-xl shadow-violet-500/30">
              💳 Pay Milestone 1 — ₹13,750
            </Link>
            
            <button onClick={markComplete} disabled={completing}
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-semibold hover:from-green-500 hover:to-green-400 transition-all disabled:opacity-50">
              {completing ? <><Loader2 className="w-5 h-5 animate-spin" /> Marking complete...</> : <><CheckCircle className="w-5 h-5" /> Mark Project as Complete</>}
            </button>
          </div>
        )}

        {/* Review */}
        {isBrand && project.status === "completed" && !project.review && (
          <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" /> Leave a Review
            </h2>
            <div>
              <label className="block text-xs text-muted-foreground mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(n)}
                    className={`w-10 h-10 rounded-lg border transition-all ${rating >= n ? "bg-amber-500/20 border-amber-500/40 text-amber-300" : "bg-white/5 border-white/10 text-muted-foreground hover:text-foreground"}`}>
                    <Star className="w-5 h-5 mx-auto" fill={rating >= n ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5">Comment</label>
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} rows={3}
                placeholder="Share your experience working with this creator..."
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 transition-all resize-none" />
            </div>
            <button onClick={submitReview} disabled={submittingReview || !reviewComment.trim()}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-violet-500 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-violet-400 transition-all disabled:opacity-50">
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}

        {project.review && (
          <div className="glass rounded-2xl border border-white/10 p-6">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" /> Review Submitted
            </h2>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className="w-4 h-4 text-amber-400" fill={n <= project.review!.rating ? "currentColor" : "none"} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{project.review.comment}</p>
          </div>
        )}
      </div>
    </div>
  );
}
