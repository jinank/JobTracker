export const DB_NAME = "glanceai";
export const DB_VERSION = 1;
export const EXTRACTION_VERSION = 1;

export const GMAIL_BASE_URL = "https://gmail.googleapis.com/gmail/v1";

/** Shared ATS / job-board sender domains used in Gmail list filters. */
const GMAIL_ATS_FROM =
  "greenhouse.io OR greenhouse-mail.io OR lever.co OR hire.lever.co OR boards.eu.greenhouse.io OR workday.com OR myworkday.com OR myworkdayjobs.com OR smartrecruiters.com OR jobs-noreply.linkedin.com OR linkedin.com OR indeed.com OR indeedemail.com OR icims.com OR taleo.net OR jobvite.com OR successfactors.com OR ashbyhq.com OR bamboohr.com OR recruitee.com OR jazz.co OR breezy.hr OR applytojob.com OR hirebridge.com OR ultipro.com OR ceridian.com OR adp.com OR oracle.com OR cornerstoneondemand.com OR workable.com OR jobscore.com OR rippling.com OR dover.io OR gem.com OR fountain.com OR paylocity.com OR paycom.com OR dayforce.com OR glassdoor.com OR wellfound.com OR angel.co OR otta.com OR notch.hr OR polymer.co OR ycombinator.com";

const GMAIL_SUBJECT_TERMS =
  "application OR applying OR applied OR applicant OR interview OR rejection OR offer OR assessment OR position OR role OR opportunity OR hiring OR candidate OR candidacy OR confirmation OR submitted OR submission OR resume OR \"under review\" OR \"next steps\" OR \"status update\" OR \"moved forward\" OR \"not be moving forward\" OR unfortunately OR \"thank you for considering\" OR \"thank you for your interest\" OR \"thank you for applying\" OR \"thanks for applying\" OR \"thank you for your application\" OR \"we will not\" OR \"regret to inform\" OR \"received your application\" OR \"we have received\" OR \"we've received\" OR \"we received your\" OR \"joining our team\" OR \"join our team\" OR \"expression of interest\" OR \"thank you for sharing\" OR \"talent community\" OR \"talent network\" OR \"application received\" OR \"application update\" OR \"application status\"";

/** Gmail list filter: only messages matching this query are synced (then classified by AI). */
export const GMAIL_JOB_QUERY = `newer_than:6m (subject:(${GMAIL_SUBJECT_TERMS}) OR from:(${GMAIL_ATS_FROM}))`;

/**
 * Tighter recent window with the same terms — run first so brand-new
 * confirmations are not buried behind older matching marketing mail.
 */
export const GMAIL_JOB_QUERY_RECENT = `newer_than:5d (subject:(${GMAIL_SUBJECT_TERMS}) OR from:(${GMAIL_ATS_FROM}))`;

/** Max message IDs to collect from Gmail list pagination per sync. */
export const MAX_MESSAGES_PER_SYNC = 400;

/**
 * New (unindexed) messages to fetch + classify per POST.
 * Each message runs an OpenAI call; keep this low enough to finish under Vercel
 * serverless maxDuration (300s on Pro). Users can run Sync again to drain the rest.
 */
export const MAX_NEW_EMAILS_CLASSIFIED_PER_SYNC = 42;

export const GMAIL_FETCH_BATCH_SIZE = 10;
/** Concurrent OpenAI classifications per batch (within each sync). */
export const CLASSIFY_BATCH_SIZE = 8;
