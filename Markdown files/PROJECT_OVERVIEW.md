# Mental Health Sentiment Journal — Project Overview

> **Last updated:** March 2026

---

## What Is This Project?

A **full-stack journaling web application** focused on mental health. Users write journal entries, and the app analyses their mood using AI (via **n8n** automation workflows). It provides:

- A rich **journal editor** with real-time AI mood suggestions
- An **AI coach / chat** that discusses entries with the user
- A **dashboard** with mood statistics, charts, and wellness tracking
- **Sentiment analysis** that automatically detects mood after saving an entry
- Trends, analysis, and therapist-locator pages (planned)

---

## Tech Stack

| Layer             | Technology                                         |
| ----------------- | -------------------------------------------------- |
| **Framework**     | Next.js 16 (App Router)                            |
| **Language**      | TypeScript                                         |
| **React**         | v19.2                                              |
| **ORM**           | Prisma (PostgreSQL)                                |
| **Database**      | Supabase (hosted Postgres)                         |
| **Auth**          | Supabase Auth (JWT), Google OAuth + email/password |
| **Data Fetching** | SWR 2.3 (hooks) + native `fetch` mutations         |
| **Styling**       | Tailwind CSS v4                                    |
| **Charts**        | Recharts                                           |
| **Animations**    | Framer Motion, Three.js (ambient background)       |
| **AI Automation** | n8n (self-hosted or cloud)                         |
| **Deployment**    | Vercel                                             |

---

## Project Structure (post-migration)

```text
/
├── prisma/
│   └── schema.prisma          # Database schema (6 models, 3 enums)
├── src/
│   ├── proxy.ts                # Next.js 16 middleware (auth redirect logic)
│   ├── app/
│   │   ├── layout.tsx          # Root layout (Geist font, providers)
│   │   ├── page.tsx            # Landing / marketing page
│   │   ├── login/page.tsx      # Login page
│   │   ├── signup/page.tsx     # Signup page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      # Dashboard shell (sidebar + header)
│   │   │   ├── page.tsx        # Dashboard home (stats, chart, widgets)
│   │   │   ├── journal/page.tsx      # Journal editor (write new entries)
│   │   │   ├── entries/page.tsx      # Entry list (search, filter, view)
│   │   │   ├── chat/page.tsx         # AI chat page
│   │   │   ├── trends/page.tsx       # Mood trends (placeholder)
│   │   │   ├── analysis/page.tsx     # Analysis (placeholder)
│   │   │   ├── therapist/page.tsx    # Find therapist (placeholder)
│   │   │   └── settings/page.tsx     # Settings (partially functional)
│   │   └── api/                # REST API routes (15 endpoints)
│   │       ├── auth/me/route.ts
│   │       ├── entries/route.ts            # GET (list) + POST (create)
│   │       ├── entries/[id]/route.ts       # GET + PUT + DELETE
│   │       ├── entries/stats/route.ts      # GET mood statistics
│   │       ├── entries/suggest-mood/route.ts  # POST → n8n mood suggestion
│   │       ├── entries/mood-trends/route.ts   # GET mood over time
│   │       ├── chats/route.ts              # GET (list) + POST (create)
│   │       ├── chats/[id]/route.ts         # GET single chat
│   │       ├── chats/send/route.ts         # POST message → n8n AI chat
│   │       ├── chats/contextual/route.ts   # POST contextual chat from entry
│   │       ├── quotes/route.ts             # GET + POST
│   │       ├── quotes/random/route.ts      # GET random quote
│   │       └── webhooks/sentiment/route.ts # POST callback from n8n
│   └── lib/
│       ├── prisma.ts           # Prisma singleton
│       ├── auth/
│       │   ├── api.ts          # Server-side auth helper (JWT verification)
│       │   └── webhook.ts      # Webhook secret verification
│       ├── fetcher.ts          # SWR fetcher (attaches Supabase token)
│       ├── mutations.ts        # Mutation helpers (POST/PUT/DELETE with auth)
│       └── use-api.ts          # SWR hooks (useEntries, useChats, etc.)
├── package.json
├── .env                        # Environment variables (gitignored)
├── .env.example                # Template for env vars
└── vercel.json                 # Vercel deployment config
```

