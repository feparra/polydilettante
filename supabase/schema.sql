-- ==============================================================================
-- POLYDILETTANTE MASTER SCHEMA (Supabase PostgreSQL)
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Nodes Table (Stores knowledge nodes, visual positions and rich metadata)
create table if not exists public.nodes (
  id text primary key,
  category text not null check (category in ('quant', 'engineering', 'mechanics', 'ai', 'software')),
  title_es text not null,
  title_en text not null,
  tags text[] not null default '{}',
  simulator_id text not null,
  connections text[] not null default '{}',
  position_x numeric not null default 0,
  position_y numeric not null default 0,
  metaphor_es text not null,
  metaphor_en text not null,
  anatomy_engine_es text not null,
  anatomy_engine_en text not null,
  anatomy_failure_es text not null,
  anatomy_failure_en text not null,
  anatomy_rule_es text not null,
  anatomy_rule_en text not null,
  case_standard_es text not null,
  case_standard_en text not null,
  case_edge_es text not null,
  case_edge_en text not null,
  case_crosspollination_es text not null,
  case_crosspollination_en text not null,
  blueprint_code text not null,
  blueprint_lang text not null default 'typescript',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Telemetry / Interaction Logs (Kinesthetic Playground events)
create table if not exists public.simulator_telemetry (
  id uuid primary key default uuid_generate_v4(),
  node_id text references public.nodes(id) on delete cascade,
  session_id text,
  parameters jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.nodes enable row level security;
alter table public.simulator_telemetry enable row level security;

-- 5. Policies on Nodes Table
create policy "Nodes are viewable by everyone" 
  on public.nodes 
  for select 
  to anon, authenticated 
  using (true);

create policy "Allow insert on nodes"
  on public.nodes
  for insert
  to anon, authenticated
  with check (true);

create policy "Allow update on nodes"
  on public.nodes
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- 6. Telemetry Insert Policy
create policy "Anyone can insert telemetry logs" 
  on public.simulator_telemetry 
  for insert 
  to anon, authenticated 
  with check (true);
