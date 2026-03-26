export type ChainStatus =
  | "APPLIED"
  | "ASSESSMENT"
  | "INTERVIEWING"
  | "OFFER"
  | "REJECTED"
  | "GHOSTED"
  | "WITHDRAWN";

export interface Chain {
  chain_id: string;
  canonical_company: string;
  role_title: string;
  status: ChainStatus;
  last_event_at: number;
  confidence: number;
  created_at: number;
  account_id: string;
  /** User-entered / self-reported notes (newline-separated log lines) */
  user_notes?: string | null;
}

export const STATUS_ORDER: ChainStatus[] = [
  "APPLIED",
  "ASSESSMENT",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
  "GHOSTED",
  "WITHDRAWN",
];
