-- Tsenta one-click auto-apply: candidate ids, apply profile, resume PDF path, application rows.

alter table users add column if not exists tsenta_candidate_id text;
alter table users add column if not exists tsenta_profile_id text;
alter table users add column if not exists apply_profile jsonb;
alter table users add column if not exists resume_storage_path text;

create table if not exists tsenta_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  listing_id uuid,
  apply_url text not null,
  company text not null default '',
  role_title text not null default '',
  tsenta_application_id text,
  ats text,
  status text not null default 'queued',
  failure_reason text,
  price_usd numeric,
  chain_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, apply_url)
);

create index if not exists idx_tsenta_applications_user
  on tsenta_applications(user_id, created_at desc);

create index if not exists idx_tsenta_applications_tsenta_id
  on tsenta_applications(tsenta_application_id);

alter table tsenta_applications enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  2097152,
  array['application/pdf']
)
on conflict (id) do nothing;
