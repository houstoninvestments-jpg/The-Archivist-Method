import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import PremiumPDFViewer from '@/components/PremiumPDFViewer';

interface DocumentConfig {
  id: string;
  title: string;
  pdfUrl: string;
  readingTimeMinutes: number;
}

const DOCUMENTS: Record<string, DocumentConfig> = {
  'quick-start': {
    id: 'quick-start',
    title: '90-Day Quick-Start System',
    pdfUrl: '/downloads/quick-start-system.pdf',
    readingTimeMinutes: 35,
  },
  'complete-archive': {
    id: 'complete-archive',
    title: 'Complete Pattern Archive',
    pdfUrl: '/downloads/complete-archive.pdf',
    readingTimeMinutes: 90,
  },
};

export default function PortalReader() {
  const params = useParams<{ documentId: string }>();
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const documentId = params.documentId || 'quick-start';
  const document = DOCUMENTS[documentId];

  useEffect(() => {
    checkAccess();
  }, [documentId]);

  const checkAccess = async () => {
    try {
      const response = await fetch('/api/portal/user-data');
      
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          setLocation('/portal/login');
          return;
        }
        throw new Error('Failed to verify access');
      }

      const data = await response.json();
      setIsAuthenticated(true);

      const userHasAccess = 
        (documentId === 'quick-start' && data.hasQuickStart) ||
        (documentId === 'complete-archive' && data.hasCompleteArchive) ||
        data.purchases?.some(
          (p: { productId?: string; product_id?: string }) => 
            p.productId === documentId || p.product_id === documentId
        );

      setHasAccess(userHasAccess);
    } catch (error) {
      console.error('Access check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setLocation('/portal/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md p-8 bg-red-500/5 border border-red-500/30 rounded-2xl text-center">
          <p className="text-red-400 mb-6">Please log in to access this document</p>
          <button
            onClick={() => setLocation('/portal/login')}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg text-black font-semibold transition-colors"
            data-testid="button-login-redirect"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md p-8 bg-red-500/5 border border-red-500/30 rounded-2xl text-center">
          <p className="text-red-400 mb-6">Document not found</p>
          <button
            onClick={() => setLocation('/portal/dashboard')}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg text-black font-semibold transition-colors"
            data-testid="button-back-dashboard"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md p-8 bg-amber-500/5 border border-amber-500/30 rounded-2xl text-center">
          <p className="text-amber-400 mb-6">You don't have access to this document. Please purchase it first.</p>
          <button
            onClick={() => setLocation('/portal/dashboard')}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg text-black font-semibold transition-colors"
            data-testid="button-back-dashboard-noaccess"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <PremiumPDFViewer
      pdfUrl={document.pdfUrl}
      documentId={document.id}
      title={document.title}
      readingTimeMinutes={document.readingTimeMinutes}
      onClose={handleClose}
    />
  );
}
