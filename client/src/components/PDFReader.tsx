import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFReaderProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
  initialPage?: number;
}

export default function PDFReader({ pdfUrl, title, onClose, initialPage = 1 }: PDFReaderProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.0);
  const [jumpToPage, setJumpToPage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade-in animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function goToPrevPage() {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  }

  function goToNextPage() {
    setPageNumber((prev) => Math.min(prev + 1, numPages));
  }

  function handleJumpToPage() {
    const page = parseInt(jumpToPage, 10);
    if (page >= 1 && page <= numPages) {
      setPageNumber(page);
      setJumpToPage('');
    }
  }

  function zoomIn() {
    setScale((prev) => Math.min(prev + 0.2, 2.5));
  }

  function zoomOut() {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  }

  function handleClose() {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col transition-opacity duration-200"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        opacity: isVisible ? 1 : 0
      }}
    >
      {/* Header */}
      <header 
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ 
          background: 'rgba(3, 3, 3, 0.9)', 
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="flex items-center gap-4">
          <h2 className="text-white font-semibold text-lg truncate max-w-[300px]">{title}</h2>
          {!isLoading && (
            <span className="text-gray-500 text-sm hidden md:block">
              {numPages} pages
            </span>
          )}
        </div>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            data-testid="button-zoom-out"
          >
            <ZoomOut className="w-4 h-4 text-gray-400" />
          </button>
          <span className="text-gray-400 text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            data-testid="button-zoom-in"
          >
            <ZoomIn className="w-4 h-4 text-gray-400" />
          </button>
          
          <div className="w-px h-6 mx-2" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />
          
          <button
            onClick={handleClose}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.2)' }}
            data-testid="button-close-reader"
          >
            <X className="w-5 h-5" style={{ color: '#EC4899' }} />
          </button>
        </div>
      </header>

      {/* PDF Content Area */}
      <div 
        className="flex-1 overflow-auto flex items-start justify-center py-6 px-4"
        style={{ background: 'rgba(20, 20, 20, 0.5)' }}
      >
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div 
              className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'rgba(20, 184, 166, 0.3)', borderTopColor: '#14B8A6' }}
            />
            <p className="text-gray-400">Loading document...</p>
          </div>
        )}
        
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={null}
          className="flex justify-center"
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale}
            className="shadow-2xl"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>

      {/* Navigation Footer */}
      <footer 
        className="px-4 py-3 border-t"
        style={{ 
          background: 'rgba(3, 3, 3, 0.9)', 
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {/* Previous Button */}
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}
            data-testid="button-prev-page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page Indicator */}
          <div 
            className="px-4 py-2 rounded-lg text-sm"
            style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.2)' }}
          >
            <span className="text-gray-400">Page </span>
            <span className="font-bold" style={{ color: '#14B8A6' }}>{pageNumber}</span>
            <span className="text-gray-400"> of </span>
            <span className="font-bold text-white">{numPages}</span>
          </div>

          {/* Next Button */}
          <button
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#fff'
            }}
            data-testid="button-next-page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-px h-6 hidden md:block" style={{ background: 'rgba(255, 255, 255, 0.1)' }} />

          {/* Jump to Page */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={numPages}
              value={jumpToPage}
              onChange={(e) => setJumpToPage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleJumpToPage()}
              placeholder="Page #"
              className="w-20 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none"
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)' 
              }}
              data-testid="input-jump-page"
            />
            <button
              onClick={handleJumpToPage}
              className="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
              style={{ 
                background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                color: '#000'
              }}
              data-testid="button-jump-page"
            >
              Go
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
