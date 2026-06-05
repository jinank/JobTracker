/** Client/server helpers for expired or invalid Gmail OAuth during sync. */

export const GMAIL_AUTH_EXPIRED_CODE = "GMAIL_AUTH_EXPIRED";

export function isGmailReauthError(message: string, code?: string): boolean {
  if (
    code === GMAIL_AUTH_EXPIRED_CODE ||
    code === "GMAIL_SCOPE_INSUFFICIENT" ||
    code === "GMAIL_NOT_CONNECTED"
  ) {
    return true;
  }

  const m = message.toLowerCase();
  return (
    m.includes("gmail api error 401") ||
    m.includes("invalid credentials") ||
    m.includes("unauthenticated") ||
    m.includes("invalid authentication credentials") ||
    m.includes("refresh token") ||
    m.includes("refreshtokenerror") ||
    m.includes("access_token_scope_insufficient") ||
    m.includes("insufficient authentication scopes")
  );
}

export function classifyGmailSyncError(message: string): {
  needsReauth: boolean;
  userMessage: string;
} {
  if (isGmailReauthError(message)) {
    return {
      needsReauth: true,
      userMessage:
        "Your Gmail connection expired or was revoked. Reconnect Gmail to sync applications again.",
    };
  }
  return { needsReauth: false, userMessage: message };
}
