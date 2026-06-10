"use client";

import { SyncButton } from "./SyncButton";
import { NotificationBell } from "./NotificationBell";
import { SiteNavApp } from "./SiteNav";
import { AppHeaderActions } from "./AppHeaderActions";
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
    <SiteNavApp activeCount={activeCount}>
      <AppHeaderActions
        email={email}
        syncSlot={
          <SyncButton
            syncing={syncing}
            progress={progress}
            onSync={onSync}
            lastSyncAt={lastSyncAt}
          />
        }
        extra={
          <>
            <NotificationBell
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllRead={onMarkAllRead}
              onClear={onClearNotifications}
            />
            {!paid && (
              <a
                href="/pricing"
                className="hidden items-center gap-1.5 rounded-lg bg-gradient-to-r from-scale-purple to-violet-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-scale-purple-dark hover:to-violet-700 sm:inline-flex"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Upgrade
              </a>
            )}
          </>
        }
      />
    </SiteNavApp>
  );
}
