export type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  location?: { name?: string };
  updated_at?: string;
  first_published?: string;
  content?: string;
  departments?: Array<{ name?: string }>;
};

export type GreenhouseBoardResponse = {
  jobs?: GreenhouseJob[];
};

export async function fetchGreenhouseJobs(
  boardToken: string
): Promise<GreenhouseJob[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(boardToken)}/jobs?content=true`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`Greenhouse ${boardToken}: HTTP ${res.status}`);
  }
  const data = (await res.json()) as GreenhouseBoardResponse;
  return data.jobs ?? [];
}
