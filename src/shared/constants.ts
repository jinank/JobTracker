export const ALARM_NAME = "glanceai-sync";
export const DB_NAME = "glanceai";
export const DB_VERSION = 1;
export const EXTRACTION_VERSION = 1;

export const GMAIL_BASE_URL = "https://gmail.googleapis.com/gmail/v1";
export const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const OAUTH_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const OAUTH_REVOKE_URL = "https://oauth2.googleapis.com/revoke";

export const GMAIL_SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
];

// Set via .env: VITE_GOOGLE_CLIENT_ID
// Get this from Google Cloud Console → OAuth 2.0 Client (Chrome Extension type)
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

// Gmail search query to narrow to job-related emails (keep in sync with lib/constants.ts)
export const GMAIL_JOB_QUERY =
  "newer_than:6m (subject:(application OR applying OR applicant OR interview OR rejection OR offer OR assessment OR position OR role OR opportunity OR hiring OR candidate OR candidacy OR \"not be moving forward\" OR \"unfortunately\" OR \"thank you for considering\" OR \"thank you for your interest\" OR \"thank you for applying\" OR \"thanks for applying\" OR \"we will not\" OR \"regret to inform\" OR \"received your application\" OR \"we have received your application\" OR \"joining our team\" OR \"join our team\" OR \"expression of interest\" OR \"thank you for sharing\") OR from:(greenhouse.io OR greenhouse-mail.io OR lever.co OR workday.com OR myworkday.com OR smartrecruiters.com OR jobs-noreply.linkedin.com OR indeed.com OR icims.com OR taleo.net OR jobvite.com OR myworkdayjobs.com OR successfactors.com OR ashbyhq.com OR bamboohr.com OR recruitee.com OR jazz.co OR breezy.hr OR applytojob.com OR hirebridge.com OR ultipro.com OR ceridian.com OR adp.com OR oracle.com OR cornerstoneondemand.com OR hire.lever.co OR boards.eu.greenhouse.io))";

// Max messages to fetch per sync run (to stay within SW time limits)
export const MAX_MESSAGES_PER_SYNC = 50;

export const SYNC_INTERVAL_MINUTES = 30;
