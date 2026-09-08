/**
 * Debug magic-link token verification. Usage: npx tsx scripts/test-magic-link-verify.mjs test@example.com
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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

const email = process.argv[2] ?? "test@example.com";

async function main() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const admin = createClient(url, serviceKey);
  const redirectTo = "https://www.summer2027internships.com/auth/callback?next=/";

  const { data, error } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error) {
    console.error("generateLink error:", error.message);
    process.exit(1);
  }

  const hashed = data.properties?.hashed_token;
  const actionLink = data.properties?.action_link;
  const verificationType = data.properties?.verification_type;
  console.log("verification_type:", verificationType);
  console.log("hashed_token length:", hashed?.length);
  console.log("action_link:", actionLink);

  let tokenFromAction = null;
  if (actionLink) {
    tokenFromAction = new URL(actionLink).searchParams.get("token");
    console.log("token from action_link length:", tokenFromAction?.length);
    console.log("tokens match:", tokenFromAction === hashed);
  }

  const tokenHash = hashed;
  for (const clientLabel of ["service", ...(anonKey ? ["anon"] : [])]) {
    const client =
      clientLabel === "service"
        ? admin
        : createClient(url, anonKey);
    for (const otpType of ["email", "magiclink", "signup"]) {
      const { data: vData, error: vErr } = await client.auth.verifyOtp({
        token_hash: tokenHash,
        type: otpType,
      });
      console.log(
        `[${clientLabel}] verifyOtp type=${otpType}:`,
        vErr?.message ?? `OK session=${Boolean(vData.session?.access_token)}`
      );
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
