# JobTracker (GlanceAI)

Next.js + Supabase + Stripe + browser extension. **Edit only this repo.**

## Verify before done

| Check | Command |
|-------|---------|
| Types | `npm run type-check` |
| Web build | `npm run web:build` |
| Extension build | `npm run build` |
| Local web | `npm run web:dev` → http://localhost:3000 |

## Guardrails

- `.env.local` only — never commit API keys or Supabase service role
- Auth/RLS changes need explicit test steps (login flow, protected route)
- Stripe: test mode keys only unless user says production

## Session discipline

Follow `../.agent/SESSION_CHECKLIST.md`. Before edits: state goal + success command. After redirects: verify once before new tasks.
