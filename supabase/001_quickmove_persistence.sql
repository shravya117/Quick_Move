-- Run this migration in Supabase SQL Editor before starting the API.
-- The JSONB payload preserves the existing rich dashboard model while the
-- scalar columns support relationships, ordering, and phase persistence.

create table if not exists public.moves (
  id text primary key,
  client_name text not null,
  origin_city text not null,
  destination_city text not null,
  move_date date not null,
  status text not null,
  priority text not null,
  assigned_team text not null,
  current_phase text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.moves add column if not exists current_phase text;
alter table public.moves add column if not exists payload jsonb not null default '{}'::jsonb;
update public.moves set current_phase = coalesce(current_phase, status, 'Apartment Shortlist') where current_phase is null;
alter table public.moves alter column current_phase set not null;

create table if not exists public.tasks (
  id text primary key,
  move_id text not null references public.moves(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'pending',
  due_date date,
  assigned_to text not null default '',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.tasks add column if not exists payload jsonb not null default '{}'::jsonb;

create table if not exists public.blockers (
  id text primary key,
  move_id text not null references public.moves(id) on delete cascade,
  title text not null,
  description text not null default '',
  severity text not null default 'medium',
  status text not null default 'open',
  assigned_to text not null default '',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.blockers add column if not exists payload jsonb not null default '{}'::jsonb;
create index if not exists moves_current_phase_idx on public.moves(current_phase);
create index if not exists tasks_move_id_idx on public.tasks(move_id);
create index if not exists blockers_move_id_idx on public.blockers(move_id);

-- The application accesses Supabase through the backend service role only.
-- Keep RLS enabled and do not create unrestricted browser-facing policies.
alter table public.moves enable row level security;
alter table public.tasks enable row level security;
alter table public.blockers enable row level security;
