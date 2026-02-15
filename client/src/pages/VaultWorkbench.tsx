import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import { WorkbenchHome } from '@/components/vault/workbench/WorkbenchHome';

export default function VaultWorkbench() {
  const [, setLocation] = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portal/user-data', { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          setLocation('/quiz');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setUserId(data.email);
        }
        setLoading(false);
      })
      .catch(() => {
        setLocation('/quiz');
      });
  }, [setLocation]);

  if (loading || !userId) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
      </div>
    );
  }

  return <WorkbenchHome userId={userId} />;
}
