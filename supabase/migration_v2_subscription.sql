-- Migration: switch from one-time payment to subscription model
-- Run this if you already have the v1 schema

ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz;

-- Drop the old column that is no longer needed
ALTER TABLE users DROP COLUMN IF EXISTS stripe_payment_id;
