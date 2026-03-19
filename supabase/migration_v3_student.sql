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

alter table student_verifications enable row level security;

-- Add student_verified column to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS student_verified boolean DEFAULT false;
