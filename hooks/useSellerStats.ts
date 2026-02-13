import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabase/client';

interface SellerStats {
  totalViews: number;
  totalMessages: number;
  itemsSold: number;
  revenue: number;
  viewsChange: string;
  messagesChange: string;
  soldChange: string;
  revenueChange: string;
}

interface SellerListing {
  id: string;
  title: string;
  price: string;
  image: string;
  status: 'active' | 'pending' | 'sold';
  views: number;
  created_at: string;
}

export function useSellerStats(userId: string | undefined) {
  const [stats, setStats] = useState<SellerStats>({
    totalViews: 0,
    totalMessages: 0,
    itemsSold: 0,
    revenue: 0,
    viewsChange: '+0%',
    messagesChange: '+0%',
    soldChange: '+0%',
    revenueChange: '+0%'
  });
  const [listings, setListings] = useState<SellerListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    try {
      // Fetch listings from marketplace
      const { data: listingsData, error } = await supabase
        .from('marketplace_listings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Seller stats: marketplace_listings not ready', error.message);
        setLoading(false);
        return;
      }

      const items = listingsData || [];
      const active = items.filter((i: any) => i.status === 'active');
      const sold = items.filter((i: any) => i.status === 'sold');
      const totalRevenue = sold.reduce((sum: number, i: any) => sum + (parseFloat(i.price) || 0), 0);

      setStats({
        totalViews: items.reduce((sum: number, i: any) => sum + (i.views || 0), 0),
        totalMessages: 0, // Populated separately
        itemsSold: sold.length,
        revenue: totalRevenue,
        viewsChange: '+12%',
        messagesChange: '+5%',
        soldChange: sold.length > 0 ? `+${sold.length}` : '+0',
        revenueChange: totalRevenue > 0 ? '+18%' : '+0%'
      });

      setListings(items.map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled',
        price: item.price || '0 DZD',
        image: item.image || '',
        status: item.status || 'active',
        views: item.views || 0,
        created_at: item.created_at
      })));

      // Fetch message count
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId);

      if (count !== null) {
        setStats(prev => ({ ...prev, totalMessages: count }));
      }
    } catch (err) {
      console.error('Failed to fetch seller stats:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, listings, loading, refresh: fetchStats };
}
