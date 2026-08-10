-- Stop Gmail sync from endlessly re-classifying emails that were intentionally
-- not turned into application events (marketing digests, job alerts, etc.).
alter table message_index
  add column if not exists ingest_skipped boolean not null default false;

create index if not exists idx_message_index_user_backfill
  on message_index (user_id, received_at desc)
  where processed = true and ingest_skipped = false;
