-- Migration: Create expat_services table
-- Run via: Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.expat_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Translation', 'Legal', 'Customs', 'Relocation', 'Real Estate', 'Administrative', 'Tourism', 'Other')),
  languages TEXT[] DEFAULT '{}',
  location TEXT,
  contact_info TEXT,
  pricing TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_expat_services_user ON public.expat_services(user_id);
CREATE INDEX IF NOT EXISTS idx_expat_services_category ON public.expat_services(category);
CREATE INDEX IF NOT EXISTS idx_expat_services_active ON public.expat_services(is_active) WHERE is_active = TRUE;

-- RLS
ALTER TABLE public.expat_services ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Anyone can view active services" ON public.expat_services;
DROP POLICY IF EXISTS "Sellers can create services" ON public.expat_services;
DROP POLICY IF EXISTS "Owners can update services" ON public.expat_services;
DROP POLICY IF EXISTS "Owners can delete services" ON public.expat_services;

-- Anyone can view active services
CREATE POLICY "Anyone can view active services"
  ON public.expat_services FOR SELECT
  USING (is_active = TRUE);

-- Sellers can create their own services  
CREATE POLICY "Sellers can create services"
  ON public.expat_services FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Owners can update their services
CREATE POLICY "Owners can update services"
  ON public.expat_services FOR UPDATE
  USING (auth.uid() = user_id);

-- Owners can delete their services
CREATE POLICY "Owners can delete services"
  ON public.expat_services FOR DELETE
  USING (auth.uid() = user_id);
