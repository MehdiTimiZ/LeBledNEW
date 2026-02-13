import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { User } from '@supabase/supabase-js';

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRole(session.user.id);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchRole(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching role:', error);
        setRole('USER');
      } else {
        setRole((data?.role as UserRole) || 'USER');
      }
    } catch (err) {
      console.error('Error in fetchRole:', err);
      setRole('USER');
    } finally {
      setLoading(false);
    }
  }

  // Hardcoded Super Admin check for resilience
  const isSuperAdmin = 
    role === 'SUPER_ADMIN' || 
    user?.email === 'mehdi.timizar@sap.com';

  const isAdmin = 
    role === 'ADMIN' || 
    isSuperAdmin;

  return { role, loading, user, isAdmin, isSuperAdmin };
}
