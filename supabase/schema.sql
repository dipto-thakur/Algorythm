create extension if not exists pgcrypto;

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique,
  name text not null check (char_length(name) between 1 and 80),
  email text check (email is null or char_length(email) <= 254),
  college text not null check (char_length(college) between 1 and 120),
  department text not null check (char_length(department) between 1 and 80),
  semester smallint not null check (semester between 1 and 8),
  calling_no text not null check (calling_no ~ '^[6-9][0-9]{9}$'),
  whatsapp_no text not null unique check (whatsapp_no ~ '^[6-9][0-9]{9}$'),
  query text check (query is null or char_length(query) <= 1000),
  created_at timestamptz not null default now()
);

create table public.event_entries (
  id uuid primary key default gen_random_uuid(),
  registration_id uuid not null references public.registrations(id) on delete cascade,
  event_slug text not null,
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 8192),
  created_at timestamptz not null default now(),
  unique (registration_id, event_slug)
);

-- Lock the tables: no policies = anon/authenticated can read or write nothing.
-- Only the server (service_role) bypasses RLS.
alter table public.registrations enable row level security;
alter table public.event_entries enable row level security;
revoke all on public.registrations, public.event_entries from anon, authenticated;

-- One atomic insert for both stages. Retrying with the same submission id is safe (idempotent).
create or replace function public.submit_registration(p_submission uuid, p_common jsonb, p_entries jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare rid uuid; existing uuid; e record;
begin
  select id into existing from registrations where submission_id = p_submission;
  if existing is not null then
    return jsonb_build_object('id', existing, 'duplicate', true);
  end if;

  insert into registrations (submission_id, name, email, college, department, semester, calling_no, whatsapp_no, query)
  values (p_submission, p_common->>'name', nullif(p_common->>'email', ''), p_common->>'college',
          p_common->>'department', (p_common->>'semester')::smallint, p_common->>'calling',
          p_common->>'whatsapp', nullif(p_common->>'query', ''))
  returning id into rid;

  for e in select key, value from jsonb_each(p_entries) loop
    insert into event_entries (registration_id, event_slug, data) values (rid, e.key, e.value);
  end loop;

  return jsonb_build_object('id', rid, 'duplicate', false);
end $$;

revoke all on function public.submit_registration(uuid, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.submit_registration(uuid, jsonb, jsonb) to service_role;