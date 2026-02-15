// ============================================================
// THE ARCHIVIST VAULT — Artifact Card
// Individual content card with locked/unlocked states
// ============================================================

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, FileText } from 'lucide-react';
import type { ArtifactCardProps } from '@/types/vault';

export const ArtifactCard: React.FC<ArtifactCardProps> = ({
  title,
  description,
  coverImage,
  isLocked,
  price,
  onOpen,
  onPurchase,
}) => {
  return (
    <motion.div
      className={`group relative bg-[#111] border border-[#333] rounded-xl overflow-hidden
                  transition-all duration-400 cursor-pointer
                  ${isLocked ? 'opacity-80' : 'hover:border-[#14B8A6]/40'}`}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: 'easeOut' } }}
      onClick={isLocked ? onPurchase : onOpen}
    >
      {/* Cover image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0A0A0A]">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-400
                       ${isLocked ? 'grayscale brightness-50' : 'group-hover:scale-105'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText
              className={`w-12 h-12 transition-colors duration-300
                         ${isLocked ? 'text-[#333]' : 'text-[#14B8A6]/20 group-hover:text-[#14B8A6]/40'}`}
            />
          </div>
        )}

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-12 h-12 rounded-full bg-[#1A1A1A]/80 border border-[#333]
                            flex items-center justify-center backdrop-blur-sm">
              <Lock className="w-5 h-5 text-[#E5E5E5]/50" />
            </div>
          </div>
        )}

        {/* Hover glow effect */}
        {!isLocked && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                          bg-gradient-to-t from-[#14B8A6]/5 to-transparent
                          transition-opacity duration-400 pointer-events-none" />
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-white text-sm font-semibold mb-1 line-clamp-2">{title}</h3>
        <p className="text-[#E5E5E5]/40 text-xs line-clamp-2 mb-3">{description}</p>

        {isLocked ? (
          <div className="flex items-center justify-between">
            <span className="text-[#E5E5E5]/50 text-xs">${price}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPurchase?.();
              }}
              className="text-[#14B8A6] text-xs font-medium hover:text-[#14B8A6]/80
                         transition-colors duration-300"
            >
              Retrieve
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen();
            }}
            className="text-[#14B8A6] text-xs font-medium hover:text-[#14B8A6]/80
                       transition-colors duration-300"
          >
            Open File
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ArtifactCard;
