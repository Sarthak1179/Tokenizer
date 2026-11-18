import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Layers, Cpu, Compass } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0A0A0A] border border-white/10 rounded-xl p-6 shadow-2xl z-10 font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-semibold text-white">
                NLP Architecture & VectorSpace Guide
              </h3>
              <p className="text-xs text-neutral-400">
                Foundations of modern subword tokenizers and spatial embeddings.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 pt-4 text-xs text-neutral-300">
            <div className="p-3.5 rounded-lg bg-[#111111] border border-white/5">
              <div className="flex items-center gap-1.5 font-mono font-semibold text-white mb-1.5">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>1. Tokenization & Subword Segmentation</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Modern LLMs like GPT and LLaMA do not read words as monolithic strings. Subword algorithms like Byte-Pair Encoding (BPE) and WordPiece break text into tokens based on frequency statistics in training corpora. Compound words split cleanly into prefixes, roots, and suffixes.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#111111] border border-white/5">
              <div className="flex items-center gap-1.5 font-mono font-semibold text-white mb-1.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>2. High-Dimensional Vector Embeddings</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Tokens index into an embedding matrix where each discrete token ID maps to a continuous vector in high-dimensional space (typically 768 to 4096 dimensions). Tokens that share semantic or syntactic roles point in similar directions.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#111111] border border-white/5">
              <div className="flex items-center gap-1.5 font-mono font-semibold text-white mb-1.5">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>3. 3D Cartesian Projection & Vector Arithmetic</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                By projecting high-dimensional vectors onto 3 Cartesian axes (X, Y, Z) via dimensionality reduction (PCA/t-SNE/UMAP), clusters become visually navigable. Semantic relationships form linear offset vectors (e.g., King - Man + Woman = Queen).
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
