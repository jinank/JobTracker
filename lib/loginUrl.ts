const LOGIN_PATH = "/login";

/** Build /login with optional post-auth redirect (path + query, must be same-origin). */
export function loginUrl(callbackUrl?: string): string {
  if (!callbackUrl || callbackUrl === LOGIN_PATH || callbackUrl.startsWith("/login?")) {
    return LOGIN_PATH;
  }
  if (!callbackUrl.startsWith("/") || callbackUrl.startsWith("//")) {
    return LOGIN_PATH;
  }
  return `${LOGIN_PATH}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export function resolveCallbackUrl(
  raw: string | null | undefined,
  fallback = "/"
): string {
  if (!raw) return fallback;
  try {
    const decoded = decodeURIComponent(raw);
    if (decoded.startsWith("/") && !decoded.startsWith("//")) {
      return decoded;
    }
  } catch {
    /* ignore */
  }
  return fallback;
}
