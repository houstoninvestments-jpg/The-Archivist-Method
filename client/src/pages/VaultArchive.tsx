import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';
import ArchiveHome from '@/components/vault/archive/ArchiveHome';

export default function VaultArchive() {
  const [, setLocation] = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
  const [ownedProducts, setOwnedProducts] = useState<string[]>([]);
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
          const products: string[] = [];
          if (data.hasQuickStart) products.push('quick-start');
          if (data.hasCompleteArchive) products.push('complete-archive');
          setOwnedProducts(products);
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

  return (
    <ArchiveHome
      userId={userId}
      ownedProducts={ownedProducts}
      onPurchase={(product) => {
        window.location.href = `/api/portal/checkout/${product}`;
      }}
    />
  );
}
