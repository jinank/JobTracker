-- Users (linked to NextAuth Google accounts)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  google_sub text unique,
  paid boolean default false,
  paid_at timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'free',
  subscription_ends_at timestamptz,
  student_verified boolean default false,
  created_at timestamptz default now()
);

-- Chains (job applications)
create table if not exists chains (
  chain_id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  canonical_company text not null,
  role_title text default '',
  status text not null default 'APPLIED',
  last_event_at bigint not null,
  confidence real default 0,
  created_at bigint not null
);

create index if not exists idx_chains_user on chains(user_id);
create index if not exists idx_chains_status on chains(status);

alter table chains add column if not exists user_notes text default '';

-- Events (timeline entries)
create table if not exists events (
  event_id uuid primary key default gen_random_uuid(),
  chain_id uuid references chains(chain_id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  event_type text not null,
  event_time bigint not null,
  due_at bigint,
  evidence text default '',
  extracted_entities jsonb default '{}',
  msg_id_internal uuid,
  extraction_version int default 1
);

create index if not exists idx_events_chain on events(chain_id);
create index if not exists idx_events_user on events(user_id);

-- Message index (deduplication)
create table if not exists message_index (
  msg_id_internal uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  provider_message_id text not null,
  provider_thread_id text,
  subject_text text,
  from_email text,
  from_domain text,
  received_at bigint,
  snippet text,
  processed boolean default true,
  unique(user_id, provider_message_id)
);

create index if not exists idx_message_index_user on message_index(user_id);

-- Payments (Stripe records)
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  stripe_session_id text unique,
  stripe_payment_intent text,
  amount_cents int not null,
  currency text default 'usd',
  status text not null,
  created_at timestamptz default now()
);

-- Student verification requests
create table if not exists student_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  full_name text not null,
  student_email text not null,
  university text not null,
  linkedin_url text,
  graduation_year int,
  status text not null default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_student_verifications_user on student_verifications(user_id);
create index if not exists idx_student_verifications_status on student_verifications(status);

-- Row Level Security
alter table users enable row level security;
alter table chains enable row level security;
alter table events enable row level security;
alter table message_index enable row level security;
alter table payments enable row level security;
alter table student_verifications enable row level security;
