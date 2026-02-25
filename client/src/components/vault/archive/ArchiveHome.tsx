// ============================================================
// THE ARCHIVIST VAULT — Archive Home
// Grid of Artifact Cards showing all products with lock status
// ============================================================

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ArtifactCard from './ArtifactCard';
import ArtifactReader from './ArtifactReader';
import RecentlyOpened from './RecentlyOpened';
import type { Artifact } from '@/types/vault';

interface ArchiveHomeProps {
  userId: string;
  ownedProducts: string[]; // ['quick-start', 'complete-archive']
  onPurchase: (product: string) => void;
}

// Static artifact registry — maps to actual content
const allArtifacts: Artifact[] = [
  {
    id: 'quick-start-system',
    title: 'Quick-Start System',
    description: '90-day protocol for your primary pattern. Identify, interrupt, override.',
    product: 'quick-start',
    isLocked: true, // Overridden dynamically
    price: 47,
    contentType: 'framework',
    collection: 'Core Systems',
    pdfUrl: '/products/quick-start-system.pdf',
    pageCount: 85,
  },
  {
    id: 'complete-archive',
    title: 'The Complete Archive',
    description: 'Full 685-page system. All 9 patterns. Every framework, script, and tool.',
    product: 'complete-archive',
    isLocked: true,
    price: 197,
    contentType: 'framework',
    collection: 'Core Systems',
    pdfUrl: '/products/complete-archive.pdf',
    pageCount: 685,
  },
  {
    id: 'module-0-emergency',
    title: 'Emergency Protocol',
    description: 'When a pattern is running and you need to interrupt it right now.',
    product: 'complete-archive',
    isLocked: true,
    contentType: 'tool',
    collection: 'Modules',
  },
  {
    id: 'module-1-foundation',
    title: 'Foundation',
    description: 'The core framework. Survival code, body signatures, the original room.',
    product: 'complete-archive',
    isLocked: true,
    contentType: 'framework',
    collection: 'Modules',
  },
  {
    id: 'module-2-four-doors',
    title: 'The Four Doors',
    description: 'How patterns enter: thoughts, emotions, body, behavior.',
    product: 'complete-archive',
    isLocked: true,
    contentType: 'framework',
    collection: 'Modules',
  },
  {
    id: 'module-4-implementation',
    title: 'Implementation Guide',
    description: 'The practical protocol. Circuit breaks, overrides, daily practice.',
    product: 'complete-archive',
    isLocked: true,
    contentType: 'tool',
    collection: 'Modules',
  },
  {
    id: 'module-5-advanced',
    title: 'Advanced Techniques',
    description: 'Pattern archaeology, multi-pattern work, long-term rewiring.',
    product: 'complete-archive',
    isLocked: true,
    contentType: 'framework',
    collection: 'Modules',
  },
  {
    id: 'module-7-field-notes',
    title: 'Field Notes',
    description: 'Templates for tracking your patterns in the wild.',
    product: 'complete-archive',
    isLocked: true,
    contentType: 'tool',
    collection: 'Resources',
  },
  {
    id: 'module-8-resources',
    title: 'Resources',
    description: 'Additional support materials, references, and recommended reading.',
    product: 'complete-archive',
    isLocked: true,
    contentType: 'example',
    collection: 'Resources',
  },
];

export const ArchiveHome: React.FC<ArchiveHomeProps> = ({
  userId,
  ownedProducts,
  onPurchase,
}) => {
  const [readerOpen, setReaderOpen] = useState(false);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);

  // Resolve lock status based on owned products
  const artifacts = allArtifacts.map((a) => ({
    ...a,
    isLocked: !ownedProducts.includes(a.product),
  }));

  // Group by collection
  const collections = artifacts.reduce<Record<string, Artifact[]>>((acc, a) => {
    if (!acc[a.collection]) acc[a.collection] = [];
    acc[a.collection].push(a);
    return acc;
  }, {});

  const handleOpenArtifact = useCallback(
    async (artifactId: string) => {
      const artifact = artifacts.find((a) => a.id === artifactId);
      if (!artifact || artifact.isLocked) return;

      // Log activity
      try {
        const { supabase } = await import('@/lib/supabase');
        await supabase.from('user_activity').insert({
          user_id: userId,
          artifact_id: artifactId,
          action: 'opened',
        });
      } catch (err) {
        console.error('Failed to log activity:', err);
      }

      if (artifact.pdfUrl) {
        setActiveArtifact(artifact);
        setReaderOpen(true);
      }
    },
    [artifacts, userId]
  );

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-light tracking-tight">The Archive</h1>
          <p className="text-[#E5E5E5]/40 text-sm mt-1">
            Your classified files. Frameworks, scripts, and tools.
          </p>
        </motion.div>

        {/* Recently Opened */}
        <motion.section
          className="mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <RecentlyOpened userId={userId} onOpenArtifact={handleOpenArtifact} />
        </motion.section>

        {/* Collections */}
        {Object.entries(collections).map(([collectionName, collectionArtifacts], ci) => (
          <motion.section
            key={collectionName}
            className="mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + ci * 0.08, duration: 0.4 }}
          >
            <h2 className="text-[#E5E5E5]/30 text-xs uppercase tracking-widest mb-4">
              {collectionName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {collectionArtifacts.map((artifact) => (
                <ArtifactCard
                  key={artifact.id}
                  title={artifact.title}
                  description={artifact.description}
                  coverImage={artifact.coverImage}
                  isLocked={artifact.isLocked}
                  price={artifact.price}
                  onOpen={() => handleOpenArtifact(artifact.id)}
                  onPurchase={() => onPurchase(artifact.product)}
                />
              ))}
            </div>
          </motion.section>
        ))}
      </div>

      {/* PDF Reader */}
      {activeArtifact && (
        <ArtifactReader
          isOpen={readerOpen}
          onClose={() => {
            setReaderOpen(false);
            setActiveArtifact(null);
          }}
          title={activeArtifact.title}
          pdfUrl={activeArtifact.pdfUrl ?? ''}
          totalPages={activeArtifact.pageCount ?? 1}
        />
      )}
    </div>
  );
};

export default ArchiveHome;
