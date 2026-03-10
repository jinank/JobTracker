# JobFlow

> **Your job search, on autopilot.**
> JobFlow is a privacy-first Chrome extension that reads your Gmail, automatically detects job application emails, and builds a live timeline of every company you've applied to — without a single spreadsheet.

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-violet?style=flat-square" />
  <img alt="Manifest" src="https://img.shields.io/badge/Manifest-v3-4f46e5?style=flat-square&logo=googlechrome&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" />
  <img alt="Local-first" src="https://img.shields.io/badge/local--first-no%20server-f59e0b?style=flat-square" />
</p>

---

## 📋 What It Does

- **Automatic detection** — syncs with Gmail every 30 minutes and classifies job-related emails into meaningful event types (application received, interview invite, assessment, offer, rejection)
- **Timeline per company** — groups all emails for a given employer into a single "chain" with a visual progress bar through the hiring pipeline
- **Deadline reminders** — extracts due dates from assessment and offer emails using natural-language parsing and fires a Chrome notification 24 hours before they expire
- **Zero spreadsheets** — no manual logging; just connect Gmail and JobFlow builds the tracker for you
- **100% local** — all data lives in your browser's IndexedDB; no account, no server, no cloud sync
- **Read-only Gmail access** — the extension only holds the `gmail.readonly` scope and never touches sent mail, drafts, or labels

---

## 🏗️ How It Works

```
Gmail API (readonly)
      │
      ▼
 Gmail Sync (bootstrap → incremental via History API)
      │  raw ParsedMessage
      ▼
 Detection Pipeline
  ├─ Rule-based detector   →  EventType + confidence score
  ├─ Entity extractor      →  company, role, recruiter, deadline
  └─ Chain matcher         →  find or create Chain in IndexedDB
      │
      ▼
 IndexedDB (idb)
  ├─ chains      (one row per employer)
  ├─ events      (one row per detected email event)
  ├─ messageIndex (de-duplication / processed flag)
  └─ accounts    (OAuth connection metadata)
      │
      ▼
 React UI (420 × 620 popup window)
  └─ dark card list, pipeline progress bars, expandable event timelines
```

### Key architectural decisions

| Concern | Approach |
|---|---|
| Extension type | Chrome Manifest V3 |
| Background execution | MV3 Service Worker with `chrome.alarms` for periodic sync (no keep-alive hacks) |
| Auth | `chrome.identity.getAuthToken` — Chrome manages token caching and refresh; no PKCE, no client secret in the bundle |
| Storage | IndexedDB via `idb` — structured, queryable, survives service worker restarts |
| Sync strategy | Bootstrap (first run, up to 500 messages) → incremental via Gmail History API on subsequent runs; falls back to bootstrap if history expires |
| Concurrency guard | A `emailchain_syncing` flag in `chrome.storage.local` prevents overlapping sync runs |
| UI delivery | A dedicated `chrome.windows.create` popup (not a sidebar or overlay) keeps the UI independent of whatever tab the user is on |

---

## 🖥️ UI Description

The popup window (`420 × 620 px`) uses a deep dark theme (`#0f1117` background) with a frosted-glass sticky header and colour-coded cards.

**Header bar**
- Violet-to-indigo gradient icon badge
- Connected Gmail address and active application count pill
- Last-sync timestamp (relative, e.g. "2 min ago")
- Spinning refresh button and settings gear

**Application cards** (one per employer, sorted by urgency)

Each card shows:
- Company initials avatar with a coloured left-edge accent bar
- Company name and role title
- Status badge (colour per stage — see table below)
- A four-segment pipeline progress bar: `Applied → Assessment → Interviewing → Offer`
- An amber deadline alert (`⏰ Due in 18h`) when an upcoming due date is detected

| Status | Colour |
|---|---|
| Interviewing | Violet |
| Assessment | Amber |
| Offer | Emerald |
| Applied | Indigo |
| Rejected / Ghosted / Withdrawn | Muted grey / red |

**Expanded timeline** (tap any card to open)

A vertical connected timeline lists every detected email event in chronological order, each with:
- Icon dot on the timeline spine (📨 📝 🎙 🎉 ✗ ⏰)
- Event type label and relative timestamp
- Quoted evidence snippet (the matched text from the email body)
- Deadline timestamp in amber if applicable

**Empty / unauthenticated states**

