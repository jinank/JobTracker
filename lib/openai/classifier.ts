import OpenAI from "openai";
import type { ParsedMessage } from "@/lib/gmail/parser";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ClassificationResult {
  eventType:
    | "APPLICATION_RECEIVED"
    | "REJECTION"
    | "ASSESSMENT_INVITE"
    | "INTERVIEW_INVITE"
    | "DEADLINE"
    | "OFFER"
    | "FOLLOW_UP"
    | "OTHER";
  company: string;
  roleTitle: string;
  confidence: number;
  recruiterName: string | null;
  deadline: string | null;
  links: string[];
  evidence: string;
}

const SYSTEM_PROMPT = `You are an expert job application email classifier. Given an email's subject, sender, and body, determine if it is related to a SPECIFIC job application the user made (application confirmation, interview invite, assessment, offer, rejection) and extract structured data.

IMPORTANT - Set eventType to "OTHER" with confidence below 0.3 for:
- Marketing or promotional emails (newsletters, course ads, "interview tips", "job search advice")
- Emails from learning platforms (Alison, Coursera, Udemy, LinkedIn Learning, etc.) promoting courses
- Generic career advice, resume tips, or "land your next job" content
- Emails with "noreply@" that are clearly bulk/promotional (e.g. us-skills.alison.com)
- Any email that does not reference a specific job application the user submitted

Only use APPLICATION_RECEIVED, INTERVIEW_INVITE, ASSESSMENT_INVITE, OFFER, REJECTION, etc. when the email is a direct response to a job application (confirmation, interview scheduling, assessment link, offer letter, rejection notice from a hiring company).

Return a JSON object with these fields:
- eventType: one of APPLICATION_RECEIVED, REJECTION, ASSESSMENT_INVITE, INTERVIEW_INVITE, DEADLINE, OFFER, FOLLOW_UP, OTHER
- company: the company name (extract from body/sender, not ATS domains like greenhouse.io, lever.co, etc.)
- roleTitle: the job title/role being applied for
- confidence: 0.0 to 1.0 indicating how confident you are this is a job-related email
- recruiterName: the recruiter or hiring manager name if mentioned, otherwise null
- deadline: an ISO date string if a deadline is mentioned, otherwise null
- links: array of relevant URLs (interview links, assessment links, calendly, etc.)
- evidence: a short snippet (max 100 chars) from the email that supports the classification

If the email is NOT job-related, set eventType to "OTHER" with confidence below 0.3.`;

export async function classifyEmail(
  email: ParsedMessage
): Promise<ClassificationResult> {
  const bodyTruncated = email.body_text.slice(0, 3000);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Subject: ${email.subject}\nFrom: ${email.from}\nBody:\n${bodyTruncated}`,
      },
    ],
    temperature: 0.1,
    max_tokens: 500,
  });

  const text = completion.choices[0]?.message?.content ?? "{}";

  try {
    const parsed = JSON.parse(text);
    return {
      eventType: parsed.eventType ?? "OTHER",
      company: parsed.company ?? "",
      roleTitle: parsed.roleTitle ?? "",
      confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0)),
      recruiterName: parsed.recruiterName ?? null,
      deadline: parsed.deadline ?? null,
      links: Array.isArray(parsed.links) ? parsed.links : [],
      evidence: (parsed.evidence ?? "").slice(0, 100),
    };
  } catch {
    return {
      eventType: "OTHER",
      company: "",
      roleTitle: "",
      confidence: 0,
      recruiterName: null,
      deadline: null,
      links: [],
      evidence: "",
    };
  }
}

export async function classifyEmails(
  emails: ParsedMessage[]
): Promise<ClassificationResult[]> {
  return Promise.all(emails.map(classifyEmail));
}
