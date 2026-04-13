import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useActiveUsers(user: any) {
  const [activeCount, setActiveCount] = useState(120); // Default fallback

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const trackSession = async () => {
      const sessionId = localStorage.getItem('hub_session_id') || Math.random().toString(36).substring(7);
      localStorage.setItem('hub_session_id', sessionId);

      try {
        // Upsert session
        await supabase.from('active_sessions').upsert({
          session_id: sessionId,
          user_id: user?.id || null,
          last_seen: new Date().toISOString(),
        }, { onConflict: 'session_id' });
      } catch (err) {
        // Silently fail if table doesn't exist
        console.warn('Active session tracking failed. Ensure "active_sessions" table exists.');
      }
    };

    const fetchActiveCount = async () => {
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const { count, error } = await supabase
          .from('active_sessions')
          .select('*', { count: 'exact', head: true })
          .gt('last_seen', fiveMinutesAgo);
        
        if (!error && count !== null) {
          setActiveCount(count + 120); // Adding 120 as a base for "lively" feel or just use real count
        }
      } catch (err) {
        console.warn('Could not fetch active user count.');
      }
    };

    trackSession();
    fetchActiveCount();

    const interval = setInterval(() => {
      trackSession();
      fetchActiveCount();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  return activeCount;
}
