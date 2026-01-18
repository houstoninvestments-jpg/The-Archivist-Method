import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { Download, FileText, Lock, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isGodModeEnabled } from '@/components/TestingPanel';
import GodModeBadge from '@/components/GodModeBadge';

interface DownloadItem {
  title: string;
  slug: string;
  pdfPath: string;
  tier: 'free' | 'quick-start' | 'archive';
  description: string;
  category: 'main' | 'pattern';
}

interface UserEntitlements {
  hasCrashCourse: boolean;
  hasQuickStart: boolean;
  hasArchive: boolean;
}

const downloads: DownloadItem[] = [
  {
    title: 'Crash Course Workbook',
    slug: 'crash-course',
    pdfPath: '/pdfs/crash-course-workbook.pdf',
    tier: 'free',
    description: '7-day pattern recognition guide',
    category: 'main'
  },
  {
    title: 'Quick-Start System Workbook',
    slug: 'quick-start',
    pdfPath: '/pdfs/quick-start-workbook.pdf',
    tier: 'quick-start',
    description: '90-day pattern interruption protocol',
    category: 'main'
  },
  {
    title: 'Complete Archive Workbook',
    slug: 'archive',
    pdfPath: '/pdfs/complete-archive-workbook.pdf',
    tier: 'archive',
    description: 'All 7 patterns + advanced protocols',
    category: 'main'
  },
  {
    title: 'The Disappearing Pattern',
    slug: 'disappearing',
    pdfPath: '/pdfs/disappearing-pattern-workbook.pdf',
    tier: 'archive',
    description: 'Ghost before they leave you',
    category: 'pattern'
  },
  {
    title: 'The Apology Loop',
    slug: 'apology-loop',
    pdfPath: '/pdfs/apology-loop-workbook.pdf',
    tier: 'archive',
    description: 'Over-apologize to pre-empt rejection',
    category: 'pattern'
  },
  {
    title: 'The Testing Pattern',
    slug: 'testing',
    pdfPath: '/pdfs/testing-pattern-workbook.pdf',
    tier: 'archive',
    description: 'Create conflict to prove they will leave',
    category: 'pattern'
  },
  {
    title: 'Attraction to Harm',
    slug: 'attraction-to-harm',
    pdfPath: '/pdfs/attraction-to-harm-workbook.pdf',
    tier: 'archive',
    description: 'Seek what damages you',
    category: 'pattern'
  },
  {
    title: 'Compliment Deflection',
    slug: 'compliment-deflection',
    pdfPath: '/pdfs/compliment-deflection-workbook.pdf',
    tier: 'archive',
    description: 'Reject positive recognition',
    category: 'pattern'
  },
  {
    title: 'The Draining Bond',
    slug: 'draining-bond',
    pdfPath: '/pdfs/draining-bond-workbook.pdf',
    tier: 'archive',
    description: 'Stay in exhausting relationships',
    category: 'pattern'
  },
  {
    title: 'Success Sabotage',
    slug: 'success-sabotage',
    pdfPath: '/pdfs/success-sabotage-workbook.pdf',
    tier: 'archive',
    description: 'Undermine your own achievements',
    category: 'pattern'
  }
];

const tierLabels: Record<string, { label: string; color: string }> = {
  'free': { label: 'Free', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  'quick-start': { label: 'Quick-Start', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  'archive': { label: 'Archive', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' }
};

export default function PortalDownloads() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [entitlements, setEntitlements] = useState<UserEntitlements>({
    hasCrashCourse: false,
    hasQuickStart: false,
    hasArchive: false
  });
  const godModeEnabled = isGodModeEnabled();
  
  const mainDownloads = downloads.filter(d => d.category === 'main');
  const patternDownloads = downloads.filter(d => d.category === 'pattern');

  useEffect(() => {
    fetchEntitlements();
  }, []);

  const fetchEntitlements = async () => {
    try {
      const response = await fetch('/api/portal/user-data');
      if (response.ok) {
        const data = await response.json();
        const purchases = data.purchases || [];
        
        const hasQuickStart = purchases.some((p: any) => 
          p.productId.includes('quick-start') || p.productId.includes('quickstart')
        );
        const hasArchive = purchases.some((p: any) => 
          p.productId.includes('archive') || p.productId.includes('complete')
        );
        
        setEntitlements({
          hasCrashCourse: true,
          hasQuickStart: hasQuickStart || hasArchive,
          hasArchive: hasArchive
        });
      }
    } catch (error) {
      console.error('Failed to fetch entitlements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAccess = (tier: string): boolean => {
    if (godModeEnabled) return true;
    if (tier === 'free') return true;
    if (tier === 'quick-start') return entitlements.hasQuickStart || entitlements.hasArchive;
    if (tier === 'archive') return entitlements.hasArchive;
    return false;
  };

  const handleDownload = (item: DownloadItem) => {
    window.open(item.pdfPath, '_blank');
  };

  const handleView = (slug: string) => {
    setLocation(`/portal/workbook/${slug}`);
  };

  const DownloadCard = ({ item }: { item: DownloadItem }) => {
    const hasAccess = checkAccess(item.tier);
    const tierInfo = tierLabels[item.tier];

    return (
      <div 
        className={`relative group p-6 rounded-xl border transition-all ${
          hasAccess 
            ? 'bg-white/5 border-teal-500/30 hover:border-teal-500/50' 
            : 'bg-white/[0.02] border-white/10 opacity-75'
        }`}
        data-testid={`card-download-${item.slug}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs font-bold rounded border ${tierInfo.color}`}>
                {tierInfo.label}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
          
          {hasAccess ? (
            <FileText className="w-8 h-8 text-teal-400 flex-shrink-0" />
          ) : (
            <Lock className="w-8 h-8 text-gray-600 flex-shrink-0" />
          )}
        </div>

        {hasAccess ? (
          <div className="flex gap-2 mt-4">
            <Button
              onClick={() => handleView(item.slug)}
              className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-black hover:opacity-90"
              data-testid={`button-view-${item.slug}`}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Online
            </Button>
            <Button
              onClick={() => handleDownload(item)}
              variant="outline"
              className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
              data-testid={`button-download-${item.slug}`}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="p-3 bg-white/5 rounded-lg text-center">
              <Lock className="w-4 h-4 text-gray-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">
                Requires {item.tier === 'quick-start' ? 'Quick-Start' : 'Archive'} tier
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <GodModeBadge />
      
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-pink-500/10"></div>
      </div>
      
      <div className="relative">
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation('/portal/dashboard')}
              className="text-gray-400 hover:text-white"
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <div className="text-right">
              <h1 className="text-lg font-bold text-white">Downloads</h1>
              <p className="text-sm text-gray-400">Access your workbooks</p>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
          )}

          {!loading && godModeEnabled && (
            <div className="mb-8 p-4 bg-gradient-to-r from-pink-500/10 to-teal-500/10 border border-pink-500/30 rounded-xl">
              <p className="text-sm text-center text-teal-400">
                <span className="font-bold">GOD MODE ACTIVE</span> - All downloads unlocked for testing
              </p>
            </div>
          )}

          {!loading && (
            <>
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-500 rounded-full"></span>
                  Main Systems
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mainDownloads.map((item) => (
                    <DownloadCard key={item.slug} item={item} />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-1 h-8 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></span>
                  Pattern Workbooks
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {patternDownloads.map((item) => (
                    <DownloadCard key={item.slug} item={item} />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
