-- Allow Ashby job boards alongside Greenhouse and Lever
alter table job_sources drop constraint if exists job_sources_ats_check;
alter table job_sources add constraint job_sources_ats_check
  check (ats in ('greenhouse', 'lever', 'ashby'));
