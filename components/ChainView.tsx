"use client";

import { useState } from "react";
import Link from "next/link";
import type { Chain, ChainStatus } from "@/types/chain";
import { STATUS_ORDER } from "@/types/chain";
import type { AppEvent, EventType } from "@/types/event";
import { StatusBadge } from "./StatusBadge";
import { useChainEvents } from "@/hooks/useChains";
import { formatRelativeTime, formatDeadline } from "@/lib/utils";

const EVENT_ICONS: Record<EventType, { icon: string; color: string }> = {
  APPLICATION_RECEIVED: { icon: "📨", color: "bg-blue-100" },
  INTERVIEW_INVITE: { icon: "🎤", color: "bg-amber-100" },
  ASSESSMENT_INVITE: { icon: "📝", color: "bg-violet-100" },
  OFFER: { icon: "🎉", color: "bg-emerald-100" },
  REJECTION: { icon: "✖", color: "bg-red-100" },
  DEADLINE: { icon: "⏰", color: "bg-orange-100" },
  FOLLOW_UP: { icon: "↩", color: "bg-slate-100" },
  OTHER: { icon: "📧", color: "bg-gray-100" },
};

const STATUS_LABELS: Record<ChainStatus, string> = {
  APPLIED: "Applied",
  ASSESSMENT: "Assessment",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
  GHOSTED: "Ghosted",
  WITHDRAWN: "Withdrawn",
};

function EventTimeline({ events }: { events: AppEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-slate-400 py-6 text-center">
        No events recorded yet.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {events.map((event, idx) => {
        const config = EVENT_ICONS[event.event_type] ?? EVENT_ICONS.OTHER;
        const isLast = idx === events.length - 1;

        return (
          <div key={event.event_id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-xl ${config.color} flex items-center justify-center text-sm border border-white shadow-sm`}
              >
                {config.icon}
              </div>
              {!isLast && <div className="w-0.5 flex-1 min-h-[24px] bg-slate-200 my-1" />}
            </div>
            <div className="pb-6 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-800">
                  {event.event_type.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-slate-400 shrink-0">
                  {formatRelativeTime(event.event_time)}
                </span>
              </div>
              {event.evidence && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {event.evidence}
                </p>
              )}
              {event.due_at && (
                <p className="text-xs text-orange-600 mt-1 font-medium">
                  Due: {formatDeadline(event.due_at)}
                </p>
              )}
              {event.extracted_entities?.recruiter_name && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Recruiter: {event.extracted_entities.recruiter_name}
                </p>
              )}
              {event.extracted_entities?.links &&
                event.extracted_entities.links.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {event.extracted_entities.links.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 underline truncate max-w-[200px]"
                      >
                        {new URL(link).hostname}
                      </a>
                    ))}
                  </div>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ChainView({
  chain,
  onBack,
  onUpdated,
  onRefresh,
}: {
  chain: Chain;
  onBack: () => void;
  /** Called after edits that should close the detail view (edit / delete). */
  onUpdated: () => void;
  /** Called after background updates that should keep the view open (e.g. adding a note). */
  onRefresh?: () => void;
}) {
  const { events, loading } = useChainEvents(chain.chain_id);
  const [editing, setEditing] = useState(false);
  const [editCompany, setEditCompany] = useState(chain.canonical_company);
  const [editRole, setEditRole] = useState(chain.role_title);
  const [editStatus, setEditStatus] = useState<ChainStatus>(chain.status);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteError, setNoteError] = useState<string | null>(null);

  const handleAddNote = async () => {
    const line = noteDraft.trim();
    if (!line) return;
    setNoteSaving(true);
    setNoteError(null);
    try {
      const res = await fetch("/api/chains", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chain_id: chain.chain_id,
          append_note: line,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? "Could not save note");
      }
      setNoteDraft("");
      if (onRefresh) onRefresh();
      else onUpdated();
    } catch (err) {
      setNoteError(err instanceof Error ? err.message : "Could not save note");
    } finally {
      setNoteSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/chains", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chain_id: chain.chain_id,
          canonical_company: editCompany.trim() || chain.canonical_company,
          role_title: editRole.trim(),
          status: editStatus,
        }),
      });
      setEditing(false);
      onUpdated();
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditCompany(chain.canonical_company);
    setEditRole(chain.role_title);
    setEditStatus(chain.status);
    setEditing(false);
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await fetch(`/api/chains?chainId=${chain.chain_id}`, {
        method: "DELETE",
      });
      onUpdated();
      onBack();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-card overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <div className="flex items-center gap-2">
            {!editing && (
              <>
                <Link
                  href={`/reach-out?company=${encodeURIComponent(chain.canonical_company)}&chainId=${chain.chain_id}${chain.role_title ? `&role=${encodeURIComponent(chain.role_title)}` : ""}`}
                  className="text-xs px-3.5 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors font-medium"
                >
                  Reach Out
                </Link>
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs px-3.5 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs px-3.5 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors font-medium"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-red-700 mb-3">
              Remove &ldquo;{chain.canonical_company}&rdquo; from your tracked
              applications? This cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Deleting..." : "Yes, delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Company
              </label>
              <input
                type="text"
                value={editCompany}
                onChange={(e) => setEditCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Role
              </label>
              <input
                type="text"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUS_ORDER.map((s) => (
                  <button
                    key={s}
                    onClick={() => setEditStatus(s)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                      editStatus === s
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {chain.canonical_company}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {chain.role_title || "Unknown role"}
              </p>
            </div>
            <StatusBadge status={chain.status} />
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Timeline</h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <EventTimeline events={events} />
        )}

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-slate-800">Your notes</h3>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Private to you
            </span>
          </div>

          {chain.user_notes?.trim() ? (
            <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans leading-relaxed bg-slate-50 rounded-xl px-3.5 py-3 border border-slate-100 mb-3">
              {chain.user_notes.trim()}
            </pre>
          ) : (
            <p className="text-xs text-slate-400 mb-3">
              No notes yet. Add reminders, recruiter details, or prep links below.
            </p>
          )}

          <div className="rounded-xl border border-slate-200 bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/20 transition-all">
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                  e.preventDefault();
                  if (!noteSaving && noteDraft.trim()) void handleAddNote();
                }
              }}
              placeholder="Add a note (e.g. 'Recruiter asked about availability Thu 2pm')"
              rows={3}
              disabled={noteSaving}
              className="w-full resize-y rounded-xl px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent disabled:opacity-60"
            />
            <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-slate-100 bg-slate-50/60 rounded-b-xl">
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Notes are stamped with today&apos;s date. <kbd className="px-1 py-0.5 rounded border border-slate-200 bg-white text-[10px]">⌘/Ctrl</kbd>+<kbd className="px-1 py-0.5 rounded border border-slate-200 bg-white text-[10px]">Enter</kbd> to save.
              </p>
              <button
                type="button"
                onClick={handleAddNote}
                disabled={noteSaving || !noteDraft.trim()}
                className="ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {noteSaving ? "Saving..." : "Add note"}
              </button>
            </div>
          </div>
          {noteError && (
            <p className="mt-2 text-xs text-red-600">{noteError}</p>
          )}
        </div>
      </div>
    </div>
  );
}