---

## Database Schema

**6 Models:**

| Model        | Purpose                                                                    |
| ------------ | -------------------------------------------------------------------------- |
| `User`       | Mirrors Supabase Auth user (id, email, displayName, avatarUrl)             |
| `Entry`      | Journal entries (title, content, mood, moodLabels[], sentimentScore)       |
| `Attachment` | File attachments on entries (schema only — no UI yet)                      |
| `Chat`       | AI chat sessions (optionally linked to an entry via `contextEntryId`)      |
| `Message`    | Individual messages in a chat (role: USER/ASSISTANT/SYSTEM)                |
| `Quote`      | Motivational quotes (content, author, type: MOTIVATIONAL/MINDFULNESS/etc.) |

**3 Enums:** `Mood` (7 values: Happy, Calm, Sad, Anxious, Angry, Confused, Meh), `MessageRole`, `QuoteType`

---

## How n8n Is Used

The app uses **three n8n webhook workflows** to handle AI processing. n8n is an external automation platform — the app sends HTTP requests to it and receives AI-generated responses.

### 1. Sentiment Analysis (fire-and-forget)

- **When:** User saves a new journal entry (`POST /api/entries`)
- **Flow:** API route fires a `fetch()` to n8n and does **not** await the response
- **n8n workflow:** Receives entry text → runs sentiment analysis (e.g., via OpenAI/Gemini) → calls back to `POST /api/webhooks/sentiment` with the result
- **Callback:** The webhook route updates the entry's `mood`, `moodLabels[]`, and `sentimentScore` in the database
- **Env var:** `N8N_WEBHOOK_URL` — the full URL to the sentiment webhook
- **Webhook secret:** `N8N_WEBHOOK_SECRET` — the callback includes this in the `x-webhook-secret` header for verification

### 2. Mood Suggestions (synchronous)

- **When:** User clicks "Get AI Mood Suggestions" in the journal editor
- **Flow:** `POST /api/entries/suggest-mood` → sends entry content to n8n → **awaits** response → returns mood suggestions to the frontend
- **n8n workflow:** Receives text → analyses mood → returns suggested mood labels
- **Env var:** `N8N_MOOD_SUGGEST_WEBHOOK_URL` in `.env`
- **⚠️ BUG:** Code reads `process.env.N8N_MOOD_SUGGESTION_URL` but `.env` defines `N8N_MOOD_SUGGEST_WEBHOOK_URL` — the variable name doesn't match (see Known Bugs below)

### 3. AI Chat (synchronous)

- **When:** User sends a message in the AI chat page, or opens a contextual chat from a journal entry
- **Flow:** `POST /api/chats/send` or `POST /api/chats/contextual` → sends message + chat history + optional entry context to n8n → **awaits** AI response → saves to DB → returns to frontend
- **n8n workflow:** Receives conversation context → generates AI therapist-style response
- **Env var:** `N8N_CHAT_WEBHOOK_URL` in `.env`
- **⚠️ BUG:** Code reads `N8N_WEBHOOK_URL` (the sentiment URL) and appends `/webhook/ai-chat`, which is incorrect. It should use `N8N_CHAT_WEBHOOK_URL` directly (see Known Bugs below)

---

## Page-by-Page Breakdown

### Fully Functional Pages ✅

#### Landing Page (`/`)

Marketing page with hero section, feature showcase, tech stack display, and call-to-action buttons. Includes Three.js ambient background animation.

#### Login (`/login`) & Signup (`/signup`)

Full authentication with email/password and Google OAuth via Supabase. Proper error handling and redirect to dashboard on success.

#### Dashboard Home (`/dashboard`)

