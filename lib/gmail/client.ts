import { GMAIL_BASE_URL } from "@/lib/constants";
import type { GmailListResponse, GmailMessage } from "@/types/gmail";

async function gmailFetch<T>(
  path: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${GMAIL_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 429) {
    throw new Error("Gmail API rate limit exceeded. Try again shortly.");
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Gmail API error ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

export async function listMessages(
  accessToken: string,
  params: {
    q?: string;
    pageToken?: string;
    maxResults?: number;
  } = {}
): Promise<GmailListResponse> {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.pageToken) query.set("pageToken", params.pageToken);
  if (params.maxResults) query.set("maxResults", String(params.maxResults));
  return gmailFetch<GmailListResponse>(
    `/users/me/messages?${query}`,
    accessToken
  );
}

export async function getMessage(
  accessToken: string,
  messageId: string,
  format: "full" | "metadata" | "minimal" = "full"
): Promise<GmailMessage> {
  return gmailFetch<GmailMessage>(
    `/users/me/messages/${messageId}?format=${format}`,
    accessToken
  );
}
