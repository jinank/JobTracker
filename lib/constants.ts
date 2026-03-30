export const DB_NAME = "glanceai";
export const DB_VERSION = 1;
export const EXTRACTION_VERSION = 1;

export const GMAIL_BASE_URL = "https://gmail.googleapis.com/gmail/v1";

/** Gmail list filter: only messages matching this query are synced (then classified by AI). */
export const GMAIL_JOB_QUERY =
  "newer_than:6m (subject:(application OR applying OR applicant OR interview OR rejection OR offer OR assessment OR position OR role OR opportunity OR hiring OR candidate OR candidacy OR \"not be moving forward\" OR \"unfortunately\" OR \"thank you for considering\" OR \"thank you for your interest\" OR \"thank you for applying\" OR \"thanks for applying\" OR \"we will not\" OR \"regret to inform\" OR \"received your application\" OR \"we have received your application\" OR \"joining our team\" OR \"join our team\" OR \"expression of interest\" OR \"thank you for sharing\") OR from:(greenhouse.io OR greenhouse-mail.io OR lever.co OR workday.com OR myworkday.com OR smartrecruiters.com OR jobs-noreply.linkedin.com OR indeed.com OR icims.com OR taleo.net OR jobvite.com OR myworkdayjobs.com OR successfactors.com OR ashbyhq.com OR bamboohr.com OR recruitee.com OR jazz.co OR breezy.hr OR applytojob.com OR hirebridge.com OR ultipro.com OR ceridian.com OR adp.com OR oracle.com OR cornerstoneondemand.com OR hire.lever.co OR boards.eu.greenhouse.io))";

/** Max message IDs to collect from Gmail list pagination per sync. */
export const MAX_MESSAGES_PER_SYNC = 250;

/**
 * New (unindexed) messages to fetch + classify per POST.
 * Each message runs an OpenAI call; keep this low enough to finish under Vercel
 * serverless maxDuration (300s on Pro). Users can run Sync again to drain the rest.
 */
export const MAX_NEW_EMAILS_CLASSIFIED_PER_SYNC = 42;

export const GMAIL_FETCH_BATCH_SIZE = 10;
/** Concurrent OpenAI classifications per batch (within each sync). */
export const CLASSIFY_BATCH_SIZE = 8;
