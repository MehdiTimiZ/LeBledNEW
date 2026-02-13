import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/supabase/client';
import { AppView } from '../types';

interface UseNotificationsOptions {
  userId?: string;
  currentView: AppView;
  onNotification: (message: string, type?: 'success' | 'info') => void;
}

/**
 * Real-time notification hook — listens for new messages via Supabase
 * and triggers a toast when the user is NOT on the messaging view.
 */
export function useNotifications({ userId, currentView, onNotification }: UseNotificationsOptions) {
  const currentViewRef = useRef(currentView);
  currentViewRef.current = currentView;

  const requestBrowserPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    // Request browser notification permission on first load
    requestBrowserPermission();

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${userId}`
        },
        (payload) => {
          // Only show toast if user is NOT already in messaging view
          if (currentViewRef.current !== AppView.CHAT) {
            const content = (payload.new as any).content;
            const preview = content?.length > 50 ? content.substring(0, 50) + '...' : content;
            onNotification(`💬 New message: ${preview}`, 'info');

            // Also show browser notification if permitted
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('LeBled — New Message', {
                body: preview,
                icon: '/favicon.svg'
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onNotification, requestBrowserPermission]);
}
