export type ApplyProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isOver18: boolean;
  isAuthorizedToWork: boolean;
  needsSponsorship: boolean;
  canWorkInPerson: boolean;
  canRelocate: boolean;
  canStartImmediately: boolean;
  university: string;
  degree: string;
  workdayPassword?: string;
};

export type ApplyProfilePublic = Omit<ApplyProfile, "workdayPassword"> & {
  hasWorkdayPassword: boolean;
};

const EMPTY: ApplyProfile = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "United States",
  zipCode: "",
  isOver18: true,
  isAuthorizedToWork: true,
  needsSponsorship: false,
  canWorkInPerson: true,
  canRelocate: false,
  canStartImmediately: true,
  university: "",
  degree: "",
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asBool(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

export function emptyApplyProfile(): ApplyProfile {
  return { ...EMPTY };
}

export function parseStoredApplyProfile(raw: unknown): ApplyProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const firstName = asString(row.firstName);
  const lastName = asString(row.lastName);
  const phone = asString(row.phone);
  const address = asString(row.address);
  const city = asString(row.city);
  const state = asString(row.state);
  const country = asString(row.country) || EMPTY.country;
  const zipCode = asString(row.zipCode);
  const university = asString(row.university);
  const degree = asString(row.degree);
  const workdayPassword = asString(row.workdayPassword) || undefined;

  return {
    firstName,
    lastName,
    phone,
    address,
    city,
    state,
    country,
    zipCode,
    isOver18: asBool(row.isOver18, true),
    isAuthorizedToWork: asBool(row.isAuthorizedToWork, true),
    needsSponsorship: asBool(row.needsSponsorship, false),
    canWorkInPerson: asBool(row.canWorkInPerson, true),
    canRelocate: asBool(row.canRelocate, false),
    canStartImmediately: asBool(row.canStartImmediately, true),
    university,
    degree,
    workdayPassword,
  };
}

export function mergeApplyProfile(
  existing: ApplyProfile | null,
  patch: Record<string, unknown>
): ApplyProfile {
  const base = existing ?? emptyApplyProfile();
  const next = parseStoredApplyProfile({ ...base, ...patch }) ?? base;
  const incomingPassword = asString(patch.workdayPassword);
  if (!incomingPassword) {
    next.workdayPassword = existing?.workdayPassword;
  }
  return next;
}

export function applyProfileMissingFields(profile: ApplyProfile): string[] {
  const missing: string[] = [];
  if (!profile.firstName) missing.push("first name");
  if (!profile.lastName) missing.push("last name");
  if (!profile.phone) missing.push("phone");
  if (!profile.address) missing.push("address");
  if (!profile.city) missing.push("city");
  if (!profile.state) missing.push("state");
  if (!profile.country) missing.push("country");
  if (!profile.zipCode) missing.push("ZIP code");
  if (!profile.university) missing.push("university");
  if (!profile.degree) missing.push("degree");
  return missing;
}

export function isApplyProfileComplete(
  profile: ApplyProfile | null,
  hasPdfResume: boolean
): boolean {
  if (!profile || !hasPdfResume) return false;
  return applyProfileMissingFields(profile).length === 0;
}

export function toPublicApplyProfile(profile: ApplyProfile | null): ApplyProfilePublic {
  const p = profile ?? emptyApplyProfile();
  return {
    firstName: p.firstName,
    lastName: p.lastName,
    phone: p.phone,
    address: p.address,
    city: p.city,
    state: p.state,
    country: p.country,
    zipCode: p.zipCode,
    isOver18: p.isOver18,
    isAuthorizedToWork: p.isAuthorizedToWork,
    needsSponsorship: p.needsSponsorship,
    canWorkInPerson: p.canWorkInPerson,
    canRelocate: p.canRelocate,
    canStartImmediately: p.canStartImmediately,
    university: p.university,
    degree: p.degree,
    hasWorkdayPassword: Boolean(p.workdayPassword),
  };
}

export function splitDisplayName(name: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export function toTsentaProfilePayload(profile: ApplyProfile, email: string) {
  return {
    personalInformation: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      isOver18: profile.isOver18,
      email,
      phone: profile.phone,
      address: profile.address,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      zipCode: profile.zipCode,
    },
    workAuthorization: {
      isAuthorizedToWork: profile.isAuthorizedToWork,
      needsSponsorship: profile.needsSponsorship,
    },
    workPreferences: {
      canWorkInPerson: profile.canWorkInPerson,
      canRelocate: profile.canRelocate,
      canStartImmediately: profile.canStartImmediately,
      hasTransportation: true,
      hasAccommodations: false,
    },
    backgroundCheck: {
      hasWorkedForCompanyBefore: false,
      hasGovernmentClearance: false,
      hasGovernmentTies: false,
    },
    education: [{ university: profile.university, degree: profile.degree }],
  };
}
