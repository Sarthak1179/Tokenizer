import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordNode } from '../types/nlp';
import { SEMANTIC_CLUSTERS } from '../data/defaultVocabulary';
import { findNearestNeighbors } from '../utils/tokenizerEngine';
import { X, ChevronRight } from 'lucide-react';

interface NodeTooltipProps {
  node: WordNode | null;
  vocabulary: WordNode[];
  onClose?: () => void;
  onSelectNeighbor?: (word: WordNode) => void;
}

export const NodeTooltip: React.FC<NodeTooltipProps> = ({
  node,
  vocabulary,
  onClose,
  onSelectNeighbor
}) => {
  if (!node) return null;

  const cluster = SEMANTIC_CLUSTERS[node.category] || {
    name: 'Custom',
    color: node.color,
    description: 'Custom entity.'
  };

  const neighbors = useMemo(() => {
    return findNearestNeighbors(node.denseVector, vocabulary.filter(w => w.id !== node.id), 3);
  }, [node, vocabulary]);

  const norm = Math.sqrt(
    node.coords[0] * node.coords[0] +
    node.coords[1] * node.coords[1] +
    node.coords[2] * node.coords[2]
  ).toFixed(2);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="backdrop-blur-md bg-black/85 border border-white/10 rounded-xl p-4 w-72 sm:w-80 shadow-2xl pointer-events-auto font-sans"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: node.color }}
              />
              <h3 className="text-base font-bold font-mono text-white capitalize">
                &quot;{node.word}&quot;
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400 mt-0.5 block">
              Domain: {cluster.name}
            </span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 3D Coordinates Grid */}
        <div className="grid grid-cols-3 gap-1.5 my-3 text-center font-mono">
          <div className="p-1.5 rounded bg-white/5 border border-white/5">
            <span className="text-[9px] text-rose-400 block font-semibold">X</span>
            <span className="text-xs font-bold text-white">
              {node.coords[0] >= 0 ? `+${node.coords[0].toFixed(2)}` : node.coords[0].toFixed(2)}
            </span>
          </div>
          <div className="p-1.5 rounded bg-white/5 border border-white/5">
            <span className="text-[9px] text-emerald-400 block font-semibold">Y</span>
            <span className="text-xs font-bold text-white">
              {node.coords[1] >= 0 ? `+${node.coords[1].toFixed(2)}` : node.coords[1].toFixed(2)}
            </span>
          </div>
          <div className="p-1.5 rounded bg-white/5 border border-white/5">
            <span className="text-[9px] text-blue-400 block font-semibold">Z</span>
            <span className="text-xs font-bold text-white">
              {node.coords[2] >= 0 ? `+${node.coords[2].toFixed(2)}` : node.coords[2].toFixed(2)}
            </span>
          </div>
        </div>

        {/* Nearest Semantic Neighbors */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1.5">
            <span>Nearest Neighbors:</span>
            <span>||v|| = {norm}</span>
          </div>

          <div className="space-y-1">
            {neighbors.map(({ word: neighbor, similarity }) => (
              <button
                key={neighbor.id}
                onClick={() => onSelectNeighbor?.(neighbor)}
                className="w-full flex items-center justify-between p-1.5 px-2 rounded bg-white/5 hover:bg-white/10 transition-colors text-xs font-mono group"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: neighbor.color }}
                  />
                  <span className="text-neutral-200 group-hover:text-blue-400">
                    {neighbor.word}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-blue-400 text-[11px]">
                  <span>{(similarity * 100).toFixed(0)}%</span>
                  <ChevronRight className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
