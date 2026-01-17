import { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  X, ZoomIn, ZoomOut, ChevronUp, ChevronDown, Download, Bookmark, 
  MessageCircle, BookOpen, Clock, CheckCircle, Send, Menu, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Bookmark {
  id: string;
  pageNumber: number;
  pageLabel: string | null;
  note: string | null;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
}

interface PremiumPDFViewerProps {
  pdfUrl: string;
  documentId: string;
  title: string;
  readingTimeMinutes?: number;
  onClose: () => void;
}

export default function PremiumPDFViewer({ 
  pdfUrl, 
  documentId,
  title, 
  readingTimeMinutes = 35,
  onClose 
}: PremiumPDFViewerProps) {
  const { toast } = useToast();
  
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set());
  const [pagesViewed, setPagesViewed] = useState<Set<number>>(new Set());
  const [percentComplete, setPercentComplete] = useState(0);
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const progressSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    document.body.style.overflow = 'hidden';
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('resize', handleResize);
      if (progressSaveTimeoutRef.current) clearTimeout(progressSaveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    loadProgress();
    loadBookmarks();
    loadChatHistory();
  }, [documentId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const loadProgress = async () => {
    try {
      const response = await fetch(`/api/portal/reader/progress/${documentId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.currentPage) setCurrentPage(data.currentPage);
        if (data.percentComplete) setPercentComplete(data.percentComplete);
        if (data.pagesViewed) setPagesViewed(new Set(data.pagesViewed));
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const saveProgress = useCallback((page: number, viewed: Set<number>) => {
    if (progressSaveTimeoutRef.current) clearTimeout(progressSaveTimeoutRef.current);
    
    progressSaveTimeoutRef.current = setTimeout(async () => {
      const percent = numPages > 0 ? Math.round((viewed.size / numPages) * 100) : 0;
      setPercentComplete(percent);
      
      try {
        await fetch('/api/portal/reader/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            documentId,
            currentPage: page,
            totalPages: numPages,
            percentComplete: percent,
            pagesViewed: Array.from(viewed),
          }),
        });
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    }, 1000);
  }, [documentId, numPages]);

  const loadBookmarks = async () => {
    try {
      const response = await fetch(`/api/portal/reader/bookmarks/${documentId}`);
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  const addBookmark = async () => {
    try {
      const response = await fetch('/api/portal/reader/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          pageNumber: currentPage,
          pageLabel: `Page ${currentPage}`,
          note: '',
        }),
      });
      
      if (response.ok) {
        const newBookmark = await response.json();
        setBookmarks([...bookmarks, newBookmark]);
        toast({ title: 'Bookmark Added', description: `Page ${currentPage} bookmarked` });
      }
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      toast({ title: 'Error', description: 'Failed to add bookmark', variant: 'destructive' });
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      await fetch(`/api/portal/reader/bookmarks/${id}`, { method: 'DELETE' });
      setBookmarks(bookmarks.filter(b => b.id !== id));
      toast({ title: 'Bookmark Removed' });
    } catch (error) {
      console.error('Failed to delete bookmark:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const response = await fetch(`/api/portal/reader/chat/${documentId}`);
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || isSendingChat) return;
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setIsSendingChat(true);
    
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      message: userMessage,
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prev => [...prev, tempUserMsg]);
    
    try {
      const response = await fetch('/api/portal/reader/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          documentId,
          currentPage,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          message: data.message,
          timestamp: new Date().toISOString(),
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      }
    } catch (error) {
      console.error('Failed to send chat message:', error);
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    } finally {
      setIsSendingChat(false);
    }
  };

  const trackDownload = async () => {
    try {
      await fetch('/api/portal/reader/track-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }
  };

  const handleDownload = () => {
    trackDownload();
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.replace(/\s+/g, '-')}.pdf`;
    link.click();
  };

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
    
    setPagesViewed(prev => {
      const updated = new Set(prev);
      updated.add(topMostPage);
      saveProgress(topMostPage, updated);
      return updated;
    });
  }, [numPages, saveProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => requestAnimationFrame(updateVisiblePages);
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

  function zoomIn() {
    setScale(prev => Math.min(prev + 0.2, 2.5));
  }

  function zoomOut() {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  }

  function handleClose() {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }

  const setPageRef = useCallback((pageNum: number, element: HTMLDivElement | null) => {
    if (element) pageRefs.current.set(pageNum, element);
    else pageRefs.current.delete(pageNum);
  }, []);

  const isBookmarked = bookmarks.some(b => b.pageNumber === currentPage);

  return (
    <div 
      className="fixed inset-0 z-[100] flex transition-opacity duration-200"
      style={{ 
        backgroundColor: '#0a0a0a',
        opacity: isVisible ? 1 : 0
      }}
    >
      <div className={`flex flex-col flex-1 ${!isMobile && showChat ? 'mr-[400px]' : ''}`}>
        <header 
          className="flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{ 
            background: 'rgba(10, 10, 10, 0.95)', 
            backdropFilter: 'blur(16px)',
            borderColor: 'rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="p-2 rounded-lg transition-all hover:bg-white/5"
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            
            <div>
              <h2 className="text-white font-semibold text-lg truncate max-w-[200px] md:max-w-[300px]">{title}</h2>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  ~{readingTimeMinutes} min
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-teal-500" />
                  {percentComplete}% complete
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isLoading && (
              <div 
                className="px-3 py-1.5 rounded-lg text-sm hidden md:flex items-center gap-2"
                style={{ background: 'rgba(20, 184, 166, 0.1)', border: '1px solid rgba(20, 184, 166, 0.2)' }}
              >
                <span className="font-bold text-teal-500">{currentPage}</span>
                <span className="text-gray-500">/</span>
                <span className="text-white">{numPages}</span>
              </div>
            )}
            
            <button
              onClick={zoomOut}
              className="p-2 rounded-lg transition-all hover:bg-white/5 hidden md:block"
              data-testid="button-zoom-out"
            >
              <ZoomOut className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={zoomIn}
              className="p-2 rounded-lg transition-all hover:bg-white/5 hidden md:block"
              data-testid="button-zoom-in"
            >
              <ZoomIn className="w-4 h-4 text-gray-400" />
            </button>
            
            <div className="w-px h-6 bg-white/10 mx-1 hidden md:block" />
            
            <button
              onClick={addBookmark}
              className={`p-2 rounded-lg transition-all ${isBookmarked ? 'bg-teal-500/20' : 'hover:bg-white/5'}`}
              data-testid="button-bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'text-teal-500 fill-teal-500' : 'text-gray-400'}`} />
            </button>
            
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={`p-2 rounded-lg transition-all ${showBookmarks ? 'bg-teal-500/20' : 'hover:bg-white/5'}`}
              data-testid="button-show-bookmarks"
            >
              <BookOpen className={`w-4 h-4 ${showBookmarks ? 'text-teal-500' : 'text-gray-400'}`} />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg transition-all hover:bg-white/5"
              data-testid="button-download"
            >
              <Download className="w-4 h-4 text-gray-400" />
            </button>
            
            <button
              onClick={() => setShowChat(!showChat)}
              className={`p-2 rounded-lg transition-all ${showChat ? 'bg-teal-500/20' : 'hover:bg-white/5'}`}
              data-testid="button-toggle-chat"
            >
              <MessageCircle className={`w-4 h-4 ${showChat ? 'text-teal-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </header>

        <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
          <Progress value={percentComplete} className="h-1" />
        </div>

        <div className="flex flex-1 overflow-hidden">
          {showBookmarks && (
            <div 
              className="w-64 border-r overflow-y-auto shrink-0 hidden md:block"
              style={{ 
                background: '#0d0d0d',
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              <div className="p-4">
                <h3 className="text-teal-500 font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Your Bookmarks
                </h3>
                
                {bookmarks.length === 0 ? (
                  <p className="text-gray-500 text-sm">No bookmarks yet. Click the bookmark icon to save pages.</p>
                ) : (
                  <div className="space-y-2">
                    {bookmarks.map(bookmark => (
                      <div 
                        key={bookmark.id}
                        className="p-3 rounded-lg bg-black/50 border border-white/5 group"
                        data-testid={`card-bookmark-${bookmark.id}`}
                      >
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => scrollToPage(bookmark.pageNumber)}
                            className="text-teal-500 font-medium text-sm hover:underline"
                            data-testid={`button-goto-bookmark-${bookmark.id}`}
                          >
                            {bookmark.pageLabel || `Page ${bookmark.pageNumber}`}
                          </button>
                          <button
                            onClick={() => deleteBookmark(bookmark.id)}
                            className="text-gray-500 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            data-testid={`button-delete-bookmark-${bookmark.id}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        {bookmark.note && (
                          <p className="text-gray-400 text-xs mt-1">{bookmark.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div 
            ref={containerRef}
            className="flex-1 overflow-auto scroll-smooth"
            style={{ background: 'rgba(20, 20, 20, 0.5)' }}
          >
            {isLoading && (
              <div className="flex flex-col items-center py-8 gap-4">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i}
                    className="rounded-lg animate-pulse"
                    style={{ 
                      width: isMobile ? '90%' : '600px',
                      height: '800px',
                      background: 'linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                ))}
              </div>
            )}
            
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
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
                        scale={isMobile ? 0.9 : scale}
                        width={isMobile ? window.innerWidth - 32 : undefined}
                        className="shadow-2xl"
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    ) : (
                      <div 
                        className="flex items-center justify-center bg-gray-900/50 rounded-lg"
                        style={{ width: isMobile ? window.innerWidth - 32 : `${595 * scale}px`, height: `${842 * scale}px` }}
                      >
                        <span className="text-gray-600 text-sm">Page {pageNum}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </Document>
          </div>
        </div>

        {!isLoading && numPages > 0 && (
          <div 
            className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10 hidden md:flex"
            style={{ right: !isMobile && showChat ? 'calc(400px + 24px)' : '24px' }}
          >
            <button
              onClick={goToPrevPage}
              disabled={currentPage <= 1}
              className="p-3 rounded-full transition-all hover:scale-110 disabled:opacity-40"
              style={{ 
                background: 'rgba(20, 184, 166, 0.2)', 
                border: '1px solid rgba(20, 184, 166, 0.3)',
                backdropFilter: 'blur(8px)'
              }}
              data-testid="button-prev-page"
            >
              <ChevronUp className="w-5 h-5 text-teal-500" />
            </button>
            
            <div 
              className="px-3 py-2 rounded-full text-center text-sm font-bold text-teal-500"
              style={{ 
                background: 'rgba(10, 10, 10, 0.8)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)'
              }}
            >
              {currentPage}
            </div>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage >= numPages}
              className="p-3 rounded-full transition-all hover:scale-110 disabled:opacity-40"
              style={{ 
                background: 'rgba(20, 184, 166, 0.2)', 
                border: '1px solid rgba(20, 184, 166, 0.3)',
                backdropFilter: 'blur(8px)'
              }}
              data-testid="button-next-page"
            >
              <ChevronDown className="w-5 h-5 text-teal-500" />
            </button>
          </div>
        )}
      </div>

      {showChat && (
        <div 
          className={`${isMobile ? 'fixed inset-0 z-[110]' : 'fixed right-0 top-0 w-[400px] h-full'} flex flex-col`}
          style={{ 
            background: '#0d0d0d',
            borderLeft: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div>
              <h3 className="text-teal-500 font-semibold flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Ask About This Document
              </h3>
              <p className="text-gray-500 text-xs mt-1">AI assistant for {title}</p>
            </div>
            <button 
              onClick={() => setShowChat(false)}
              className="p-2 rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {chatMessages.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-700 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Ask any question about the document</p>
                <p className="text-gray-600 text-xs mt-1">Currently on page {currentPage}</p>
              </div>
            )}
            
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-xl ${
                    msg.role === 'user' 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-black/50 text-gray-300 border border-white/5'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
            
            {isSendingChat && (
              <div className="flex gap-3">
                <div className="bg-black/50 border border-white/5 p-3 rounded-xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div className="flex gap-2">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendChatMessage();
                  }
                }}
                placeholder="Ask a question..."
                className="flex-1 bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:border-teal-500/50"
                rows={2}
                data-testid="input-chat"
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || isSendingChat}
                className="p-3 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                data-testid="button-send-chat"
              >
                <Send className="w-5 h-5 text-black" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isMobile && !showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 p-4 bg-teal-500 rounded-full shadow-lg z-[105]"
          style={{ boxShadow: '0 4px 20px rgba(20, 184, 166, 0.4)' }}
          data-testid="button-mobile-chat"
        >
          <MessageCircle className="w-6 h-6 text-black" />
        </button>
      )}

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
