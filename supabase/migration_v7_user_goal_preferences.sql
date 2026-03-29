-- Per-user application goal preferences (dashboard sidebar; defaults match app)

alter table users add column if not exists goal_period text default 'weekly';
alter table users add column if not exists goal_daily_target int default 3;
alter table users add column if not exists goal_weekly_target int default 7;
