-- Member resource access requests (LinkedIn review, resume review, headshot)
create table if not exists resource_access_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  resource_id text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique (user_id, resource_id)
);

create index if not exists idx_resource_access_requests_user on resource_access_requests(user_id);
create index if not exists idx_resource_access_requests_status on resource_access_requests(status);
create index if not exists idx_resource_access_requests_resource on resource_access_requests(resource_id);

alter table resource_access_requests enable row level security;
