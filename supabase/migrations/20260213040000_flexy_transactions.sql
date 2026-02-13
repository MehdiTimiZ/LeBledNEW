-- Migration: Create flexy_transactions table for telecom recharge history
-- Run via: Supabase SQL Editor

DROP TABLE IF EXISTS public.flexy_transactions CASCADE;

CREATE TABLE public.flexy_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  operator TEXT NOT NULL CHECK (operator IN ('djezzy', 'mobilis', 'ooredoo')),
  phone_number TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_flexy_user ON public.flexy_transactions(user_id, created_at DESC);

-- RLS
ALTER TABLE public.flexy_transactions ENABLE ROW LEVEL SECURITY;

-- Users can see own transactions
CREATE POLICY "Users can view own transactions"
  ON public.flexy_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own transactions
CREATE POLICY "Users can create transactions"
  ON public.flexy_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
