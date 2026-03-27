-- Admin analytics: sign-ins, in-app activities, per-call AI token usage

alter table users add column if not exists last_login_at timestamptz;
alter table users add column if not exists login_count int default 0;

create table if not exists user_sign_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  email text not null,
  provider text not null default 'google',
  created_at timestamptz default now()
);

create index if not exists idx_user_sign_ins_user on user_sign_ins(user_id);
create index if not exists idx_user_sign_ins_created on user_sign_ins(created_at desc);

create table if not exists user_activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  action text not null,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_user_activities_user on user_activities(user_id);
create index if not exists idx_user_activities_created on user_activities(created_at desc);

create table if not exists ai_token_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  model text not null,
  prompt_tokens int not null default 0,
  completion_tokens int not null default 0,
  total_tokens int not null default 0,
  source text not null default 'classify_email',
  created_at timestamptz default now()
);

create index if not exists idx_ai_token_usage_user on ai_token_usage(user_id);
create index if not exists idx_ai_token_usage_created on ai_token_usage(created_at desc);

alter table user_sign_ins enable row level security;
alter table user_activities enable row level security;
alter table ai_token_usage enable row level security;
