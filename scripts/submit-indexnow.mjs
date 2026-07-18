/**
 * Submit summer2027internships.com sitemap URLs to IndexNow (Bing + partners).
 * Usage: npm run seo:indexnow
 *
 * Before first run (after deploy), verify key file is live:
 *   https://www.summer2027internships.com/ed2244439860406b92922cfbd8bf9fbb.txt
 *
 * Or use LaunchIgniter Free IndexNow Submitter with:
 *   Sitemap: https://www.summer2027internships.com/sitemap.xml
 *   Key:     ed2244439860406b92922cfbd8bf9fbb
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvLocal();
process.chdir(path.join(__dirname, ".."));

async function main() {
  const { INDEXNOW_KEY, getIndexNowKeyLocation, getSitemapUrlsForIndexNow, submitSitemapToIndexNow } =
    await import(pathToFileURL(path.join(process.cwd(), "lib/indexNow.ts")).href);

  const keyLocation = getIndexNowKeyLocation("https://www.summer2027internships.com");
  const urls = getSitemapUrlsForIndexNow("https://www.summer2027internships.com");

  console.log("IndexNow key:", INDEXNOW_KEY);
  console.log("Key file URL:", keyLocation);
  console.log("Sitemap URL: https://www.summer2027internships.com/sitemap.xml");
  console.log("URLs to submit:", urls.length);

  // Verify key file is publicly reachable before submitting
  const keyCheck = await fetch(keyLocation, { cache: "no-store" });
  const keyBody = (await keyCheck.text()).trim();
  if (!keyCheck.ok || keyBody !== INDEXNOW_KEY) {
    console.error(
      `\nKey file not reachable or mismatched (HTTP ${keyCheck.status}).\n` +
        `Deploy public/${INDEXNOW_KEY}.txt first, then re-run.\n` +
        `Expected body: ${INDEXNOW_KEY}\n` +
        `Got: ${keyBody.slice(0, 80) || "(empty)"}\n`
    );
    process.exitCode = 1;
    return;
  }

  console.log("Key file OK. Submitting to api.indexnow.org...\n");
  const result = await submitSitemapToIndexNow();
  console.log(JSON.stringify(result, null, 2));

  if (result.errors.length) {
    process.exitCode = 1;
  } else {
    console.log(`\nSubmitted ${result.submitted} URLs in ${result.batches} batch(es).`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
