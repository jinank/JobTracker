"use client";

import { signOut } from "next-auth/react";
import { SyncButton } from "./SyncButton";
import { NotificationBell } from "./NotificationBell";
import type { Notification } from "@/hooks/useNotifications";

interface HeaderProps {
  email?: string | null;
  activeCount: number;
  syncing: boolean;
  progress: string;
  paid?: boolean;
  onSync: () => void;
  lastSyncAt: number | null;
  notifications: Notification[];
  unreadCount: number;
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
}

export function Header({
  email,
  activeCount,
  syncing,
  progress,
  paid,
  onSync,
  lastSyncAt,
  notifications,
  unreadCount,
  onMarkAllRead,
  onClearNotifications,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm shrink-0">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 truncate">Rethinkjobs</h1>
              <p className="text-xs text-slate-500">
                {activeCount} active application{activeCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-2">
              {lastSyncAt && !syncing && (
                <span className="text-[11px] text-slate-400 hidden sm:inline whitespace-nowrap">
                  Last synced{" "}
                  {new Date(lastSyncAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }).toLowerCase()}
                </span>
              )}
              <SyncButton syncing={syncing} progress={progress} onSync={onSync} />
            </div>
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllRead={onMarkAllRead}
              onClear={onClearNotifications}
            />
            {!paid && (
              <a
                href="/pricing"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Upgrade
              </a>
            )}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              {email && (
                <span className="text-xs text-slate-500 hidden md:inline truncate max-w-[140px]">
                  {email}
                </span>
              )}
              <button
                onClick={() => signOut()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Sign out"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
