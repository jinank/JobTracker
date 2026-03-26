const SNOOZE_UNTIL_KEY = "rethinkjobs_gita_snooze_until_ms";
const DISABLED_KEY = "rethinkjobs_gita_quotes_disabled";

export type GitaQuoteVisibility = "visible" | "snoozed" | "disabled";

export function readGitaQuoteVisibility(): GitaQuoteVisibility {
  if (typeof window === "undefined") return "visible";
  try {
    if (localStorage.getItem(DISABLED_KEY) === "1") return "disabled";
    const raw = localStorage.getItem(SNOOZE_UNTIL_KEY);
    const until = raw ? parseInt(raw, 10) : 0;
    if (until > Date.now()) return "snoozed";
  } catch {
    /* ignore */
  }
  return "visible";
}

export function snoozeGitaQuotes(durationMs: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DISABLED_KEY);
    localStorage.setItem(SNOOZE_UNTIL_KEY, String(Date.now() + durationMs));
  } catch {
    /* ignore */
  }
}

export function disableGitaQuotes() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DISABLED_KEY, "1");
    localStorage.removeItem(SNOOZE_UNTIL_KEY);
  } catch {
    /* ignore */
  }
}

export function restoreGitaQuotes() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DISABLED_KEY);
    localStorage.removeItem(SNOOZE_UNTIL_KEY);
  } catch {
    /* ignore */
  }
}

export function snoozeEndsAtMs(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SNOOZE_UNTIL_KEY);
    const until = raw ? parseInt(raw, 10) : 0;
    return until > Date.now() ? until : null;
  } catch {
    return null;
  }
}
