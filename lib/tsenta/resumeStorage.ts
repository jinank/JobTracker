import { supabase } from "@/lib/supabase";
import {
  TSENTA_RESUME_BUCKET,
  TSENTA_SIGNED_URL_SECONDS,
} from "@/lib/tsenta/config";

function safeFilename(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
  return base.slice(0, 80) || "resume.pdf";
}

export function resumeObjectPath(userId: string, filename: string): string {
  return `${userId}/${Date.now()}-${safeFilename(filename)}`;
}

export async function uploadResumePdf(
  userId: string,
  filename: string,
  buffer: Buffer,
  previousPath?: string | null
): Promise<string> {
  const path = resumeObjectPath(userId, filename);
  const { error } = await supabase.storage
    .from(TSENTA_RESUME_BUCKET)
    .upload(path, buffer, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (error) {
    throw new Error(
      error.message.includes("Bucket not found")
        ? "Resume storage is not set up yet."
        : error.message
    );
  }

  if (previousPath && previousPath !== path) {
    await supabase.storage.from(TSENTA_RESUME_BUCKET).remove([previousPath]);
  }

  return path;
}

export async function deleteResumePdf(path: string | null | undefined): Promise<void> {
  if (!path) return;
  await supabase.storage.from(TSENTA_RESUME_BUCKET).remove([path]);
}

export async function createResumeSignedUrl(
  path: string | null | undefined
): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage
    .from(TSENTA_RESUME_BUCKET)
    .createSignedUrl(path, TSENTA_SIGNED_URL_SECONDS);
  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
