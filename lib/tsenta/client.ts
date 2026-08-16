import {
  getTsentaApiBase,
  getTsentaApiKey,
  tsentaNotConfiguredMessage,
} from "@/lib/tsenta/config";
import type { ApplyProfile } from "@/lib/tsenta/profile";
import { toTsentaProfilePayload } from "@/lib/tsenta/profile";
import type { TsentaApplicationStatus } from "@/lib/tsenta/types";

export type { TsentaApplicationStatus } from "@/lib/tsenta/types";
export { isInFlightStatus, isTerminalStatus } from "@/lib/tsenta/types";

export type TsentaApplication = {
  id: string;
  candidate_id?: string;
  candidate_name?: string;
  candidate_email?: string;
  profile_id?: string;
  ats: string | null;
  url?: string;
  status: TsentaApplicationStatus;
  failure_reason: string | null;
  price_usd: number | null;
  created_at?: string;
  updated_at?: string;
};

export type TsentaCandidate = {
  id: string;
  profile_id: string;
  email?: string;
  full_name?: string;
  email_mode?: string;
};

export class TsentaApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "TsentaApiError";
    this.status = status;
    this.code = code;
  }
}

function requireKey(): string {
  const key = getTsentaApiKey();
  if (!key) {
    throw new TsentaApiError(tsentaNotConfiguredMessage(), 503, "not_configured");
  }
  return key;
}

function readError(payload: unknown, fallback: string): { message: string; code: string } {
  if (payload && typeof payload === "object" && "error" in payload) {
    const err = (payload as { error?: unknown }).error;
    if (typeof err === "string") return { message: err, code: "invalid_request" };
    if (err && typeof err === "object") {
      const obj = err as { message?: unknown; code?: unknown };
      return {
        message: typeof obj.message === "string" ? obj.message : fallback,
        code: typeof obj.code === "string" ? obj.code : "invalid_request",
      };
    }
  }
  return { message: fallback, code: "invalid_request" };
}

async function tsentaFetch<T>(
  path: string,
  init: RequestInit & { method?: string } = {}
): Promise<T> {
  const key = requireKey();
  const res = await fetch(`${getTsentaApiBase()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  const text = await res.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      json = { error: { message: text } };
    }
  }

  if (!res.ok) {
    const { message, code } = readError(json, `Auto-apply request failed (${res.status})`);
    throw new TsentaApiError(
      message.replace(/tsenta/gi, "auto-apply"),
      res.status,
      code
    );
  }

  return json as T;
}

export async function detectAts(url: string): Promise<{ ats: string | null }> {
  const data = await tsentaFetch<{ ats?: string | null } | { system?: string | null }>(
    "/detect",
    {
      method: "POST",
      body: JSON.stringify({ url }),
    }
  );
  const ats =
    (data && typeof data === "object" && "ats" in data ? data.ats : null) ??
    (data && typeof data === "object" && "system" in data ? data.system : null) ??
    null;
  return { ats: typeof ats === "string" && ats.trim() ? ats.trim() : null };
}

function candidateBody(
  profile: ApplyProfile,
  email: string,
  resumeUrl: string,
  emailMode?: string
) {
  const body: Record<string, unknown> = {
    profile: toTsentaProfilePayload(profile, email),
    resume_url: resumeUrl,
    email_mode: emailMode ?? "own",
  };
  if (profile.workdayPassword) {
    body.workday_password = profile.workdayPassword;
  }
  return body;
}

export async function createCandidate(
  profile: ApplyProfile,
  email: string,
  resumeUrl: string
): Promise<TsentaCandidate> {
  const modes = ["own", "candidate", "unmanaged"] as const;
  let lastError: TsentaApiError | null = null;

  for (const mode of modes) {
    try {
      return await tsentaFetch<TsentaCandidate>("/candidates", {
        method: "POST",
        body: JSON.stringify(candidateBody(profile, email, resumeUrl, mode)),
      });
    } catch (err) {
      if (
        err instanceof TsentaApiError &&
        err.status === 422 &&
        /email_mode/i.test(err.message)
      ) {
        lastError = err;
        continue;
      }
      throw err;
    }
  }

  try {
    const body = candidateBody(profile, email, resumeUrl);
    delete body.email_mode;
    return await tsentaFetch<TsentaCandidate>("/candidates", {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw lastError ?? err;
  }
}

export async function createProfile(
  candidateId: string,
  profile: ApplyProfile,
  email: string,
  resumeUrl: string
): Promise<{ id: string }> {
  const body: Record<string, unknown> = {
    candidate_id: candidateId,
    profile: toTsentaProfilePayload(profile, email),
    resume_url: resumeUrl,
  };
  if (profile.workdayPassword) {
    body.workday_password = profile.workdayPassword;
  }
  const data = await tsentaFetch<{ id?: string; profile_id?: string }>("/profiles", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const id = data.id ?? data.profile_id;
  if (!id) {
    throw new TsentaApiError("Could not create your apply profile.", 502, "invalid_request");
  }
  return { id };
}

export async function createApplication(
  profileId: string,
  url: string
): Promise<TsentaApplication> {
  return tsentaFetch<TsentaApplication>("/applications", {
    method: "POST",
    body: JSON.stringify({
      profile_id: profileId,
      url,
      review_before_submit: false,
    }),
  });
}

export async function getApplication(id: string): Promise<TsentaApplication> {
  return tsentaFetch<TsentaApplication>(`/applications/${encodeURIComponent(id)}`);
}