- First launch shows a centred "Connect your Gmail" CTA that routes to the options page
- Post-connect, empty state shows a clipboard icon with "Sync will pick up job emails automatically"

---

## 🚀 Setup Guide

### Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18 + |
| npm | 9 + |
| Google Chrome | 114 + (MV3 support) |
| Google account | For Gmail API access |

### 1. Clone and install

```bash
git clone https://github.com/your-username/jobflow.git
cd jobflow
npm install
```

### 2. Google Cloud Console setup

#### a. Create a project

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and click **New Project**.
2. Give it any name (e.g. `JobFlow`) and click **Create**.

#### b. Enable the Gmail API

1. In the left menu go to **APIs & Services → Library**.
2. Search for `Gmail API` and click **Enable**.

#### c. Configure the OAuth consent screen

1. Go to **APIs & Services → OAuth consent screen**.
2. Choose **External** (for personal use) and click **Create**.
3. Fill in the required fields (App name, support email, developer email).
4. On the **Scopes** step, add:
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
5. On the **Test users** step, add your own Google account.
6. Save and continue through to the end.

#### d. Create a Chrome Extension OAuth client

1. Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
2. Select **Chrome Extension** as the application type.
3. For the **Item ID**, paste your unpacked extension ID from `chrome://extensions`.
   - Load the extension first (step 5 below) to get the ID, then come back and fill this in.
4. Click **Create** and copy the **Client ID**.

> **Note:** Chrome Extension OAuth clients do not use a client secret. The `chrome.identity` API handles the full OAuth flow securely through Chrome's profile.

### 3. Configure environment variables

Create a `.env` file at the project root:

```ini
VITE_GOOGLE_CLIENT_ID=123456789-yourkey.apps.googleusercontent.com
```

This value is embedded into `vite.config.ts` via `manifest.oauth2.client_id` at build time.

### 4. Build the extension

```bash
# Development build with watch mode
npm run dev

# Production build
npm run build
```

The compiled extension is output to the `dist/` directory.

### 5. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the `dist/` folder.
4. Copy the **Extension ID** shown on the card.
5. Return to Google Cloud Console (step 2d) and paste the ID into your OAuth client, then save.
6. Click the JobFlow icon in the Chrome toolbar to open the popup.
7. Go to the **Settings** page (gear icon) and click **Connect Gmail** to authorise.

---

## 🔍 How Detection Works

### The pipeline (5 steps per email)

```
1. detectEvent()        →  classify email → EventType + confidence (0–1)
2. extractEntities()    →  pull company, role, recruiter, deadline from text
3. eventTypeToStatus()  →  map EventType → ChainStatus
4. findOrCreateChain()  →  match by domain/company or create new Chain row
5. insertEvent()        →  write AppEvent to IndexedDB
```

### Detected event types

| Event type | What triggers it |
|---|---|
| `APPLICATION_RECEIVED` | "We received your application", "Thank you for applying", ATS confirmation emails |
| `INTERVIEW_INVITE` | "Schedule an interview", Calendly links, Zoom/Teams meeting links, "phone screen" |
| `ASSESSMENT_INVITE` | HackerRank / Codility / CodeSignal links, "take-home assignment", "coding challenge" |
| `OFFER` | "Offer of employment", "compensation package", "sign offer letter" |
| `REJECTION` | "We're not moving forward", "we regret to inform", "position has been filled" |
| `DEADLINE` | "Due by", "complete before", "respond no later than", "expires on" |

### Rule-based approach

Each event type has a `DetectionRule` with three pattern sets:

```typescript
interface DetectionRule {
  eventType: EventType;
  weight: number;          // Contribution to confidence score (0–1)
  subjectPatterns: RegExp[];
  bodyPatterns: RegExp[];
  fromPatterns: RegExp[];  // ATS senders: greenhouse, lever.co, workday, etc.
  requiredMatches: number; // Minimum hits to fire
}
```

The detector scores each rule against the email's subject, body, and sender, sums weighted hits, and returns the highest-confidence match above a minimum threshold.

### Deadline extraction with chrono-node

