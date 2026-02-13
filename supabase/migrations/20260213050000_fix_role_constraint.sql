-- ============================================================
-- Fix: Update profiles_role_check to accept both uppercase and
-- lowercase role values, and add missing is_active column.
-- Safe to re-run.
-- ============================================================

-- Step 1: Drop the old constraint
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Step 2: Add a case-insensitive check constraint
-- This accepts both 'admin' and 'ADMIN', 'seller' and 'SELLER', etc.
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (LOWER(role) IN ('user', 'admin', 'super_admin', 'seller'));

-- Step 3: Add is_active column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'is_active'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE;
  END IF;
END $$;
