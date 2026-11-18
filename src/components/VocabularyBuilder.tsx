import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Zap, AlertCircle } from 'lucide-react';
import { WordNode } from '../types/nlp';
import { SEMANTIC_CLUSTERS } from '../data/defaultVocabulary';
import { hashString, generateToken16DVector } from '../utils/tokenizerEngine';
import { soundFx } from '../utils/audio';

interface VocabularyBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWord: (newWord: WordNode, startPos: [number, number, number]) => void;
  existingWords: WordNode[];
}

export const VocabularyBuilder: React.FC<VocabularyBuilderProps> = ({
  isOpen,
  onClose,
  onAddWord,
  existingWords
}) => {
  const [word, setWord] = useState('');
  const [category, setCategory] = useState<string>('technology');
  const [description, setDescription] = useState('');
  const [placementMode, setPlacementMode] = useState<'auto' | 'manual'>('auto');
  const [manualCoords, setManualCoords] = useState<[number, number, number]>([0, 0, 0]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const cluster = SEMANTIC_CLUSTERS[category] || SEMANTIC_CLUSTERS.technology;

  const calculatedCoords: [number, number, number] = placementMode === 'manual'
    ? manualCoords
    : (() => {
        if (!word.trim()) return cluster.center;
        const h = hashString(word);
        const ox = (((h % 100) / 100) - 0.5) * 1.8;
        const oy = ((((h >> 2) % 100) / 100) - 0.5) * 1.8;
        const oz = ((((h >> 4) % 100) / 100) - 0.5) * 1.8;
        return [
          Number((cluster.center[0] + ox).toFixed(2)),
          Number((cluster.center[1] + oy).toFixed(2)),
          Number((cluster.center[2] + oz).toFixed(2))
        ];
      })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWord = word.trim().toLowerCase();

    if (!cleanWord) {
      setError('Please enter a word.');
      return;
    }

    if (existingWords.some(w => w.word.toLowerCase() === cleanWord)) {
      setError(`Word "${cleanWord}" already exists in vocabulary.`);
      return;
    }

    setError(null);

    const denseVector = generateToken16DVector(cleanWord, existingWords);

    const newNode: WordNode = {
      id: `custom-${cleanWord}-${Date.now()}`,
      word: cleanWord,
      category,
      coords: calculatedCoords,
      color: cluster.color,
      description: description.trim() || `User concept belonging to ${cluster.name}.`,
      denseVector,
      isCustom: true,
      addedAt: Date.now()
    };

    const startPos: [number, number, number] = [
      calculatedCoords[0] + 16,
      calculatedCoords[1] + 14,
      calculatedCoords[2] + 20
    ];

    soundFx.playWhoosh();
    onAddWord(newNode, startPos);
    onClose();

    setWord('');
    setDescription('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-xl p-6 shadow-2xl z-10 font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-base font-semibold text-white">
                Vocabulary Builder
              </h3>
              <p className="text-xs text-neutral-400">
                Inject custom tokens with calibrated 3D coordinates.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Word or Token *
              </label>
              <input
                type="text"
                value={word}
                onChange={(e) => {
                  setWord(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. quantum, supernova, transformer..."
                autoFocus
                className="enterprise-input w-full rounded-lg px-3 py-2 text-sm font-mono"
              />
              {error && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1">
                Semantic Domain
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.values(SEMANTIC_CLUSTERS).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCategory(c.id);
                      soundFx.playTick();
                    }}
                    className={`flex items-center gap-1.5 p-2 rounded-lg border text-xs font-mono transition-colors text-left ${
                      category === c.id
                        ? 'border-blue-500 bg-blue-600/10 text-white'
                        : 'border-white/5 bg-[#111111] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="truncate">{c.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#111111] border border-white/5 font-mono text-xs flex items-center justify-between text-neutral-300">
              <span className="text-neutral-400">Target 3D Coordinates:</span>
              <span className="text-blue-400 font-bold">
                [{calculatedCoords.join(', ')}]
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Inject into 3D Space</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
