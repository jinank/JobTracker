-- Curated company career boards (Greenhouse / Lever)
create table if not exists job_sources (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  company_slug text not null,
  ats text not null check (ats in ('greenhouse', 'lever')),
  board_token text not null,
  careers_url text not null default '',
  enabled boolean not null default true,
  force_internship boolean not null default false,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  unique (ats, board_token)
);

create index if not exists idx_job_sources_enabled on job_sources(enabled);

-- Normalized internship listings (US only, stored after ingestion filter)
create table if not exists job_listings (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references job_sources(id) on delete cascade,
  external_id text not null,
  company text not null,
  company_slug text not null,
  title text not null,
  location_raw text not null default '',
  city text,
  state text,
  country text not null default 'US',
  work_type text not null check (work_type in ('Remote', 'Hybrid', 'On-site')),
  role_category text not null default 'Software Engineering',
  employment_type text not null default 'Internship',
  experience_level text not null default 'Intern',
  apply_url text not null,
  description text not null default '',
  posted_at timestamptz,
  tags jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, external_id)
);

create index if not exists idx_job_listings_scope
  on job_listings(country, is_active, posted_at desc);
create index if not exists idx_job_listings_role
  on job_listings(role_category) where is_active = true;
create index if not exists idx_job_listings_company
  on job_listings(company) where is_active = true;

-- Sync run log (optional observability)
create table if not exists job_sync_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  sources_processed int not null default 0,
  fetched int not null default 0,
  internships_kept int not null default 0,
  us_kept int not null default 0,
  upserted int not null default 0,
  deactivated int not null default 0,
  errors jsonb not null default '[]'::jsonb
);
