-- Student internship matching: preferred roles + resume keywords
alter table users add column if not exists preferred_internship_roles jsonb not null default '[]'::jsonb;
alter table users add column if not exists resume_text text;
alter table users add column if not exists resume_filename text;
alter table users add column if not exists resume_keywords jsonb not null default '[]'::jsonb;
alter table users add column if not exists internship_match_enabled boolean not null default false;
