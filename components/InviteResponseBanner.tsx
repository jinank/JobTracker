"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "rethinkjobs_invite_response_prompts";

type PromptKind = "assessment" | "interview" | "offer";

export type InvitePrompt = {
  promptId: string;
  chainId: string;
  company: string;
  role: string;
  kind: PromptKind;
  eventTime: number;
};

function loadAnswered(): Record<string, "yes" | "no" | "dismissed"> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    const out: Record<string, "yes" | "no" | "dismissed"> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (v === "yes" || v === "no" || v === "dismissed") out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

function saveAnswered(map: Record<string, "yes" | "no" | "dismissed">) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

function inviteLabel(kind: PromptKind): string {
  switch (kind) {
    case "assessment":
      return "assessment";
    case "interview":
      return "interview";
    case "offer":
      return "offer";
  }
}

function questionLine(p: InvitePrompt): string {
  const role = p.role.trim();
  const tail = role ? ` — ${role}` : "";
  const what = inviteLabel(p.kind);
  if (p.kind === "offer") {
    return `Did you respond about the ${what} from ${p.company}${tail}?`;
  }
  return `Did you respond to the ${what} invite from ${p.company}${tail}?`;
}

function noteForAnswer(
  p: InvitePrompt,
  answeredYes: boolean
): string {
  const role = p.role.trim();
  const ctx = role ? `${p.company} (${role})` : p.company;
  const what = inviteLabel(p.kind);
  if (answeredYes) {
    return `Responded to ${what}: yes (self-reported) — ${ctx}.`;
  }
  return `Responded to ${what}: not yet (self-reported) — ${ctx}.`;
}

export function InviteResponseBanner({
  chainsLoading,
  onChainsRefresh,
}: {
  chainsLoading: boolean;
  onChainsRefresh: () => void | Promise<void>;
}) {
  const [prompts, setPrompts] = useState<InvitePrompt[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [answered, setAnswered] = useState<Record<string, "yes" | "no" | "dismissed">>(
    {}
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    setAnswered(loadAnswered());
  }, []);

  const fetchPrompts = useCallback(async () => {
    try {
      const res = await fetch("/api/chains/response-prompts");
      const data = await res.json();
      if (!res.ok) {
        setFetchError(data.error || "Could not load reminders");
        setPrompts([]);
        return;
      }
      setFetchError(null);
      setPrompts((data.prompts ?? []) as InvitePrompt[]);
    } catch {
      setFetchError("Could not load reminders");
      setPrompts([]);
    }
  }, []);

  useEffect(() => {
    if (chainsLoading) return;
    fetchPrompts();
  }, [chainsLoading, fetchPrompts]);

  const pending = useMemo(() => {
    const map = answered;
    return prompts.filter((p) => !map[p.promptId]);
  }, [prompts, answered]);

  const current = pending[0] ?? null;

  const mark = useCallback(
    (promptId: string, v: "yes" | "no" | "dismissed") => {
      setAnswered((prev) => {
        const next = { ...prev, [promptId]: v };
        saveAnswered(next);
        return next;
      });
    },
    []
  );

  const handleYesNo = async (p: InvitePrompt, yes: boolean) => {
    setBusyId(p.promptId);
    setSaveError(null);
    try {
      const note = noteForAnswer(p, yes);
      const res = await fetch("/api/chains", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chain_id: p.chainId,
          append_note: note,
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        const msg = j.error || "Could not save note";
        const hint =
          typeof j.hint === "string" && j.hint.trim() ? `\n${j.hint.trim()}` : "";
        setSaveError(`${msg}${hint}`);
        return;
      }
      mark(p.promptId, yes ? "yes" : "no");
      await onChainsRefresh();
    } finally {
      setBusyId(null);
    }
  };

  const handleDismiss = (p: InvitePrompt) => {
    mark(p.promptId, "dismissed");
  };

  if ((fetchError || prompts.length === 0) && !current) {
    return null;
  }

  if (!current) return null;

  return (
    <div className="bg-amber-50 border border-amber-200/90 text-amber-950 rounded-xl px-4 py-3 mb-5 shadow-sm animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800/90 mb-1">
            Quick check-in
          </p>
          <p className="text-sm text-amber-950 leading-snug">
            {questionLine(current)}
          </p>
          {saveError && (
            <p className="text-xs text-red-700 mt-2 whitespace-pre-wrap leading-snug">
              {saveError}
            </p>
          )}
          {pending.length > 1 && (
            <p className="text-[11px] text-amber-800/70 mt-1.5">
              {pending.length - 1} more after this one
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            disabled={busyId === current.promptId}
            onClick={() => handleYesNo(current, true)}
            className="px-4 py-2 rounded-xl bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 disabled:opacity-50 transition-colors shadow-sm"
          >
            {busyId === current.promptId ? "Saving…" : "Yes"}
          </button>
          <button
            type="button"
            disabled={busyId === current.promptId}
            onClick={() => handleYesNo(current, false)}
            className="px-4 py-2 rounded-xl border border-amber-300 bg-white text-amber-900 text-xs font-semibold hover:bg-amber-100/80 disabled:opacity-50 transition-colors"
          >
            Not yet
          </button>
          <button
            type="button"
            disabled={busyId === current.promptId}
            onClick={() => handleDismiss(current)}
            className="px-3 py-2 rounded-xl text-amber-800/80 text-xs font-medium hover:text-amber-950 hover:underline disabled:opacity-50"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
