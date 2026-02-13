-- ============================================================
-- SECURITY FIX: Addresses audit findings #2, #3, #4
-- Safe to re-run (idempotent).
-- ============================================================

-- -------------------------------------------------------
-- Fix #2: Admin UPDATE policy on profiles
-- Allows admins to change other users' roles
-- -------------------------------------------------------
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_super_admin());

-- -------------------------------------------------------
-- Fix #3: is_super_admin() reads from profiles (not user_status)
-- The AdminPanel updates profiles.role, so the auth
-- function must read from the same table.
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN UPPER(user_role) IN ('SUPER_ADMIN', 'ADMIN');
END;
$$;

-- -------------------------------------------------------
-- Fix #4: Restrict security_logs INSERT to admins only
-- Prevents any user from injecting fake audit entries
-- -------------------------------------------------------
DROP POLICY IF EXISTS "System can insert security logs" ON public.security_logs;
CREATE POLICY "Only admins can insert security logs"
  ON public.security_logs FOR INSERT
  WITH CHECK (public.is_super_admin());
