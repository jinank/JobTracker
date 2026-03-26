-- Profile image from Google OAuth (for leaderboard avatars)
ALTER TABLE users ADD COLUMN IF NOT EXISTS image text;

-- Top trackers by number of applications (chains)
CREATE OR REPLACE FUNCTION public.leaderboard_by_chain_count(p_limit int DEFAULT 12)
RETURNS TABLE (
  user_id uuid,
  chain_count bigint,
  user_image text,
  display_source text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.user_id,
    COUNT(*)::bigint AS chain_count,
    u.image AS user_image,
    COALESCE(NULLIF(TRIM(u.name), ''), SPLIT_PART(u.email, '@', 1)) AS display_source
  FROM chains c
  INNER JOIN users u ON u.id = c.user_id
  GROUP BY c.user_id, u.image, u.name, u.email
  ORDER BY chain_count DESC
  LIMIT p_limit;
$$;

-- How many users have strictly more applications than p_count (for rank)
CREATE OR REPLACE FUNCTION public.count_users_with_more_chains(p_count bigint)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::bigint
  FROM (
    SELECT user_id
    FROM chains
    GROUP BY user_id
    HAVING COUNT(*) > p_count
  ) s;
$$;

-- Users with at least one tracked application
CREATE OR REPLACE FUNCTION public.count_users_with_chains()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::bigint FROM (SELECT 1 FROM chains GROUP BY user_id) x;
$$;

REVOKE ALL ON FUNCTION public.leaderboard_by_chain_count(int) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.count_users_with_more_chains(bigint) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.count_users_with_chains() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.leaderboard_by_chain_count(int) TO service_role;
GRANT EXECUTE ON FUNCTION public.count_users_with_more_chains(bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.count_users_with_chains() TO service_role;