- **StatsCards** — Shows total entries, average sentiment, current streak, and most common mood. Data from `GET /api/entries/stats`. ✅ Fully wired.
- **MoodChart** — Recharts area chart showing mood trends over time. Data from `GET /api/entries/mood-trends`. ✅ Fully wired.
- **QuoteCard** — ❌ **Static** — displays a hardcoded quote. The API (`GET /api/quotes/random`) exists but is not called.
- **WellnessGoals** — ❌ **Static** — displays hardcoded goals. No backend persistence.
- **RecentEntries** — ❌ **Not rendered** — component exists with hardcoded data but is not imported into the dashboard page.

#### Journal Editor (`/dashboard/journal`)

Full-featured rich text editor for writing new entries. ✅ Fully functional:

- Save entries (POST /api/entries)
- AI mood suggestion button (calls n8n)
- AI coach bubble (floating helper)
- Companion animation (mood-reactive character)
- Tags and title support

#### Entries List (`/dashboard/entries`)

Browse, search, and filter all journal entries. ✅ Fully functional:

- Search by title/content
- Filter by mood
- Click to expand entry details
- Edit and delete entries
- Mood icons with colour coding
- Chat button to start contextual AI chat about an entry

#### AI Chat (`/dashboard/chat`)

Chat with an AI mental health coach. ✅ Fully functional:

- Start new conversation
- View chat history (list of past chats)
- Send messages and receive AI responses via n8n
- Contextual chat (opened from an entry, provides entry context to AI)
- Message persistence in database

### Placeholder / Incomplete Pages ❌

#### Trends (`/dashboard/trends`)

**Status: Static placeholder**

- Displays hardcoded mood data in charts
- The API endpoint (`GET /api/entries/mood-trends`) and SWR hook (`useMoodTrends`) both exist and work
- **Work needed:** Replace hardcoded `weeklyData`/`monthlyData` arrays with real data from `useMoodTrends()` hook. Wire up the period selector (week/month/year).

#### Analysis (`/dashboard/analysis`)

**Status: Fully static**

- All text is hardcoded ("Your mood has been generally positive...")
- Shows fake insight cards and a fake mood breakdown
- **Work needed:** Design what analysis means (e.g., aggregate sentiment stats, mood patterns, word clouds). Build API endpoints and wire up real data. This is essentially a new feature to build from scratch.

#### Find Therapist (`/dashboard/therapist`)

**Status: Fully static**

- Shows 3 hardcoded therapist cards with fake data
- Search bar does nothing
- **Work needed:** Decide on data source (external API? user-submitted? static directory?). Build search/filter functionality. This is a significant feature requiring external data integration.

#### Settings (`/dashboard/settings`)

**Status: Partially functional**

- ✅ Sign Out button works
- ❌ Update Profile (name, email) — form exists but no API call
- ❌ Change Password — form exists but no API call
- ❌ Theme Toggle — UI exists but not connected
- ❌ Notification Preferences — form exists but no persistence
- **Work needed:** Wire profile update to Supabase Auth, implement password change, connect theme to a context/cookie, add notification preferences to User model or local storage.

---

## Feature Completeness Summary

| Feature                             | Status         | Notes                                      |
| ----------------------------------- | -------------- | ------------------------------------------ |
| Authentication (login/signup/OAuth) | ✅ Complete    | Google OAuth + email/password              |
| Journal Editor                      | ✅ Complete    | Save, tags, AI mood suggestions            |
| Entry CRUD                          | ✅ Complete    | Create, read, update, delete               |
| Entry Search & Filter               | ✅ Complete    | By title, content, and mood                |
| Sentiment Analysis (n8n)            | ✅ Complete    | Fire-and-forget + webhook callback         |
| AI Mood Suggestions (n8n)           | ⚠️ Bug         | Env var name mismatch                      |
| AI Chat (n8n)                       | ⚠️ Bug         | Wrong webhook URL construction             |
| Dashboard Stats                     | ✅ Complete    | Total entries, avg sentiment, streak       |
| Mood Chart                          | ✅ Complete    | Recharts area chart                        |
| Quote Widget                        | ❌ Static      | API exists, not wired to UI                |
| Wellness Goals Widget               | ❌ Static      | No backend at all                          |
| Recent Entries Widget               | ❌ Unused      | Component exists but not imported          |
| Trends Page                         | ❌ Static      | API + hook ready, UI uses hardcoded data   |
| Analysis Page                       | ❌ Placeholder | Needs full design and implementation       |
| Therapist Page                      | ❌ Placeholder | Needs external data source                 |
| Settings Page                       | ⚠️ Partial     | Only sign-out works                        |
| Attachments                         | ❌ Schema only | Prisma model exists, zero UI/API           |
| Dark Mode                           | ❌ Planned     | Theme toggle in settings but not connected |

