-- ShieldCore initial schema (PostgreSQL / Supabase)
-- Run in Supabase SQL Editor. Then create a workspace and membership (see README).
create extension if not exists pgcrypto;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  plan text not null default 'demo' check (plan in ('demo','starter','growth','enterprise')),
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','analyst','member','viewer')),
  created_at timestamptz not null default now(),
  primary key (workspace_id,user_id)
);
create index if not exists workspace_members_user_idx on public.workspace_members(user_id);

create or replace function public.is_workspace_member(target_workspace uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.workspace_members wm where wm.workspace_id = target_workspace and wm.user_id = (select auth.uid())); $$;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  company_name text not null,
  industry text,
  contact_name text,
  email text,
  phone text,
  status text not null default 'New',
  health_score integer not null default 75 check (health_score between 0 and 100),
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists customers_workspace_idx on public.customers(workspace_id);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  external_ref text,
  amount numeric(14,2) not null default 0,
  currency char(3) not null default 'EGP',
  endpoint text not null,
  country char(2),
  risk_score smallint not null default 0 check (risk_score between 0 and 100),
  decision text not null check (decision in ('allow','challenge','review','block')),
  reasons jsonb not null default '[]'::jsonb,
  request_count_10m integer,
  account_age_days integer,
  policy_version text not null default 'rules-v1',
  created_at timestamptz not null default now(),
  unique (workspace_id,external_ref)
);
create index if not exists transactions_workspace_created_idx on public.transactions(workspace_id,created_at desc);
create index if not exists transactions_customer_idx on public.transactions(customer_id);

create table if not exists public.risk_cases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  transaction_id uuid references public.transactions(id) on delete set null,
  title text not null,
  severity text not null default 'Medium' check (severity in ('Low','Medium','High','Critical')),
  status text not null default 'Open' check (status in ('Open','In review','Resolved','Closed')),
  owner text,
  due_at timestamptz,
  resolution text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists risk_cases_workspace_status_idx on public.risk_cases(workspace_id,status,created_at desc);

create table if not exists public.interactions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  case_id uuid references public.risk_cases(id) on delete set null,
  channel text not null check (channel in ('Call','Email','Support','Meeting','Complaint','Other')),
  direction text not null default 'outbound' check (direction in ('inbound','outbound','internal')),
  summary text not null,
  next_action text,
  follow_up_at timestamptz,
  status text not null default 'Open',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists interactions_workspace_created_idx on public.interactions(workspace_id,created_at desc);

create table if not exists public.api_policies (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  rule_type text not null,
  enabled boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  version text not null default '1',
  created_at timestamptz not null default now(),
  unique(workspace_id,name)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_workspace_created_idx on public.audit_logs(workspace_id,created_at desc);

-- Enable RLS on every exposed table. Only authenticated workspace members are granted access.
do $$ declare tbl text; begin
  foreach tbl in array array['workspaces','workspace_members','customers','transactions','risk_cases','interactions','api_policies','audit_logs'] loop
    execute format('alter table public.%I enable row level security', tbl);
    execute format('revoke all on public.%I from anon', tbl);
    execute format('grant select, insert, update, delete on public.%I to authenticated', tbl);
  end loop;
end $$;

-- Workspace visibility: a user sees only workspaces where they are a member.
drop policy if exists workspace_member_read on public.workspaces;
create policy workspace_member_read on public.workspaces for select to authenticated using (public.is_workspace_member(id));
drop policy if exists workspace_members_read on public.workspace_members;
create policy workspace_members_read on public.workspace_members for select to authenticated using (public.is_workspace_member(workspace_id));

-- Shared tenant rule for business tables.
do $$ declare tbl text; begin
  foreach tbl in array array['customers','transactions','risk_cases','interactions','api_policies','audit_logs'] loop
    execute format('drop policy if exists tenant_select on public.%I',tbl);
    execute format('create policy tenant_select on public.%I for select to authenticated using (public.is_workspace_member(workspace_id))',tbl);
    execute format('drop policy if exists tenant_insert on public.%I',tbl);
    execute format('create policy tenant_insert on public.%I for insert to authenticated with check (public.is_workspace_member(workspace_id))',tbl);
    execute format('drop policy if exists tenant_update on public.%I',tbl);
    execute format('create policy tenant_update on public.%I for update to authenticated using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id))',tbl);
    execute format('drop policy if exists tenant_delete on public.%I',tbl);
    execute format('create policy tenant_delete on public.%I for delete to authenticated using (public.is_workspace_member(workspace_id))',tbl);
  end loop;
end $$;

-- IMPORTANT: this starter schema is a project scaffold, not a complete production security review.
-- Add role-specific authorization, audit triggers, rate limits, retention jobs and tested backup procedures before production.
