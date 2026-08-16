import { supabase } from "@/lib/supabase";
import { createCandidate, createProfile, TsentaApiError } from "@/lib/tsenta/client";
import type { ApplyProfile } from "@/lib/tsenta/profile";
import { createResumeSignedUrl } from "@/lib/tsenta/resumeStorage";
import { isTsentaConfigured } from "@/lib/tsenta/config";

export async function syncTsentaCandidate(input: {
  userId: string;
  email: string;
  profile: ApplyProfile;
  resumePath: string | null;
  existingCandidateId: string | null;
}): Promise<{ candidateId: string; profileId: string } | { error: string }> {
  if (!isTsentaConfigured()) {
    return { error: "not_configured" };
  }

  const resumeUrl = await createResumeSignedUrl(input.resumePath);
  if (!resumeUrl) {
    return { error: "Upload a PDF resume before enabling auto-apply." };
  }

  try {
    if (input.existingCandidateId) {
      const profile = await createProfile(
        input.existingCandidateId,
        input.profile,
        input.email,
        resumeUrl
      );
      await supabase
        .from("users")
        .update({
          tsenta_candidate_id: input.existingCandidateId,
          tsenta_profile_id: profile.id,
        })
        .eq("id", input.userId);
      return { candidateId: input.existingCandidateId, profileId: profile.id };
    }

    const candidate = await createCandidate(input.profile, input.email, resumeUrl);
    await supabase
      .from("users")
      .update({
        tsenta_candidate_id: candidate.id,
        tsenta_profile_id: candidate.profile_id,
      })
      .eq("id", input.userId);
    return { candidateId: candidate.id, profileId: candidate.profile_id };
  } catch (err) {
    if (err instanceof TsentaApiError && input.existingCandidateId === null) {
      return { error: err.message };
    }
    if (err instanceof TsentaApiError) {
      try {
        const candidate = await createCandidate(input.profile, input.email, resumeUrl);
        await supabase
          .from("users")
          .update({
            tsenta_candidate_id: candidate.id,
            tsenta_profile_id: candidate.profile_id,
          })
          .eq("id", input.userId);
        return { candidateId: candidate.id, profileId: candidate.profile_id };
      } catch (retryErr) {
        const message =
          retryErr instanceof Error ? retryErr.message : "Could not save your apply profile.";
        return { error: message };
      }
    }
    const message = err instanceof Error ? err.message : "Could not save your apply profile.";
    return { error: message };
  }
}
