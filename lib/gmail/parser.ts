import type { GmailMessage, GmailMessagePart } from "@/types/gmail";
import { base64urlDecode } from "@/lib/utils";

export interface ParsedMessage {
  gmail_id: string;
  subject: string;
  from: string;
  from_email: string;
  from_domain: string;
  date: string;
  received_at: number;
  body_text: string;
  snippet: string;
  thread_id: string;
  message_id: string;
}

export function parseGmailMessage(message: GmailMessage): ParsedMessage {
  const headers = message.payload?.headers ?? [];
  const getHeader = (name: string) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ??
    "";

  const subject = getHeader("Subject") || "(no subject)";
  const from = getHeader("From");
  const dateHeader = getHeader("Date");
  const messageIdHeader = getHeader("Message-ID");

  const emailMatch = from.match(/<([^>]+)>/) ?? from.match(/(\S+@\S+)/);
  const from_email = emailMatch
    ? emailMatch[1].toLowerCase()
    : from.toLowerCase();
  const from_domain = from_email.includes("@")
    ? from_email.split("@")[1]
    : from_email;

  const received_at = message.internalDate
    ? parseInt(message.internalDate, 10)
    : Date.parse(dateHeader) || Date.now();

  const body_text = extractBodyText(message.payload);

  return {
    gmail_id: message.id,
    subject,
    from,
    from_email,
    from_domain,
    date: dateHeader,
    received_at,
    body_text,
    snippet: message.snippet ?? "",
    thread_id: message.threadId,
    message_id: messageIdHeader,
  };
}

function extractBodyText(part: GmailMessagePart | undefined): string {
  if (!part) return "";

  if (part.mimeType === "text/plain" && part.body?.data) {
    return decodeBase64urlBody(part.body.data);
  }

  if (part.mimeType === "text/html" && part.body?.data) {
    return stripHtmlTags(decodeBase64urlBody(part.body.data));
  }

  if (part.parts) {
    const plainPart = findPartByMimeType(part.parts, "text/plain");
    if (plainPart?.body?.data) {
      return decodeBase64urlBody(plainPart.body.data);
    }

    const htmlPart = findPartByMimeType(part.parts, "text/html");
    if (htmlPart?.body?.data) {
      return stripHtmlTags(decodeBase64urlBody(htmlPart.body.data));
    }

    for (const subPart of part.parts) {
      const text = extractBodyText(subPart);
      if (text) return text;
    }
  }

  return "";
}

function findPartByMimeType(
  parts: GmailMessagePart[],
  mimeType: string
): GmailMessagePart | undefined {
  for (const part of parts) {
    if (part.mimeType === mimeType) return part;
    if (part.parts) {
      const found = findPartByMimeType(part.parts, mimeType);
      if (found) return found;
    }
  }
  return undefined;
}

function decodeBase64urlBody(data: string): string {
  try {
    const bytes = base64urlDecode(data);
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return "";
  }
}

function stripHtmlTags(html: string): string {
  let text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  text = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|tr|li|h[1-6])[^>]*>/gi, "\n");

  text = text.replace(/<[^>]+>/g, "");

  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  return text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}
