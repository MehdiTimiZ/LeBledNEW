import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';

export interface FlexyTransaction {
  id: string;
  user_id: string;
  operator: string;
  phone_number: string;
  amount: number;
  status: string;
  created_at: string;
}

export function useFlexy(userId: string | undefined) {
  const [transactions, setTransactions] = useState<FlexyTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from('flexy_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.warn('Flexy transactions table not ready:', error.message);
        return;
      }
      setTransactions(data || []);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  }, [userId]);

  const recharge = useCallback(async (operator: string, phoneNumber: string, amount: number): Promise<boolean> => {
    if (!userId) return false;
    setLoading(true);
    try {
      const { error } = await supabase.from('flexy_transactions').insert({
        user_id: userId,
        operator,
        phone_number: phoneNumber,
        amount,
        status: 'completed',
      });

      if (error) throw error;

      // Refresh transaction list
      await fetchTransactions();
      return true;
    } catch (err: any) {
      console.error('Recharge failed:', err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, recharge, refresh: fetchTransactions };
}
