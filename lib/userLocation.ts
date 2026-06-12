export const PENDING_LOCATION_KEY = "rethinkjobs_pending_location_v1";

export type UserLocation = {
  city: string;
  state: string;
  country: string;
};

export const US_STATES: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

export function normalizeUserLocation(input: {
  city?: unknown;
  state?: unknown;
  country?: unknown;
}): UserLocation | null {
  const city = typeof input.city === "string" ? input.city.trim() : "";
  const state = typeof input.state === "string" ? input.state.trim() : "";
  const country = typeof input.country === "string" ? input.country.trim() : "";
  if (!city || !state || !country) return null;
  return { city, state, country };
}

export function savePendingLocation(location: UserLocation) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PENDING_LOCATION_KEY, JSON.stringify(location));
  } catch {
    /* quota / private mode */
  }
}

export function readPendingLocation(): UserLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PENDING_LOCATION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserLocation;
    return normalizeUserLocation(parsed);
  } catch {
    return null;
  }
}

export function clearPendingLocation() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PENDING_LOCATION_KEY);
  } catch {
    /* ignore */
  }
}

export function formatUserLocation(loc: {
  city?: string | null;
  state?: string | null;
  country?: string | null;
}): string | null {
  const city = loc.city?.trim();
  const state = loc.state?.trim();
  const country = loc.country?.trim();
  if (!city || !state || !country) return null;
  return `${city}, ${state}, ${country}`;
}
