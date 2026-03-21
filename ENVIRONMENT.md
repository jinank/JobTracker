# Rethinkjobs (Next.js) – environment variables

## Quick start (Reach Out / recruiters)

1. Copy **`cp .env.example .env.local`** (or merge into your existing `.env.local`).
2. Add **at least one** provider key below ( **`HUNTER_API_KEY`** is the simplest if Clay is paywalled).
3. Restart the Next dev server.

### Result limit (free API tiers)

- **`RECRUITER_MAX_RESULTS`** (optional, default **`5`**) — caps how many people Reach Out returns from Hunter, Apollo, Clay, and local fallbacks. Hunter’s free plan rejects large `limit` values; keeping this at **5** avoids pagination errors.

### Provider order

By default the API tries **`hunter` → `happenstance` → `apollo` → `clay`** and uses the **first** provider that returns people. Override with:

```env
REACH_OUT_PROVIDERS=clay,hunter,apollo
```

---

## Reach Out → Happenstance (optional, network search)

[Happenstance](https://happenstance.ai) searches **your professional graph** (connections and optional groups)—not the whole internet. It complements Hunter’s domain directory: good for **warm paths** when you have overlapping networks.

- **Quickstart / API:** [developer.happenstance.ai/quickstart](https://developer.happenstance.ai/quickstart)  
- **API key:** [happenstance.ai/api/keys](https://happenstance.ai/api/keys)

```env
HAPPENSTANCE_API_KEY="your_key"
# Optional: also search friends’ connections (default false)
# HAPPENSTANCE_INCLUDE_FRIENDS_CONNECTIONS=true
# Poll interval & max wait (ms) — search often completes in 30–60s
# HAPPENSTANCE_POLL_MS=4000
# HAPPENSTANCE_MAX_WAIT_MS=55000
```

**Important:** Results are scoped to the **Happenstance account that owns the API key**. In a multi-user product, every Rethinkjobs user shares that same graph unless you issue per-user keys or integrate Happenstance per account.

Searches run **asynchronously**; the server polls until `COMPLETED` or timeout (see env above). Uses credits per [Happenstance billing](https://developer.happenstance.ai/).

---

## Reach Out → Hunter.io (recommended alternative to Clay)

[Hunter.io](https://hunter.io) **Domain Search** lists people with emails found for a company domain (name, job title, LinkedIn when available). Free accounts include **limited** searches per month—check Hunter’s pricing.

1. Sign up at [hunter.io](https://hunter.io) → **API** → create an API key.
2. In `.env.local`:

```env
HUNTER_API_KEY="your_key"
```

Rethinkjobs calls `GET https://api.hunter.io/v2/domain-search?domain=...` using the guessed company domain. Results are **filtered** toward recruiter/HR-style titles when possible; if none match, it shows a broader slice of contacts at that domain with an info message.

---

## Reach Out → Apollo.io (optional)

Some Apollo API keys **cannot** use `mixed_people/api_search` on free plans (`API_INACCESSIBLE`). If yours works, set:

```env
APOLLO_API_KEY="your_key"
```

The app will skip Apollo automatically when Apollo returns that error and try the next provider in `REACH_OUT_PROVIDERS`.

---

## Reach Out → Clay (optional)

Clay often requires **paid credits** to return enrichment data. If you use a Clay table **webhook**:

- **`CLAY_WEBHOOK_URL`** – e.g. `https://app.clay.com/webhook/...` (alias: `CLAY_TABLE_WEBHOOK_URL`)
- **`CLAY_API_KEY`** (optional) – `Authorization: Bearer <key>` on the webhook request ([clay-gtm-cli](https://github.com/bcharleson/clay-gtm-cli) pattern)

### Get `CLAY_WEBHOOK_URL` in Clay

1. Open [app.clay.com](https://app.clay.com) → your workspace.
2. Create or open a table for “find people at company”.
3. Set the **source** to **Webhook** and copy the URL.
4. Paste into `.env.local`.

### Clay table contract

**Request body** (from Rethinkjobs):

```json
{
  "company": "Acme Corp",
  "domain": "acme.com",
  "recruiter_title_filters": ["recruiter", "hiring manager", "..."],
  "source": "rethinkjobs-reach-out"
}
```

**Response body** – include an array as `{ "people": [ ... ] }`, `{ "results": [ ... ] }`, or equivalent (see previous docs). For immediate UI updates, return people in the **same HTTP response** as the webhook (not only an async callback).

The API key under Clay **Settings → API key** is not a substitute for the table webhook URL.

---

## Merging with Gmail data

Whatever provider you use, recruiter names already extracted from **synced job emails** are **merged** in and de-duplicated when possible.
