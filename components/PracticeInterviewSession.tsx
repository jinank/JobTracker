"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  COMPANY_BRAND_COLORS,
  INTERVIEW_TYPE_LABELS,
  openingInterviewerMessage,
  type PracticeInterview,
} from "@/lib/practiceInterviewsData";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function PracticeInterviewSession({ interview }: { interview: PracticeInterview }) {
  const { data: session, status } = useSession();
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const brand =
    COMPANY_BRAND_COLORS[interview.companySlug] ?? "from-scale-purple to-violet-600";

  const displayMessages = useMemo(() => {
    if (!started) return [];
    if (messages.length > 0) return messages;
    return [{ role: "assistant" as const, content: openingInterviewerMessage(interview) }];
  }, [started, messages, interview]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleStart = () => {
    if (status !== "authenticated") return;
    setStarted(true);
    setMessages([{ role: "assistant", content: openingInterviewerMessage(interview) }]);
    setTimeout(scrollToBottom, 100);
  };

  const sendMessage = async () => {
    const text = draft.trim();
    if (!text || loading) return;
    if (status !== "authenticated") return;

    const nextUser: ChatMessage = { role: "user", content: text };
    const history = [...displayMessages, nextUser];
    setDraft("");
    setMessages(history);
    setLoading(true);
    setError(null);
    setTimeout(scrollToBottom, 50);

    try {
      const res = await fetch("/api/practice-interviews/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interviewId: interview.id,
          messages: history,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setMessages([...history, { role: "assistant", content: data.reply }]);
      setTimeout(scrollToBottom, 50);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setMessages(displayMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <Link
        href="/practice-interviews"
        className="text-sm font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mb-6"
      >
        ← All practice interviews
      </Link>

      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-card mb-6">
        <div className="flex items-start gap-4">
          <div
            className={`h-12 w-12 shrink-0 rounded-xl bg-gradient-to-br ${brand} flex items-center justify-center text-xs font-bold text-white uppercase`}
          >
            {interview.companySlug.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              {INTERVIEW_TYPE_LABELS[interview.interviewType]} · {interview.durationMinutes} min
            </p>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">{interview.title}</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {interview.companyName} · {interview.roleType}
            </p>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{interview.description}</p>
          </div>
        </div>
      </div>

      {status === "loading" && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        </div>
      )}

      {status === "unauthenticated" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <p className="font-semibold">Sign in to start this mock interview</p>
          <p className="mt-1 text-amber-800/90">
            Practice interviews use AI and require a RethinkJobs account.
          </p>
          <Link
            href="/"
            className="mt-3 inline-flex rounded-lg bg-scale-purple px-4 py-2 text-xs font-semibold text-white hover:bg-scale-purple-dark"
          >
            Sign in with Google
          </Link>
        </div>
      )}

      {status === "authenticated" && !started && (
        <div className="text-center py-8">
          <button
            type="button"
            onClick={handleStart}
            className="rounded-xl bg-scale-purple px-8 py-3.5 text-sm font-semibold text-white shadow-scale-soft hover:bg-scale-purple-dark transition-colors"
          >
            Start mock interview
          </button>
          <p className="mt-3 text-xs text-slate-500">
            Signed in as {session?.user?.email}
          </p>
        </div>
      )}

      {status === "authenticated" && started && (
        <>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 min-h-[320px] max-h-[min(60vh,520px)] overflow-y-auto mb-4">
            <div className="space-y-4">
              {displayMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-slate-200 text-slate-800 shadow-sm"
                    }`}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wide opacity-70 mb-1">
                      {m.role === "user" ? "You" : "Interviewer"}
                    </p>
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <p className="text-xs text-slate-400 animate-pulse">Interviewer is thinking…</p>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {error && (
            <p className="mb-3 text-sm text-red-600">{error}</p>
          )}

          <div className="flex gap-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Type your answer… (Enter to send, Shift+Enter for newline)"
              rows={3}
              disabled={loading}
              className="flex-1 resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-scale-purple focus:ring-2 focus:ring-scale-purple/20 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={loading || !draft.trim()}
              className="shrink-0 self-end rounded-xl bg-scale-purple px-5 py-3 text-sm font-semibold text-white hover:bg-scale-purple-dark disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