`extractEntities()` uses [chrono-node](https://github.com/wanasit/chrono) to parse free-text date expressions from the email body:

```
"Please complete the assessment by Friday, March 14th at 11:59 PM EST"
                                        ↓ chrono-node
                                  Unix timestamp (ms)
```

Deadlines within 7 days of the email's received date trigger a `chrome.alarms` entry that fires a Chrome notification 24 hours before expiry.

### Gmail search query (bootstrap)

On first run, JobFlow searches Gmail with:

```
newer_than:6m (
  subject:(application OR interview OR rejection OR offer OR assessment OR ...)
  OR from:(greenhouse.io OR lever.co OR workday.com OR smartrecruiters.com OR ...)
)
```

This scopes the initial fetch to the last 6 months and a curated set of ATS senders, keeping the bootstrap under 500 messages. Subsequent syncs use the **Gmail History API** to fetch only new messages since the last known `historyId`.

---

## 🗄️ Data Model

### `Chain`

One row per employer. The source of truth for an application's current stage.

```typescript
interface Chain {
  chain_id: string;           // UUID
  canonical_company: string;  // Normalised employer name
  role_title: string;         // Extracted job title
  status: ChainStatus;        // Current pipeline stage
  last_event_at: number;      // Unix ms — used for sorting
  confidence: number;         // 0.0–1.0 — detection confidence
  created_at: number;         // Unix ms
  account_id: string;         // FK to AccountConnection
}

type ChainStatus =
  | "APPLIED" | "ASSESSMENT" | "INTERVIEWING"
  | "OFFER"   | "REJECTED"   | "GHOSTED" | "WITHDRAWN";
```

Chain status follows a forward-only state machine — a chain can only advance to a later stage, never regress (e.g. an offer email won't downgrade a chain that's already at `OFFER`).

### `AppEvent`

One row per detected email. The immutable audit log.

```typescript
interface AppEvent {
  event_id: string;         // UUID
  chain_id: string;         // FK to Chain
  event_type: EventType;    // Detected category
  event_time: number;       // Unix ms (email received date)
  due_at: number | null;    // Unix ms (parsed deadline, if any)
  evidence: string;         // Matched text snippet shown in UI
  extracted_entities: {
    company_raw?: string;
    role_raw?: string;
    recruiter_name?: string;
    deadline_raw?: string;
    links?: string[];
  };
  msg_id_internal: string;  // FK to MessageIndex (de-dup key)
  extraction_version: number;
}
```

### `AccountConnection`

One row per connected Gmail account.

```typescript
interface AccountConnection {
  account_id: string;
  provider_type: "gmail";
  email: string;
  scopes_granted: string[];
  connected_at: number;
  last_sync_at: number | null;
  last_history_id: string | null;  // Gmail History API cursor
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Extension runtime | Chrome Manifest V3 |
| Build tool | [Vite 5](https://vitejs.dev) + [@crxjs/vite-plugin](https://crxjs.dev) |
| UI framework | [React 18](https://react.dev) |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) |
| Local database | [idb](https://github.com/jakearchibald/idb) (IndexedDB wrapper) |
| Date parsing | [chrono-node](https://github.com/wanasit/chrono) |
| Auth | `chrome.identity` API (built-in, no library needed) |
| Extension polyfill | [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) |

---

## 📁 Project Structure

```
EmailChain/
├── src/
│   ├── background/
│   │   ├── serviceWorker.ts      # MV3 entry point — registers all listeners
│   │   ├── alarmHandler.ts       # Handles chrome.alarms (sync + deadline notifications)
│   │   ├── installHandler.ts     # First-install setup (creates alarm, bootstrap)
│   │   └── messageHandler.ts     # chrome.runtime.onMessage dispatcher
│   │
│   ├── auth/
│   │   ├── oauthFlow.ts          # connectGmail / disconnectGmail
│   │   └── tokenStore.ts         # Wraps chrome.identity.getAuthToken
│   │
│   ├── gmail/
│   │   ├── sync.ts               # Main sync orchestrator (bootstrap + incremental)
│   │   ├── client.ts             # Gmail REST API wrapper (listMessages, listHistory, …)
│   │   └── parser.ts             # Decodes raw Gmail message → ParsedMessage
│   │
│   ├── detection/
│   │   ├── rules.ts              # DetectionRule definitions for all EventTypes
│   │   ├── detector.ts           # Scores rules, returns best DetectionResult
│   │   ├── entityExtractor.ts    # Extracts company, role, deadline (chrono-node)
│   │   ├── chainMatcher.ts       # Finds or creates Chain in IDB; manages status FSM
│   │   └── pipeline.ts           # Orchestrates steps 1–5 per email
│   │
│   ├── db/
│   │   ├── index.ts              # IDB schema & migrations
│   │   ├── accounts.ts           # AccountConnection CRUD
│   │   ├── chains.ts             # Chain CRUD
│   │   ├── events.ts             # AppEvent CRUD
│   │   └── messageIndex.ts       # MessageIndex CRUD (de-duplication)
│   │
│   ├── window/
│   │   ├── window.html           # Entry HTML for standalone popup window
│   │   ├── main.tsx              # React root mount
│   │   └── App.tsx               # Full UI: header, card list, timeline
│   │
│   ├── options/
│   │   ├── options.html          # Settings page (opened in a tab)
│   │   └── Options.tsx           # Connect/disconnect Gmail, manual sync trigger
│   │
│   ├── types/
│   │   ├── chain.ts              # Chain, ChainStatus, STATUS_ORDER
│   │   ├── event.ts              # AppEvent, EventType
│   │   └── account.ts            # AccountConnection
│   │
│   └── shared/
│       ├── constants.ts          # Alarm names, DB name, API URLs, sync config
│       ├── messages.ts           # Typed sendMessage helper
│       ├── utils.ts              # formatRelativeTime, formatDeadline
│       └── logger.ts             # Thin console wrapper (dev-only verbosity)
│
├── public/
│   └── icons/                    # icon16/32/48/128.png
│
├── vite.config.ts                # Vite + crxjs manifest definition
├── tailwind.config.js
├── tsconfig.json
├── .env                          # VITE_GOOGLE_CLIENT_ID (git-ignored)
└── package.json
```

---

## 🔒 Privacy

JobFlow is built on a **local-first** principle. Here's exactly what it does and does not do.

### What it reads

- Gmail messages matching a job-specific search query (subjects and senders related to applications, interviews, offers, and assessments)
- Your Google account email address (to label the connected account in the UI)

### What it does NOT do

- Send any email content to an external server — there is no backend
- Read sent mail, drafts, calendar, contacts, or any non-job email
- Store tokens outside of Chrome's own secure token cache (`chrome.identity`)
- Track usage, analytics, or telemetry of any kind
- Sync data across devices or to the cloud

### Storage

All structured data (chains, events, message index) is stored exclusively in **IndexedDB** inside the Chrome extension's storage sandbox. It is not accessible to websites and is deleted when the extension is uninstalled.

### Permissions declared in the manifest

| Permission | Reason |
|---|---|
| `storage` | Sync state flags (`emailchain_syncing`, `emailchain_last_sync_at`) |
| `alarms` | 30-minute sync cadence and deadline notification scheduling |
| `identity` / `identity.email` | OAuth token acquisition and email address lookup |
| `notifications` | Deadline reminder alerts |
| `https://www.googleapis.com/*` | Gmail REST API and userinfo endpoint |

---

## 🗺️ Roadmap

- [ ] **Multi-account support** — connect more than one Gmail address
- [ ] **Manual chain editing** — rename company, override status, dismiss a chain
- [ ] **Ghosting detection** — automatically flag applications with no activity after 3–4 weeks
- [ ] **Export to CSV** — one-click export of all chains and events
- [ ] **Statistics dashboard** — response rates, average time-to-rejection, funnel visualisation
- [ ] **Recruiter contact tracking** — extract recruiter names and email addresses per chain
- [ ] **Outlook / Microsoft 365 support** — second provider via Microsoft Graph API
- [ ] **Firefox port** — MV3 compatible Manifest adaptation
- [ ] **AI-assisted extraction** — optional local LLM (WebLLM) to improve entity extraction accuracy
- [ ] **Notification snooze** — dismiss deadline alerts for a set period from the notification itself

---

## 🤝 Contributing

Contributions are welcome. Please open an issue before starting work on a significant change so we can discuss the approach.

```bash
# Run the dev build with hot module replacement
npm run dev

# Type-check without emitting files
npm run type-check

# Lint
npm run lint
```

**Branch naming:** `feat/short-description`, `fix/short-description`, `chore/short-description`

**Commit style:** conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)

Please do not commit the `.env` file or any file containing your `VITE_GOOGLE_CLIENT_ID`.

---

## 📄 License

MIT © 2024 — see [LICENSE](./LICENSE) for full text.

---

<p align="center">
  Built with React, Vite, and the Gmail API &nbsp;·&nbsp; No server required &nbsp;·&nbsp; Your data stays yours
</p>
