"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import {
  AppNotification,
  getNotifications,
  markRead,
  markAllRead,
  removeNotification,
  NOTIF_META,
} from "@/lib/notifications";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function NotificationsPage() {
  const { session } = useSession();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const reload = useCallback(() => {
    if (session?.userId) {
      setNotifications(getNotifications(session.userId));
    }
  }, [session?.userId]);

  useEffect(() => {
    reload();
    // Re-read when new notifications arrive in another tab/component
    const handler = () => reload();
    window.addEventListener("cinegen:notification", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cinegen:notification", handler);
      window.removeEventListener("storage", handler);
    };
  }, [reload]);

  const handleMarkRead = (id: string) => {
    if (!session) return;
    markRead(session.userId, id);
    reload();
  };

  const handleMarkAll = () => {
    if (!session) return;
    markAllRead(session.userId);
    reload();
  };

  const handleRemove = (id: string) => {
    if (!session) return;
    removeNotification(session.userId, id);
    reload();
  };

  const unread = notifications.filter((n) => !n.read).length;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl mb-3">Sign in to view notifications</h2>
          <Link href="/login" className="text-violet-400 hover:text-violet-300">Go to login →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display font-bold text-3xl mb-1">Notifications</h1>
          <p className="text-muted-foreground text-sm">
            {unread > 0 ? `${unread} unread` : "All caught up!"}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={handleMarkAll} className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium">
            Mark all read
          </button>
        )}
      </div>

      {/* Empty state */}
      {notifications.length === 0 && (
        <div className="text-center py-24">
          <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="font-semibold text-xl mb-2">No notifications yet</h3>
          <p className="text-muted-foreground text-sm">
            Actions like workflow requests, brief invites, messages and payments will appear here in real time.
          </p>
        </div>
      )}

      {/* List */}
      <AnimatePresence initial={false}>
        {notifications.map((notif) => {
          const meta = NOTIF_META[notif.type];
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
              className={`glass rounded-xl border mb-3 transition-all ${
                notif.read ? "border-white/5 opacity-60" : "border-white/10"
              }`}
            >
              <Link href={notif.link} onClick={() => handleMarkRead(notif.id)}>
                <div className="p-4 flex items-start gap-4 hover:bg-white/5 transition-colors rounded-xl">
                  {/* Emoji icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl bg-${meta.color}-500/10 border border-${meta.color}-500/20`}>
                    {meta.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <h3 className={`font-semibold text-sm ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-1">{notif.message}</p>
                    <span className="text-xs text-muted-foreground">{timeAgo(notif.createdAt)}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.preventDefault()}>
                    {!notif.read && (
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="p-1.5 rounded-lg hover:bg-green-500/20 text-muted-foreground hover:text-green-400 transition-all"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(notif.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
