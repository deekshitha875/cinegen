"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, X, Briefcase, MessageSquare, Star, DollarSign, UserPlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";

type Notification = {
  id: string;
  type: "brief_invite" | "message" | "review" | "payment" | "match";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
  icon: any;
  color: string;
};

const BRAND_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "match",
    title: "New Match Found",
    message: "Aryan Kapoor is a 94% match for your Nexus Energy Drink brief",
    time: "2m ago",
    read: false,
    link: "/briefs/brief-nexus-001",
    icon: Star,
    color: "violet",
  },
  {
    id: "n2",
    type: "message",
    title: "New Message from Marcus Chen",
    message: "Thanks! Yes, I'm available starting next week...",
    time: "15m ago",
    read: false,
    link: "/inbox",
    icon: MessageSquare,
    color: "cyan",
  },
  {
    id: "n3",
    type: "brief_invite",
    title: "Lena Volkov Submitted Proposal",
    message: "Check out the proposal for your FreshLeaf Organic brand film",
    time: "1h ago",
    read: false,
    link: "/briefs/brief-freshleaf-002",
    icon: Briefcase,
    color: "green",
  },
];

const CREATOR_NOTIFICATIONS: Notification[] = [
  {
    id: "c1",
    type: "brief_invite",
    title: "You're Invited to a Brief",
    message: "Arjun Mehta invited you to propose for: Nexus Energy Drink Campaign",
    time: "5m ago",
    read: false,
    link: "/briefs/brief-nexus-001",
    icon: Briefcase,
    color: "violet",
  },
  {
    id: "c2",
    type: "message",
    title: "New Message from Arjun Mehta",
    message: "Love your portfolio! Are you available for...",
    time: "20m ago",
    read: false,
    link: "/inbox",
    icon: MessageSquare,
    color: "cyan",
  },
  {
    id: "c3",
    type: "payment",
    title: "Payment Received",
    message: "₹13,750 received for Luminary Tech Campaign milestone",
    time: "2h ago",
    read: true,
    link: "/dashboard",
    icon: DollarSign,
    color: "green",
  },
  {
    id: "c4",
    type: "review",
    title: "New 5-Star Review",
    message: "Arjun Mehta left you a review: 'Incredible work, exceeded expectations!'",
    time: "1d ago",
    read: true,
    link: "/dashboard",
    icon: Star,
    color: "amber",
  },
];

export default function NotificationsPage() {
  const { session } = useSession();
  const isBrand = session?.role === "brand";
  
  const [notifications, setNotifications] = useState<Notification[]>(
    isBrand ? BRAND_NOTIFICATIONS : CREATOR_NOTIFICATIONS
  );

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="font-semibold text-xl mb-2">No notifications yet</h3>
          <p className="text-muted-foreground">When you get updates, they'll appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`glass rounded-xl border transition-all ${
                notif.read ? "border-white/5 opacity-60" : "border-white/10"
              }`}
            >
              <Link href={notif.link} onClick={() => markAsRead(notif.id)}>
                <div className="p-4 flex items-start gap-4 hover:bg-white/5 transition-colors rounded-xl">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-${notif.color}-500/20 border border-${notif.color}-500/30`}
                  >
                    <notif.icon className={`w-5 h-5 text-${notif.color}-400`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${notif.read ? "text-muted-foreground" : "text-foreground"}`}>
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{notif.message}</p>
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    {!notif.read && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          markAsRead(notif.id);
                        }}
                        className="p-1.5 rounded-lg hover:bg-green-500/20 text-muted-foreground hover:text-green-400 transition-all"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        remove(notif.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-all"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Brief Invite Special Callout */}
      {!isBrand && unreadCount > 0 && (
        <div className="mt-8 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 border border-violet-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Briefcase className="w-6 h-6 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-2">🎯 New Brief Invitations</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Brands invite you directly based on your profile match. Click the notification above to review the brief and submit a proposal.
              </p>
              <Link
                href="/briefs"
                className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 transition-colors font-medium"
              >
                View All Briefs →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
