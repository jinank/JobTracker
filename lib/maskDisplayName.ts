/** Public leaderboard label: up to 3 alphanumeric chars + ** (emails / names never exposed in full). */
export function maskDisplayName(source: string | null | undefined): string {
  const raw = (source ?? "").trim();
  if (!raw) return "?**";
  const alnum = raw.replace(/[^a-zA-Z0-9]/g, "");
  if (!alnum) return "?**";
  const head = alnum.slice(0, 3);
  return `${head}**`;
}
