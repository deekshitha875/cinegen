/**
 * Real notification system using localStorage.
 * Notifications are keyed per user ID so each user sees their own.
 * Any action in the app (request workflow, post brief, accept proposal, 
 * send message, make payment) calls pushNotification() — it immediately
 * shows up when the target user opens /notifications.
 */

import { storage } from "./storage";

export type NotificationType =
  | "workflow_request"
  | "brief_invite"
  | "proposal_submitted"
  | "proposal_accepted"
  | "message"
  | "payment_received"
  | "review"
  | "match";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string;
  createdAt: string;
  read: boolean;
  fromName?: string;
}

function keyFor(userId: string) {
  return `cinegen_notifications_${userId}`;
}

/** Write a notification to a target user's store */
export function pushNotification(
  targetUserId: string,
  notif: Omit<AppNotification, "id" | "createdAt" | "read">
) {
  const existing = storage.read<AppNotification[]>(keyFor(targetUserId)) ?? [];
  const newNotif: AppNotification = {
    ...notif,
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  storage.write(keyFor(targetUserId), [newNotif, ...existing]);
  // Broadcast so any open notification page refreshes
  window.dispatchEvent(new CustomEvent("cinegen:notification", { detail: { targetUserId } }));
}

/** Read all notifications for the current user */
export function getNotifications(userId: string): AppNotification[] {
  return storage.read<AppNotification[]>(keyFor(userId)) ?? [];
}

/** Mark a single notification as read */
export function markRead(userId: string, notifId: string) {
  const existing = getNotifications(userId);
  storage.write(
    keyFor(userId),
    existing.map((n) => (n.id === notifId ? { ...n, read: true } : n))
  );
}

/** Mark all as read */
export function markAllRead(userId: string) {
  const existing = getNotifications(userId);
  storage.write(keyFor(userId), existing.map((n) => ({ ...n, read: true })));
}

/** Remove a notification */
export function removeNotification(userId: string, notifId: string) {
  const existing = getNotifications(userId);
  storage.write(keyFor(userId), existing.filter((n) => n.id !== notifId));
}

/** Count unread */
export function unreadCount(userId: string): number {
  return getNotifications(userId).filter((n) => !n.read).length;
}

// ─── Icon + colour config per type ────────────────────────────────────────────
export const NOTIF_META: Record<
  NotificationType,
  { emoji: string; color: string }
> = {
  workflow_request:    { emoji: "🎬", color: "violet" },
  brief_invite:        { emoji: "📋", color: "violet" },
  proposal_submitted:  { emoji: "📝", color: "cyan"   },
  proposal_accepted:   { emoji: "✅", color: "green"  },
  message:             { emoji: "💬", color: "cyan"   },
  payment_received:    { emoji: "💰", color: "green"  },
  review:              { emoji: "⭐", color: "amber"  },
  match:               { emoji: "🎯", color: "violet" },
};
