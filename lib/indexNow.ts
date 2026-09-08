import { CANONICAL_SITE_HOST, CANONICAL_SITE_ORIGIN, getSiteOrigin } from "@/lib/site";
import { getPublicSitemapPaths } from "@/lib/sitemapPaths";

/** Public IndexNow key (also served at /{key}.txt). Override with INDEXNOW_KEY. */
export const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY?.trim() || "ed2244439860406b92922cfbd8bf9fbb";

export function getIndexNowKeyLocation(origin = getSiteOrigin()): string {
  return `${origin.replace(/\/$/, "")}/${INDEXNOW_KEY}.txt`;
}

export function getSitemapUrlsForIndexNow(origin = getSiteOrigin()): string[] {
  const base = origin.replace(/\/$/, "");
  return getPublicSitemapPaths().map(({ path }) => `${base}${path || ""}`);
}

export type IndexNowSubmitResult = {
  submitted: number;
  batches: number;
  statusCodes: number[];
  errors: string[];
};

/**
 * Notify IndexNow (Bing + participating engines) about URL changes.
 * @see https://www.indexnow.org/documentation
 */
export async function submitUrlsToIndexNow(
  urls: string[],
  options?: { host?: string; key?: string; keyLocation?: string }
): Promise<IndexNowSubmitResult> {
  const key = options?.key ?? INDEXNOW_KEY;
  const host = options?.host ?? CANONICAL_SITE_HOST;
  const keyLocation =
    options?.keyLocation ?? `${CANONICAL_SITE_ORIGIN}/${key}.txt`;

  const result: IndexNowSubmitResult = {
    submitted: 0,
    batches: 0,
    statusCodes: [],
    errors: [],
  };

  const unique = Array.from(
    new Set(urls.map((u) => u.trim()).filter((u) => u.startsWith("http")))
  );
  if (!unique.length) {
    result.errors.push("No URLs to submit");
    return result;
  }

  const batchSize = 100;
  for (let i = 0; i < unique.length; i += batchSize) {
    const urlList = unique.slice(i, i + batchSize);
    result.batches++;

    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          host,
          key,
          keyLocation,
          urlList,
        }),
      });

      result.statusCodes.push(res.status);
      // 200 OK, 202 Accepted are success; 422 often means key file not reachable yet
      if (res.status === 200 || res.status === 202) {
        result.submitted += urlList.length;
      } else {
        const body = await res.text().catch(() => "");
        result.errors.push(
          `Batch ${result.batches}: HTTP ${res.status}${body ? ` — ${body.slice(0, 200)}` : ""}`
        );
      }
    } catch (e) {
      result.errors.push(
        `Batch ${result.batches}: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  return result;
}

export async function submitSitemapToIndexNow(): Promise<IndexNowSubmitResult> {
  return submitUrlsToIndexNow(getSitemapUrlsForIndexNow(CANONICAL_SITE_ORIGIN), {
    host: CANONICAL_SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${CANONICAL_SITE_ORIGIN}/${INDEXNOW_KEY}.txt`,
  });
}
