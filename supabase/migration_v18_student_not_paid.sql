-- Student verification is not a paid plan.
-- Keep Stripe subscribers even if they are also student-verified.
UPDATE users
SET paid = false
WHERE student_verified = true
  AND COALESCE(subscription_status, '') <> 'active'
  AND (stripe_subscription_id IS NULL OR stripe_subscription_id = '')
  AND COALESCE(paid, false) = true;
