# QuickMove Operations Hub

QuickMove is a full-stack operations dashboard for managing relocations, tasks,
on-ground blockers, and AI-assisted operations workflows. The browser
application uses the backend API as its source of truth; records are persisted
in Supabase rather than mock data or browser local storage.

## Current workflow

1. **Relocation Pipeline** - Create, edit, filter, and delete relocation
   records. City labels are normalized against the configured hub network.
2. **Task Center** - Select an existing relocation from the live dropdown
   (`Customer Name — Relocation ID`) before creating a task. The backend
   validates the relocation ID and derives the customer and route from that
   record.
3. **Blockers & Failures** - Report a blocker against an existing relocation,
   assign it to an Ops Lead, and track it under Active Blockers. Resolution
   requires notes and records the resolver and timestamp before moving the
   blocker to Resolved History.
4. **Operations dashboard** - Counts, filters, Ops Lead lists, task records,
   and blocker records are derived from the same API-loaded data.
5. **AI Operations Assistant** - Submit an operational message to the backend
   Groq integration, review the extracted task/blocker details, and explicitly
   confirm before creating a persisted record.

The current implementation does **not** include provider capacity reservation,
worker/vehicle conflict checking, or a dedicated Ops Lead directory. Provider
allocation must not be treated as confirmed unless the backend returns an
explicit verified assignment.

## Tech stack

- React 18, TypeScript, Vite, Tailwind CSS, Lucide React
- Express, TypeScript, Supabase JavaScript client
- Supabase PostgreSQL for persistent storage
- Groq API for the AI operations assistant

## Run the project locally

### Prerequisites

- Node.js 18 or newer
- npm
- A Supabase project
- A Groq API key if AI parsing is required

### 1. Clone the repository

```bash
git clone https://github.com/shravya117/Quick_Move.git
cd Quick_Move
```

### 2. Configure the backend

Create `backend/.env` from the example:

```bash
cd backend
copy .env.example .env
```

On macOS/Linux, use `cp .env.example .env` instead of `copy`.

Set these values in `backend/.env`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
PORT=5000
```

Keep `backend/.env` private. It is ignored by Git and must never be committed.
The service-role key is used only by the backend and must not be placed in
frontend code.

### 3. Prepare Supabase

Run [`supabase/001_quickmove_persistence.sql`](./supabase/001_quickmove_persistence.sql)
in the Supabase SQL Editor if the `moves`, `tasks`, and `blockers` tables do
not already exist. The tables use `moves.id` as the parent relationship;
tasks and blockers are deleted with their relocation through the existing
foreign-key cascade.

The backend uses the Supabase service role, so the browser never connects
directly to Supabase. Do not add unrestricted anonymous policies for a
production deployment.

### 4. Install dependencies

Open two terminals from the repository root.

Terminal 1 - backend:

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Verify it with:

```text
http://localhost:5000/api/health
```

Terminal 2 - frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

If the backend uses another URL or port, set
`VITE_API_BASE_URL`, for example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Production builds

```bash
cd backend
npm run build
npm start
```

In another terminal:

```bash
cd frontend
npm run build
npm run preview
```

## API routes

- `GET|POST /api/moves`
- `GET|PUT|DELETE /api/moves/:id`
- `GET|POST /api/tasks`
- `PUT|DELETE /api/tasks/:id`
- `GET|POST /api/blockers`
- `PUT|DELETE /api/blockers/:id`
- `POST /api/ai/parse-message`
- `GET /api/health`

## Project structure

```text
frontend/                 React/Vite dashboard
frontend/src/components/  Pipeline, task, blocker, and AI UI
frontend/src/utils/api.ts Browser-to-backend API client
backend/src/controllers/  Supabase-backed API handlers
backend/src/routes/       Express route definitions
backend/src/services/     Supabase and Groq integrations
supabase/                 Database setup and seed SQL
```

## Verification

Run the production checks from the repository root:

```bash
cd frontend
npm run build

cd ../backend
npm run build
```

Both commands must pass before deploying. Test persistence through the running
API and refresh the browser to confirm that changes are reloaded from Supabase.
