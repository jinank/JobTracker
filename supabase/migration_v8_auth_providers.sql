-- Optional auth columns for email (Supabase Auth) vs Google sign-in
alter table users add column if not exists auth_provider text default 'google';
alter table users add column if not exists supabase_auth_id uuid unique;
alter table users add column if not exists image text;