---

## Known Bugs

### 1. Mood Suggestion Env Var Mismatch

- **File:** `src/app/api/entries/suggest-mood/route.ts` (line 17)
- **Problem:** Code reads `process.env.N8N_MOOD_SUGGESTION_URL`
- **But .env defines:** `N8N_MOOD_SUGGEST_WEBHOOK_URL`
- **Fix:** Change the code to read `process.env.N8N_MOOD_SUGGEST_WEBHOOK_URL`

### 2. Chat Webhook URL Construction

- **Files:** `src/app/api/chats/send/route.ts` (line 66), `src/app/api/chats/contextual/route.ts` (line 60)
- **Problem:** Code reads `N8N_WEBHOOK_URL` (which is the full sentiment URL, e.g., `http://localhost:5678/webhook/sentiment-analysis`) and then appends `/webhook/ai-chat` to it, resulting in a malformed URL
- **But .env defines:** A dedicated `N8N_CHAT_WEBHOOK_URL` variable
- **Fix:** Change the code to use `process.env.N8N_CHAT_WEBHOOK_URL` directly instead of constructing the URL

---

## What Work Remains

### High Priority (core functionality)

1. **Fix n8n env var bugs** (see Known Bugs above) — 10 mins
2. **Wire QuoteCard widget** — Call `GET /api/quotes/random` instead of hardcoded quote — 15 mins
3. **Wire Trends page** — Replace hardcoded data with `useMoodTrends()` hook, connect period selector — 1-2 hours
4. **Wire Settings page** — Connect profile update & password change to Supabase Auth — 2-3 hours

### Medium Priority (incomplete features)

5. **Wire RecentEntries widget** — Import into dashboard, fetch from `GET /api/entries?take=5` — 30 mins
6. **Wire WellnessGoals widget** — Decide persistence strategy (DB field or localStorage), build UI — 2-3 hours
7. **Build Analysis page** — Design analysis features, build API endpoints, create visualisations — 1-2 days
8. **Dark mode** — Implement theme context/provider, wire settings toggle — 2-3 hours

### Low Priority (nice-to-have)

9. **Therapist page** — Requires external data source decision and integration — 2-3 days
10. **Attachments** — Build upload UI, storage (Supabase Storage?), API routes — 1-2 days
11. **Notification system** — Email/push notifications for journaling reminders — 2-3 days

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Supabase Postgres)
DATABASE_URL=postgresql://postgres.xxx:password@host:port/postgres
DIRECT_URL=postgresql://postgres.xxx:password@host:port/postgres

# n8n Webhooks
N8N_WEBHOOK_URL=http://localhost:5678/webhook/sentiment-analysis
N8N_MOOD_SUGGEST_WEBHOOK_URL=http://localhost:5678/webhook/mood-suggestion
N8N_CHAT_WEBHOOK_URL=http://localhost:5678/webhook/ai-chat

# Webhook Security
N8N_WEBHOOK_SECRET=your-shared-secret
```

---

## How to Run

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Push schema to database (first time)
pnpm prisma db push

# Run dev server
pnpm dev
```

The app runs at `http://localhost:3000`.

---

## Previous Architecture (before migration)

The project was originally built as a **monorepo** with:

- `apps/api/` — NestJS + GraphQL backend
- `apps/web/` — Next.js frontend (Apollo Client)
- `packages/prisma/` — Shared Prisma schema
- `packages/shared/` — Shared utilities
- Turborepo for orchestration

This was **migrated** to a single Next.js application with API Routes (REST), SWR for data fetching, and a flat project structure. The NestJS, GraphQL, Apollo Client, and Turborepo layers were completely removed.
