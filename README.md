# DRMC Tech Club — Fest & Event Platform

Club fest directory + event registration + organizer dashboard. Built for the 9th DRMC International Tech Carnival 2026 — AI Web Development Contest.

## Project description

Student organizations run fests with many events, but registration usually lives in scattered Google Forms. This platform replaces that: one directory of fests and events, direct per-event registration with capacity and deadline enforcement, confirmation tickets, self-service "My registrations", and an organizer dashboard (participants, status management, stats, CSV export).

Hierarchy: `Organization → Fest → Event → Registration`.

## Features

- **Fest directory (public):** published fests grid, event cards with seats-left/deadline badges, search, category filter, open-only toggle, fest detail pages.
- **Registration system:** validated form (React + Zod server-side), duplicate protection per event+email, capacity/deadline gates with distinct error codes, confirmation ticket with `.ics` add-to-calendar, "My registrations" email lookup with cancel, waitlist for full events.
- **Organizer management:** role-guarded dashboard (KPIs + fill-rate bars + recent signups), fest/event creation, per-event participant table with search + status filter, approve/reject/cancel/check-in, CSV export, user & role management.
- **Accounts & roles:** public signup (participant), DB-backed login (scrypt hashes), sessions as access-token → user mapping in a memory cache read-through to the DB. Guests can still register and look up by email; cancelling a guest booking needs email + phone. Participants see only their own bookings; organizers see all.
- **Bonus:** printable ticket card, waitlist + promote (via status change), CSV export, urgency badges, `.ics` download.

## Tech stack

Next.js 14 (App Router, TypeScript) · Tailwind CSS · Prisma (SQLite locally, Postgres-ready) · Zod · Single-origin monorepo (`/` frontend, `/api/v1/*` backend, no proxy).

## Setup instructions

```bash
cp .env.example .env   # DATABASE_URL points at ~/.ditc/db/ditc.db
npm install
npm run setup   # mkdir + prisma generate + db push + seed
npm run dev     # http://localhost:3000
```

Build: `npm run build` · Start: `npm start`.

The SQLite file lives outside the repo at `~/.ditc/db/ditc.db` (created by `npm run setup`), so the database survives checkouts and never lands in git.

To use Postgres (Neon/Supabase) instead of SQLite: set `DATABASE_URL` to the Postgres URL and change `datasource db.provider` in `prisma/schema.prisma` to `"postgresql"`, then re-run `npm run setup`.

## Deployment URL

TODO: add live URL after deploy.

### Deploy on Render (recommended)

1. Push this repo to GitHub (done: `ASAYMAN69/ditc`).
2. Render Dashboard → New → Blueprint → select the repo (`render.yaml` wires a free web service + free Postgres).
3. When prompted, paste `GEMINI_API_KEY` (and optionally `OPENROUTER_API_KEY`).
4. After the first deploy, open a Render Shell on the web service and seed once: `node prisma/seed.mjs`.
5. Put the live URL here and in the contest submission form.

Notes: the repo stays on SQLite for local dev — the Blueprint flips the Prisma provider to Postgres at build time only. Free services sleep after 15 min idle (first visit takes ~1 min to wake); free Postgres expires 30 days after creation, which covers October judging. For Vercel instead: point `DATABASE_URL` at any Postgres (e.g. Neon) and set the same env vars.

## Demo credentials

- Organizer: `organizer@demo.local` / `Organizer123!`
- Participant: `participant@demo.local` / `Participant123!` (or create your own at `/signup`)
- Guest flow needs no login: register with any email, then look it up under "My registrations" (cancelling asks for the booking phone too).

## Third-party services/APIs

None required. Database: SQLite file locally (or Postgres via `DATABASE_URL`). No email/SMS vendors (confirmation is on-screen + `.ics`).

## AI tools/features used

- In-product AI (user-facing): event Q&A assistant + organizer description helper, powered by Google Gemini (primary) with OpenRouter fallback. Set `GEMINI_API_KEY` (and optionally `OPENROUTER_API_KEY`) in `.env` to enable; without keys both features show an honest "AI is off" state. Only public catalog data is ever sent to the provider — no participant names, emails, or phones.
- Built with AI coding assistance (agent-built Next.js + Prisma scaffold, AI-drafted copy). Organizer "New event" descriptions can be drafted with any LLM and pasted in.

## Screenshots

TODO: add screenshots of directory, event page, dashboard.

## Known limitations

- Auth is email + password with scrypt hashes (no OAuth). Sessions live in a server memory cache backed by a DB table; a multi-instance deploy should pin to one instance or move sessions fully to the DB.
- Roles are fixed at account creation (public signup always yields participant; organizers are seeded or created by an organizer).
- SQLite is the default for zero-config judging; switch to Postgres for concurrent production use.
- Confirmation "email" is on-screen + `.ics` (no SMTP wired).
- Analytics are computed from registration rows (no separate warehouse).

## License

MIT — see `LICENSE`.
