import { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ZoomIn, ZoomOut, ChevronUp, ChevronDown, FileWarning, Download } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFReaderProps {
  pdfUrl: string;
  title: string;
  onClose: () => void;
  initialPage?: number;
}

export default function PDFReader({ pdfUrl, title, onClose, initialPage = 1 }: PDFReaderProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1.0);
  const [jumpToPage, setJumpToPage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    if (numPages > 0 && initialPage > 1) {
      setTimeout(() => {
        scrollToPage(initialPage);
      }, 100);
    }
  }, [numPages, initialPage]);

  const updateVisiblePages = useCallback(() => {
    if (!containerRef.current || numPages === 0) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const buffer = 2;
    
    let newVisiblePages = new Set<number>();
    let topMostPage = 1;
    let topMostOffset = Infinity;
    
    pageRefs.current.forEach((element, pageNum) => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.bottom > containerRect.top && rect.top < containerRect.bottom;
      
      if (isVisible) {
        for (let i = Math.max(1, pageNum - buffer); i <= Math.min(numPages, pageNum + buffer); i++) {
          newVisiblePages.add(i);
        }
        
        const distanceFromTop = Math.abs(rect.top - containerRect.top);
        if (rect.top <= containerRect.top + containerRect.height / 3 && distanceFromTop < topMostOffset) {
          topMostOffset = distanceFromTop;
          topMostPage = pageNum;
        }
      }
    });
    
    if (newVisiblePages.size === 0) {
      for (let i = 1; i <= Math.min(5, numPages); i++) {
        newVisiblePages.add(i);
      }
    }
    
    setVisiblePages(newVisiblePages);
    setCurrentPage(topMostPage);
  }, [numPages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      requestAnimationFrame(updateVisiblePages);
    };
    
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [updateVisiblePages]);

  useEffect(() => {
    if (numPages > 0) {
      const initialVisible = new Set<number>();
      for (let i = 1; i <= Math.min(5, numPages); i++) {
        initialVisible.add(i);
      }
      setVisiblePages(initialVisible);
    }
  }, [numPages]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
    setLoadError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    setIsLoading(false);
    setLoadError('PDF coming soon - use Download button below');
  }

  function scrollToPage(pageNum: number) {
    const element = pageRefs.current.get(pageNum);
    if (element && containerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function goToPrevPage() {
    const newPage = Math.max(currentPage - 1, 1);
    scrollToPage(newPage);
  }

  function goToNextPage() {
    const newPage = Math.min(currentPage + 1, numPages);
    scrollToPage(newPage);
  }

  function handleJumpToPage() {
    const page = parseInt(jumpToPage, 10);
    if (page >= 1 && page <= numPages) {
      scrollToPage(page);
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

  const setPageRef = useCallback((pageNum: number, element: HTMLDivElement | null) => {
    if (element) {
      pageRefs.current.set(pageNum, element);
    } else {
      pageRefs.current.delete(pageNum);
    }
  }, []);

  return (
    <div 
      className="fixed inset-0 z-[100] flex flex-col transition-opacity duration-200"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        opacity: isVisible ? 1 : 0
      }}
    >
      <header 
        className="flex items-center justify-between px-4 py-3 border-b shrink-0"
        style={{ 
          background: 'rgba(3, 3, 3, 0.9)', 
          backdropFilter: 'blur(16px)',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}
      >
        <div className="flex items-center gap-4">
          <h2 className="text-white font-semibold text-lg truncate max-w-[300px]">{title}</h2>
          {!isLoading && !loadError && (
            <div 
              className="px-3 py-1.5 rounded-lg text-sm hidden md:flex items-center gap-2"
              style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.2)' }}
            >
              <span className="font-bold" style={{ color: '#14B8A6' }}>{currentPage}</span>
              <span className="text-gray-400">/</span>
              <span className="text-white">{numPages}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!loadError && (
            <>
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
            </>
          )}
          
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

      <div 
        ref={containerRef}
        className="flex-1 overflow-auto scroll-smooth"
        style={{ background: 'rgba(20, 20, 20, 0.5)' }}
      >
        {isLoading && !loadError && (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div 
              className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'rgba(20, 184, 166, 0.3)', borderTopColor: '#14B8A6' }}
            />
            <p className="text-gray-400">Loading document...</p>
          </div>
        )}

        {loadError && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center max-w-md mx-auto px-4">
            <div 
              className="p-6 rounded-2xl"
              style={{ 
                background: 'rgba(236, 72, 153, 0.1)', 
                border: '1px solid rgba(236, 72, 153, 0.2)',
                boxShadow: '0 0 40px rgba(236, 72, 153, 0.1)'
              }}
            >
              <FileWarning className="w-16 h-16 mx-auto mb-4" style={{ color: '#EC4899' }} />
              <h3 className="text-xl font-bold text-white mb-2">PDF Not Available</h3>
              <p className="text-gray-400 mb-6">{loadError}</p>
              <button
                onClick={handleClose}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-lg font-semibold text-black transition-all duration-300 hover:scale-[1.02]"
                style={{ 
                  background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                  boxShadow: '0 4px 20px rgba(20, 184, 166, 0.25)'
                }}
                data-testid="button-close-error"
              >
                <Download className="w-4 h-4" />
                <span>Close & Use Download</span>
              </button>
            </div>
          </div>
        )}
        
        {!loadError && (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className="flex flex-col items-center py-6 gap-4"
          >
            {Array.from({ length: numPages }, (_, index) => {
              const pageNum = index + 1;
              const shouldRender = visiblePages.has(pageNum);
              
              return (
                <div
                  key={pageNum}
                  ref={(el) => setPageRef(pageNum, el)}
                  className="relative"
                  style={{ minHeight: shouldRender ? 'auto' : '800px' }}
                >
                  {shouldRender ? (
                    <Page 
                      pageNumber={pageNum}
                      scale={scale}
                      className="shadow-2xl"
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  ) : (
                    <div 
                      className="flex items-center justify-center bg-gray-900/50 rounded-lg"
                      style={{ width: `${595 * scale}px`, height: `${842 * scale}px` }}
                    >
                      <span className="text-gray-600 text-sm">Page {pageNum}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </Document>
        )}
      </div>

      {!loadError && numPages > 0 && (
        <div 
          className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10"
          style={{ pointerEvents: 'auto' }}
        >
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className="p-3 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ 
              background: 'rgba(20, 184, 166, 0.2)', 
              border: '1px solid rgba(20, 184, 166, 0.3)',
              backdropFilter: 'blur(8px)'
            }}
            data-testid="button-prev-page"
          >
            <ChevronUp className="w-5 h-5" style={{ color: '#14B8A6' }} />
          </button>
          
          <div 
            className="px-3 py-2 rounded-full text-center text-sm font-bold"
            style={{ 
              background: 'rgba(3, 3, 3, 0.8)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              color: '#14B8A6'
            }}
          >
            {currentPage}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage >= numPages}
            className="p-3 rounded-full transition-all duration-200 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ 
              background: 'rgba(20, 184, 166, 0.2)', 
              border: '1px solid rgba(20, 184, 166, 0.3)',
              backdropFilter: 'blur(8px)'
            }}
            data-testid="button-next-page"
          >
            <ChevronDown className="w-5 h-5" style={{ color: '#14B8A6' }} />
          </button>
        </div>
      )}

      {!loadError && numPages > 0 && (
        <footer 
          className="px-4 py-3 border-t shrink-0"
          style={{ 
            background: 'rgba(3, 3, 3, 0.9)', 
            backdropFilter: 'blur(16px)',
            borderColor: 'rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <div 
              className="px-4 py-2 rounded-lg text-sm md:hidden"
              style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.2)' }}
            >
              <span className="text-gray-400">Page </span>
              <span className="font-bold" style={{ color: '#14B8A6' }}>{currentPage}</span>
              <span className="text-gray-400"> of </span>
              <span className="font-bold text-white">{numPages}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={numPages}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJumpToPage()}
                placeholder="Jump to..."
                className="w-24 px-3 py-2 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                data-testid="input-jump-page"
              />
              <button
                onClick={handleJumpToPage}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-[1.02]"
                style={{ 
                  background: 'linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)',
                  color: '#000'
                }}
                data-testid="button-jump-page"
              >
                Go
              </button>
            </div>
            
            <span className="text-gray-500 text-sm hidden sm:block">Scroll to read continuously</span>
          </div>
        </footer>
      )}
    </div>
  );
}
