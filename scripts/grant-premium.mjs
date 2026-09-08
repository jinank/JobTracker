/**
 * Grant paid/Premium to an existing users row.
 * Usage: npx tsx scripts/grant-premium.mjs jinankdthakker@gmail.com
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

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

function gmailAliases(email) {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf("@");
  if (at <= 0) return [trimmed];
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const aliases = new Set([trimmed]);
  if (domain === "gmail.com" || domain === "googlemail.com") {
    const nodot = local.replace(/\./g, "");
    aliases.add(`${nodot}@gmail.com`);
    if (local.includes(".")) aliases.add(trimmed);
  }
  return [...aliases];
}

async function main() {
  const emailArg = process.argv[2] || "jinankdthakker@gmail.com";
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const sb = createClient(url, key);
  const candidates = gmailAliases(emailArg);
  const { data: rows, error: findErr } = await sb
    .from("users")
    .select("id, email, paid, subscription_status, student_verified")
    .in("email", candidates);

  if (findErr) {
    console.error(findErr.message);
    process.exit(1);
  }

  if (!rows?.length) {
    console.error("No users row found for", candidates.join(", "));
    process.exit(1);
  }

  const now = new Date().toISOString();
  for (const row of rows) {
    const { error } = await sb
      .from("users")
      .update({
        paid: true,
        paid_at: now,
        subscription_status: "active",
        student_verified: false,
      })
      .eq("id", row.id);
    if (error) {
      console.error(row.email, error.message);
      process.exitCode = 1;
      continue;
    }
    console.log(
      JSON.stringify({
        email: row.email,
        before: {
          paid: row.paid,
          subscription_status: row.subscription_status,
        },
        after: {
          paid: true,
          subscription_status: "active",
          student_verified: false,
        },
      })
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
