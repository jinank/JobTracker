-- User home location (collected at sign-up)
alter table users add column if not exists city text;
alter table users add column if not exists state text;
alter table users add column if not exists country text;

create index if not exists idx_users_location
  on users(country, state, city)
  where city is not null and country is not null;
