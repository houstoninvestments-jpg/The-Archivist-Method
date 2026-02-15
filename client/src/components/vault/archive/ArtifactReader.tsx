// ============================================================
// THE ARCHIVIST VAULT — Artifact Reader
// In-portal PDF viewer with dark theme, TOC sidebar, page nav
// Uses react-pdf or PDF.js (configured at integration time)
// ============================================================

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  List,
  Bookmark,
  // Future: Highlighter, MessageSquare (annotations)
} from 'lucide-react';

interface TocEntry {
  title: string;
  page: number;
}

interface ArtifactReaderProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pdfUrl: string;
  totalPages: number;
  tableOfContents?: TocEntry[];
  onPageChange?: (page: number) => void;
}

export const ArtifactReader: React.FC<ArtifactReaderProps> = ({
  isOpen,
  onClose,
  title,
  pdfUrl,
  totalPages,
  tableOfContents = [],
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [tocOpen, setTocOpen] = useState(false);
  const [pageInput, setPageInput] = useState('');

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(clamped);
      onPageChange?.(clamped);
    },
    [totalPages, onPageChange]
  );

  const handlePageInputSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const num = parseInt(pageInput, 10);
      if (!isNaN(num)) {
        goToPage(num);
      }
      setPageInput('');
    },
    [pageInput, goToPage]
  );

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#1A1A1A] flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* TOC Sidebar */}
      <AnimatePresence>
        {tocOpen && tableOfContents.length > 0 && (
          <motion.aside
            className="w-72 bg-[#111] border-r border-[#333] flex flex-col"
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="px-4 py-3 border-b border-[#333]">
              <h3 className="text-[#E5E5E5]/50 text-xs uppercase tracking-widest">
                Table of Contents
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {tableOfContents.map((entry, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(entry.page)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200
                    ${
                      currentPage === entry.page
                        ? 'bg-[#14B8A6]/10 text-[#14B8A6]'
                        : 'text-[#E5E5E5]/60 hover:text-[#E5E5E5] hover:bg-[#1A1A1A]'
                    }
                  `}
                >
                  <span className="block truncate">{entry.title}</span>
                  <span className="text-[#E5E5E5]/20 text-xs">p. {entry.page}</span>
                </button>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main reader area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#333] bg-[#111]">
          <div className="flex items-center gap-3">
            {tableOfContents.length > 0 && (
              <button
                onClick={() => setTocOpen(!tocOpen)}
                className={`p-1.5 rounded transition-colors duration-200
                  ${tocOpen ? 'text-[#14B8A6]' : 'text-[#E5E5E5]/40 hover:text-[#E5E5E5]'}`}
                aria-label="Toggle table of contents"
              >
                <List size={18} />
              </button>
            )}
            <h2 className="text-white text-sm font-medium truncate max-w-md">{title}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Stub: Bookmark / Mark for Retrieval */}
            <button
              disabled
              className="p-1.5 rounded text-[#E5E5E5]/20 cursor-not-allowed"
              aria-label="Mark for Retrieval (coming soon)"
              title="Mark for Retrieval (coming soon)"
            >
              <Bookmark size={18} />
            </button>

            {/* Stub: Highlight (future) */}
            {/* <button disabled><Highlighter size={18} /></button> */}

            {/* Stub: Annotations (future) */}
            {/* <button disabled><MessageSquare size={18} /></button> */}

            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#E5E5E5]/40 hover:text-[#E5E5E5] transition-colors duration-200"
              aria-label="Close reader"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Content Area */}
        <div className="flex-1 overflow-auto flex items-start justify-center p-8 bg-[#0A0A0A]">
          {/*
            PDF Rendering Placeholder
            At integration time, replace this with react-pdf or PDF.js:

            import { Document, Page } from 'react-pdf';

            <Document file={pdfUrl}>
              <Page pageNumber={currentPage} />
            </Document>
          */}
          <div className="bg-[#1A1A1A] border border-[#333] rounded-lg w-full max-w-3xl min-h-[600px]
                          flex items-center justify-center">
            <div className="text-center">
              <p className="text-[#E5E5E5]/30 text-sm mb-2">PDF Viewer</p>
              <p className="text-[#E5E5E5]/15 text-xs">
                {pdfUrl} — Page {currentPage} of {totalPages}
              </p>
              <p className="text-[#E5E5E5]/10 text-xs mt-4">
                Wire react-pdf or PDF.js here at integration time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar: Page navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#333] bg-[#111]">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 text-[#E5E5E5]/40 hover:text-[#E5E5E5]
                       disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <ChevronLeft size={16} />
            <span className="text-sm">Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[#E5E5E5]/40 text-sm">Page</span>
            <form onSubmit={handlePageInputSubmit}>
              <input
                type="text"
                value={pageInput || currentPage}
                onChange={(e) => setPageInput(e.target.value)}
                onFocus={() => setPageInput(String(currentPage))}
                onBlur={() => setPageInput('')}
                className="w-12 bg-[#1A1A1A] border border-[#333] rounded text-center text-white text-sm py-1
                           focus:border-[#14B8A6]/50 focus:outline-none transition-colors duration-200"
              />
            </form>
            <span className="text-[#E5E5E5]/20 text-sm">of {totalPages}</span>
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 text-[#E5E5E5]/40 hover:text-[#E5E5E5]
                       disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span className="text-sm">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtifactReader;
