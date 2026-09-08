export type TsentaApplicationStatus =
  | "queued"
  | "running"
  | "needs_review"
  | "needs_otp"
  | "submitted"
  | "failed";

export type PublicTsentaApplication = {
  id: string;
  listingId: string | null;
  applyUrl: string;
  company: string;
  roleTitle: string;
  ats: string | null;
  status: TsentaApplicationStatus | string;
  failureReason: string | null;
  chainId: string | null;
};

export function isInFlightStatus(status: string): boolean {
  return (
    status === "queued" ||
    status === "running" ||
    status === "needs_review" ||
    status === "needs_otp"
  );
}

export function isTerminalStatus(status: string): boolean {
  return status === "submitted" || status === "failed";
}
