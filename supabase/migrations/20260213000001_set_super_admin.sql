-- ============================================================
-- SET mehdi.timizar@sap.com AS SUPER_ADMIN (Owner)
-- Run this in Supabase SQL Editor after the user has signed up.
-- Safe to run multiple times.
-- ============================================================

-- Step 1: Update the role constraint to include SELLER
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('USER', 'ADMIN', 'SUPER_ADMIN', 'SELLER'));

-- Step 2: Promote mehdi.timizar@sap.com to SUPER_ADMIN
-- This works whether the profile was created by the trigger or not.
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Find the user ID from auth.users
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = 'mehdi.timizar@sap.com'
  LIMIT 1;

  IF target_user_id IS NOT NULL THEN
    -- Upsert: insert profile if missing, or update role if exists
    INSERT INTO public.profiles (id, email, role)
    VALUES (target_user_id, 'mehdi.timizar@sap.com', 'SUPER_ADMIN')
    ON CONFLICT (id) DO UPDATE SET role = 'SUPER_ADMIN';
    
    RAISE NOTICE 'SUCCESS: mehdi.timizar@sap.com is now SUPER_ADMIN (id: %)', target_user_id;
  ELSE
    RAISE NOTICE 'WARNING: mehdi.timizar@sap.com not found in auth.users. Please sign up first, then re-run this script.';
  END IF;
END $$;

-- Step 3: Verify
SELECT id, email, role, created_at 
FROM public.profiles 
WHERE email = 'mehdi.timizar@sap.com';
