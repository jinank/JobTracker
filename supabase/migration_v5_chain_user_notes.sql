-- Free-form notes on an application (e.g. self-reported invite responses)
ALTER TABLE chains ADD COLUMN IF NOT EXISTS user_notes text DEFAULT '';
