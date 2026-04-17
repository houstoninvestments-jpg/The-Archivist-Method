import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    if (!loading && !user) navigate('/auth', { replace: true });
  }, [loading, user, navigate]);

  if (!isSupabaseConfigured) return <>{children}</>;
  if (loading) return <div style={{ minHeight: '100vh', background: '#0A0A0A' }} />;
  if (!user) return null;
  return <>{children}</>;
}
