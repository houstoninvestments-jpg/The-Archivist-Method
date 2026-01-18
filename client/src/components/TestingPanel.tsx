import { useState, useEffect } from 'react';
import { Settings, X, FileText, Unlock, Lock, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

interface GodModeState {
  enabled: boolean;
  tier: 'free' | 'quick-start' | 'archive';
}

export function isGodModeEnabled(): boolean {
  return localStorage.getItem('godMode') === 'true';
}

export function getGodModeTier(): string {
  return localStorage.getItem('godModeTier') || 'archive';
}

export function enableGodMode() {
  localStorage.setItem('godMode', 'true');
  localStorage.setItem('godModeTier', 'archive');
  window.location.reload();
}

export function disableGodMode() {
  localStorage.removeItem('godMode');
  localStorage.removeItem('godModeTier');
  window.location.reload();
}

export function hasGodModeAccess(requiredTier: string): boolean {
  if (!isGodModeEnabled()) return false;
  const godModeTier = getGodModeTier();
  if (godModeTier === 'archive') return true;
  if (godModeTier === 'quick-start' && (requiredTier === 'quick-start' || requiredTier === 'crash-course' || requiredTier === 'free')) return true;
  if (godModeTier === 'crash-course' && (requiredTier === 'crash-course' || requiredTier === 'free')) return true;
  return requiredTier === 'free';
}

const workbooks = [
  { title: 'Crash Course Workbook', slug: 'crash-course', tier: 'free' },
  { title: 'Quick-Start Workbook', slug: 'quick-start', tier: 'quick-start' },
  { title: 'Complete Archive Workbook', slug: 'archive', tier: 'archive' },
  { title: 'Disappearing Pattern', slug: 'disappearing', tier: 'archive' },
  { title: 'Apology Loop', slug: 'apology-loop', tier: 'archive' },
  { title: 'Testing Pattern', slug: 'testing', tier: 'archive' },
  { title: 'Attraction to Harm', slug: 'attraction-to-harm', tier: 'archive' },
  { title: 'Compliment Deflection', slug: 'compliment-deflection', tier: 'archive' },
  { title: 'Draining Bond', slug: 'draining-bond', tier: 'archive' },
  { title: 'Success Sabotage', slug: 'success-sabotage', tier: 'archive' },
];

export default function TestingPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [godMode, setGodMode] = useState<GodModeState>({
    enabled: false,
    tier: 'archive'
  });

  useEffect(() => {
    setGodMode({
      enabled: isGodModeEnabled(),
      tier: (getGodModeTier() as 'free' | 'quick-start' | 'archive') || 'archive'
    });
  }, []);

  const handleEnableGodMode = () => {
    enableGodMode();
  };

  const handleDisableGodMode = () => {
    disableGodMode();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-[9999] p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        data-testid="button-testing-panel-toggle"
        aria-label="Toggle Testing Panel"
      >
        <Settings className="w-6 h-6 text-black" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed right-0 top-0 bottom-0 w-80 bg-[#0a0a0a] border-l border-[#333] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#333] p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-500" />
                Testing Panel
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
                data-testid="button-close-testing-panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Unlock className="w-4 h-4" />
                  God Mode (Testing)
                </h3>
                
                <div className={`p-3 rounded-lg border ${godMode.enabled 
                  ? 'bg-gradient-to-r from-pink-500/10 to-teal-500/10 border-pink-500/30' 
                  : 'bg-gray-900 border-gray-700'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-300">Status</span>
                    <span className={`text-sm font-bold ${godMode.enabled ? 'text-teal-400' : 'text-gray-500'}`}>
                      {godMode.enabled ? 'ACTIVE' : 'Inactive'}
                    </span>
                  </div>
                  
                  {godMode.enabled ? (
                    <Button
                      onClick={handleDisableGodMode}
                      variant="outline"
                      size="sm"
                      className="w-full border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                      data-testid="button-disable-god-mode"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Disable God Mode
                    </Button>
                  ) : (
                    <Button
                      onClick={handleEnableGodMode}
                      size="sm"
                      className="w-full bg-gradient-to-r from-pink-500 to-teal-500 text-white hover:opacity-90"
                      data-testid="button-enable-god-mode"
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      Enable God Mode (All Access)
                    </Button>
                  )}
                </div>
                
                <p className="text-xs text-gray-500">
                  God Mode bypasses Stripe and grants access to all tiers for testing purposes.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  PDF Workbooks
                </h3>
                
                <div className="space-y-2">
                  {workbooks.map((workbook) => (
                    <Link
                      key={workbook.slug}
                      href={`/portal/workbook/${workbook.slug}`}
                      className="flex items-center gap-2 p-2 rounded bg-gray-900 hover:bg-gray-800 text-sm text-gray-300 hover:text-white transition-colors"
                      data-testid={`link-workbook-${workbook.slug}`}
                    >
                      <FileText className="w-4 h-4 text-teal-500 flex-shrink-0" />
                      <span className="flex-1 truncate">{workbook.title}</span>
                      <ExternalLink className="w-3 h-3 text-gray-500" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Quick Links
                </h3>
                
                <div className="space-y-2">
                  <Link
                    href="/portal/downloads"
                    className="flex items-center gap-2 p-2 rounded bg-teal-500/10 border border-teal-500/30 text-sm text-teal-400 hover:bg-teal-500/20 transition-colors"
                    data-testid="link-downloads-page"
                  >
                    <Download className="w-4 h-4" />
                    <span>Downloads Page</span>
                  </Link>
                  
                  <Link
                    href="/portal/dashboard"
                    className="flex items-center gap-2 p-2 rounded bg-gray-900 hover:bg-gray-800 text-sm text-gray-300 hover:text-white transition-colors"
                    data-testid="link-portal-dashboard"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                    <span>Portal Dashboard</span>
                  </Link>
                  
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 p-2 rounded bg-gray-900 hover:bg-gray-800 text-sm text-gray-300 hover:text-white transition-colors"
                    data-testid="link-admin"
                  >
                    <ExternalLink className="w-4 h-4 text-gray-500" />
                    <span>Admin Panel</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
