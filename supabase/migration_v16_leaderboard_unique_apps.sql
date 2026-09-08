-- Leaderboard counts unique applications (company + role), matching
-- lib/uniqueApplications.ts — not raw Gmail thread / chain rows.

CREATE OR REPLACE FUNCTION public.unique_application_key(company text, role text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT
    lower(trim(coalesce(company, ''))) || '::' ||
    CASE
      WHEN role IS NULL OR trim(role) = '' THEN '__generic__'
      WHEN lower(trim(role)) LIKE 'talent community%' THEN '__generic__'
      WHEN lower(trim(role)) ~ '^(expression of interest|talent community(\s*/\s*future opportunities)?|future opportunities|unknown role|unknown|reach out)$'
        THEN '__generic__'
      ELSE lower(regexp_replace(trim(role), '\s+', ' ', 'g'))
    END;
$$;

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
    COUNT(DISTINCT public.unique_application_key(c.canonical_company, c.role_title))::bigint AS chain_count,
    u.image AS user_image,
    COALESCE(NULLIF(TRIM(u.name), ''), SPLIT_PART(u.email, '@', 1)) AS display_source
  FROM chains c
  INNER JOIN users u ON u.id = c.user_id
  GROUP BY c.user_id, u.image, u.name, u.email
  ORDER BY chain_count DESC
  LIMIT p_limit;
$$;

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
    HAVING COUNT(DISTINCT public.unique_application_key(canonical_company, role_title)) > p_count
  ) s;
$$;

CREATE OR REPLACE FUNCTION public.count_unique_applications_for_user(p_user_id uuid)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    COUNT(DISTINCT public.unique_application_key(canonical_company, role_title)),
    0
  )::bigint
  FROM chains
  WHERE user_id = p_user_id;
$$;

REVOKE ALL ON FUNCTION public.unique_application_key(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.count_unique_applications_for_user(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.unique_application_key(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.leaderboard_by_chain_count(int) TO service_role;
GRANT EXECUTE ON FUNCTION public.count_users_with_more_chains(bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.count_unique_applications_for_user(uuid) TO service_role;
