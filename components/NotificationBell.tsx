"use client";

import { useState, useRef, useEffect } from "react";
import type { Notification } from "@/hooks/useNotifications";

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onClear: () => void;
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  APPLIED: { label: "Applied", color: "text-blue-600 bg-blue-50", icon: "📨" },
  ASSESSMENT: { label: "Assessment", color: "text-amber-600 bg-amber-50", icon: "📝" },
  INTERVIEWING: { label: "Interview", color: "text-purple-600 bg-purple-50", icon: "🎤" },
  OFFER: { label: "Offer", color: "text-green-600 bg-green-50", icon: "🎉" },
  REJECTED: { label: "Rejected", color: "text-red-600 bg-red-50", icon: "❌" },
  GHOSTED: { label: "Ghosted", color: "text-slate-500 bg-slate-50", icon: "👻" },
  WITHDRAWN: { label: "Withdrawn", color: "text-slate-500 bg-slate-50", icon: "🚪" },
};

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell({
  notifications,
  unreadCount,
  onMarkAllRead,
  onClear,
}: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    if (!open && unreadCount > 0) {
      onMarkAllRead();
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleToggle}
        className="relative p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        title="Notifications"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1 ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={onClear}
                className="text-[11px] text-slate-400 hover:text-red-500 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <div className="text-2xl mb-2">🔔</div>
                <p className="text-sm text-slate-400">No notifications yet</p>
                <p className="text-xs text-slate-300 mt-1">
                  Updates will appear here after syncing
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const info = STATUS_LABELS[n.status] ?? {
                  label: n.status,
                  color: "text-slate-500 bg-slate-50",
                  icon: "📋",
                };
                return (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${
                      !n.read ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">{info.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 font-medium truncate">
                          {n.company}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{n.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${info.color}`}
                          >
                            {info.label}
                          </span>
                          <span className="text-[10px] text-slate-300">
                            {formatTimeAgo(n.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
