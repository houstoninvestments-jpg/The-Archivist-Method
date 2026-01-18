import { useEffect, useState } from 'react';
import { Unlock } from 'lucide-react';

export default function GodModeBadge() {
  const [isGodMode, setIsGodMode] = useState(false);

  useEffect(() => {
    const checkGodMode = () => {
      setIsGodMode(localStorage.getItem('godMode') === 'true');
    };

    checkGodMode();

    window.addEventListener('storage', checkGodMode);
    const interval = setInterval(checkGodMode, 1000);

    return () => {
      window.removeEventListener('storage', checkGodMode);
      clearInterval(interval);
    };
  }, []);

  if (!isGodMode) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-[9997] flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-teal-500 rounded-lg shadow-lg animate-pulse"
      data-testid="badge-god-mode"
    >
      <Unlock className="w-4 h-4 text-white" />
      <span className="text-white text-xs font-bold tracking-wider">GOD MODE ACTIVE</span>
    </div>
  );
}
