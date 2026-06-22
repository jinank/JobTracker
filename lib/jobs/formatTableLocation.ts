/** Compact location for table cells when a listing spans multiple cities. */
export function formatTableLocation(location: string): string {
  const trimmed = location.trim();
  if (!trimmed) return trimmed;

  const parts = trimmed
    .split(/\s*[;|]\s*|\s+\/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length > 1) {
    return `${parts[0]}...`;
  }

  return trimmed;
}

export function locationHasMultipleCities(location: string): boolean {
  const trimmed = location.trim();
  if (!trimmed) return false;
  return /\s*[;|]\s*|\s+\/\s+/.test(trimmed);
}
