import { useRoute, useLocation } from 'wouter';
import { useEffect, useState } from 'react';
import { ArrowLeft, Lock, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PDFViewer from '@/components/PDFViewer';
import { isGodModeEnabled } from '@/components/TestingPanel';
import GodModeBadge from '@/components/GodModeBadge';

interface UserEntitlements {
  hasCrashCourse: boolean;
  hasQuickStart: boolean;
  hasArchive: boolean;
}

const workbookData: Record<string, { title: string; pdfPath: string; tier: string; description: string }> = {
  'crash-course': {
    title: 'Crash Course Workbook',
    pdfPath: '/pdfs/crash-course-workbook.pdf',
    tier: 'free',
    description: '7-day pattern recognition guide'
  },
  'quick-start': {
    title: 'Quick-Start System Workbook',
    pdfPath: '/pdfs/quick-start-workbook.pdf',
    tier: 'quick-start',
    description: '90-day pattern interruption protocol'
  },
  'archive': {
    title: 'Complete Archive Workbook',
    pdfPath: '/pdfs/complete-archive-workbook.pdf',
    tier: 'archive',
    description: 'All 7 patterns + advanced protocols'
  },
  'disappearing': {
    title: 'The Disappearing Pattern',
    pdfPath: '/pdfs/disappearing-pattern-workbook.pdf',
    tier: 'archive',
    description: 'Ghost before they leave you'
  },
  'apology-loop': {
    title: 'The Apology Loop',
    pdfPath: '/pdfs/apology-loop-workbook.pdf',
    tier: 'archive',
    description: 'Over-apologize to pre-empt rejection'
  },
  'testing': {
    title: 'The Testing Pattern',
    pdfPath: '/pdfs/testing-pattern-workbook.pdf',
    tier: 'archive',
    description: 'Create conflict to prove they will leave'
  },
  'attraction-to-harm': {
    title: 'Attraction to Harm',
    pdfPath: '/pdfs/attraction-to-harm-workbook.pdf',
    tier: 'archive',
    description: 'Seek what damages you'
  },
  'compliment-deflection': {
    title: 'Compliment Deflection',
    pdfPath: '/pdfs/compliment-deflection-workbook.pdf',
    tier: 'archive',
    description: 'Reject positive recognition'
  },
  'draining-bond': {
    title: 'The Draining Bond',
    pdfPath: '/pdfs/draining-bond-workbook.pdf',
    tier: 'archive',
    description: 'Stay in exhausting relationships'
  },
  'success-sabotage': {
    title: 'Success Sabotage',
    pdfPath: '/pdfs/success-sabotage-workbook.pdf',
    tier: 'archive',
    description: 'Undermine your own achievements'
  }
};

export default function PortalWorkbook() {
  const [, params] = useRoute('/portal/workbook/:slug');
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(true);
  const [entitlements, setEntitlements] = useState<UserEntitlements>({
    hasCrashCourse: false,
    hasQuickStart: false,
    hasArchive: false
  });
  const slug = params?.slug || '';
  const workbook = workbookData[slug];
  const godModeEnabled = isGodModeEnabled();

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

  if (!workbook) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md p-8 bg-red-500/5 border border-red-500/30 rounded-2xl text-center">
          <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Workbook Not Found</h1>
          <p className="text-gray-400 mb-6">The requested workbook does not exist.</p>
          <Button
            onClick={() => setLocation('/portal/downloads')}
            className="bg-teal-500 hover:bg-teal-600 text-black"
            data-testid="button-back-to-downloads"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Downloads
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  const hasAccess = checkAccess(workbook.tier);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black">
        <GodModeBadge />
        
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => setLocation('/portal/downloads')}
              className="text-gray-400 hover:text-white"
              data-testid="button-back"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Downloads
            </Button>
          </div>
        </header>
        
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="p-8 bg-white/5 border border-white/10 rounded-2xl">
            <Lock className="w-16 h-16 text-pink-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">{workbook.title}</h1>
            <p className="text-gray-400 mb-6">{workbook.description}</p>
            
            <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg mb-6">
              <p className="text-pink-400 text-sm">
                This workbook requires the <strong>{workbook.tier === 'quick-start' ? 'Quick-Start' : 'Complete Archive'}</strong> tier.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={() => setLocation(workbook.tier === 'quick-start' ? '/quick-start' : '/complete-archive')}
                className="w-full bg-gradient-to-r from-pink-500 to-teal-500 text-white hover:opacity-90"
                data-testid="button-upgrade"
              >
                Upgrade to Access
              </Button>
              <p className="text-xs text-gray-500">
                Or enable God Mode in the Testing Panel to bypass for testing.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <GodModeBadge />
      
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setLocation('/portal/downloads')}
            className="text-gray-400 hover:text-white"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Downloads
          </Button>
          
          <div className="text-right">
            <h1 className="text-lg font-bold text-white">{workbook.title}</h1>
            <p className="text-sm text-gray-400">{workbook.description}</p>
          </div>
        </div>
      </header>
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        <PDFViewer 
          pdfUrl={workbook.pdfPath} 
          title={workbook.title}
        />
      </div>
    </div>
  );
}
