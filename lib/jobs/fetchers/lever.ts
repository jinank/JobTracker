export type LeverPosting = {
  id: string;
  text: string;
  hostedUrl: string;
  descriptionPlain?: string;
  description?: string;
  createdAt?: number;
  updatedAt?: number;
  categories?: {
    location?: string;
    commitment?: string;
    team?: string;
  };
};

export async function fetchLeverPostings(company: string): Promise<LeverPosting[]> {
  const url = `https://api.lever.co/v0/postings/${encodeURIComponent(company)}?mode=json`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`Lever ${company}: HTTP ${res.status}`);
  }
  const data = (await res.json()) as LeverPosting[];
  return Array.isArray(data) ? data : [];
}
