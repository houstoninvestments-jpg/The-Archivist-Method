import { useState } from 'react';
import { Download, Maximize2, Minimize2, FileText, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
  downloadEndpoint?: string;
}

export default function PDFViewer({ pdfUrl, title, downloadEndpoint }: PDFViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleDownload = () => {
    if (downloadEndpoint) {
      window.open(downloadEndpoint, '_blank');
    } else {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = pdfUrl.split('/').pop() || 'workbook.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`pdf-viewer ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative'}`}>
      <div className="flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-[#333]">
        <div className="flex items-center gap-4">
          {title && (
            <h2 className="text-lg font-bold text-white">{title}</h2>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10"
            data-testid="button-pdf-download"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-gray-400 hover:text-white"
            data-testid="button-pdf-fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
      
      <div className={`pdf-container ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[800px]'}`}>
        {hasError ? (
          <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
            <div className="text-center p-8 max-w-md">
              <Construction className="w-16 h-16 text-teal-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-gray-400 mb-6">
                This workbook is being prepared for you. Use the Download button to get the latest version when available.
              </p>
              <Button
                onClick={handleDownload}
                className="bg-teal-500 hover:bg-teal-600 text-black"
              >
                <Download className="w-4 h-4 mr-2" />
                Try Download
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            className="w-full h-full border-0"
            title={title || 'PDF Viewer'}
            data-testid="iframe-pdf-viewer"
            onError={() => setHasError(true)}
          />
        )}
      </div>
    </div>
  );
}
