import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, X, ArrowRight, Minus, Plus } from 'lucide-react';
import { WordNode } from '../types/nlp';
import { computeVectorAnalogy } from '../utils/tokenizerEngine';
import { soundFx } from '../utils/audio';

interface VectorMathModalProps {
  isOpen: boolean;
  onClose: () => void;
  vocabulary: WordNode[];
  onHighlightResult: (word: string) => void;
}

const PRESET_ANALOGIES = [
  { a: 'king', b: 'man', c: 'woman', label: 'King - Man + Woman = Queen' },
  { a: 'prince', b: 'man', c: 'woman', label: 'Prince - Man + Woman = Princess' },
  { a: 'ai', b: 'algorithm', c: 'robot', label: 'AI - Algorithm + Robot = Neural' },
  { a: 'rocket', b: 'car', c: 'speed', label: 'Rocket - Car + Speed = Airplane' },
];

export const VectorMathModal: React.FC<VectorMathModalProps> = ({
  isOpen,
  onClose,
  vocabulary,
  onHighlightResult
}) => {
  const [wordA, setWordA] = useState<string>('king');
  const [wordB, setWordB] = useState<string>('man');
  const [wordC, setWordC] = useState<string>('woman');

  const result = useMemo(() => {
    return computeVectorAnalogy(wordA, wordB, wordC, vocabulary);
  }, [wordA, wordB, wordC, vocabulary]);

  if (!isOpen) return null;

  const handleApplyPreset = (a: string, b: string, c: string) => {
    soundFx.playTick();
    setWordA(a);
    setWordB(b);
    setWordC(c);
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
                Semantic Vector Arithmetic
              </h3>
              <p className="text-xs text-neutral-400">
                Word2Vec vector arithmetic: v(A) - v(B) + v(C) = v(D)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Presets */}
          <div className="py-3 flex flex-wrap gap-1.5">
            {PRESET_ANALOGIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleApplyPreset(preset.a, preset.b, preset.c)}
                className="text-xs px-2.5 py-1 rounded-md bg-[#111111] hover:bg-[#1a1a1a] text-neutral-300 hover:text-white border border-white/5 transition-colors font-mono"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Calculator Inputs */}
          <div className="p-3.5 rounded-lg bg-[#111111] border border-white/5 flex items-center justify-between gap-2 font-mono text-xs">
            <select
              value={wordA}
              onChange={(e) => setWordA(e.target.value)}
              className="enterprise-input flex-1 rounded px-2 py-1.5 text-center text-white font-bold"
            >
              {vocabulary.map(w => (
                <option key={w.id} value={w.word} className="bg-black text-white">
                  {w.word}
                </option>
              ))}
            </select>

            <span className="text-neutral-400 font-bold">-</span>

            <select
              value={wordB}
              onChange={(e) => setWordB(e.target.value)}
              className="enterprise-input flex-1 rounded px-2 py-1.5 text-center text-white font-bold"
            >
              {vocabulary.map(w => (
                <option key={w.id} value={w.word} className="bg-black text-white">
                  {w.word}
                </option>
              ))}
            </select>

            <span className="text-neutral-400 font-bold">+</span>

            <select
              value={wordC}
              onChange={(e) => setWordC(e.target.value)}
              className="enterprise-input flex-1 rounded px-2 py-1.5 text-center text-white font-bold"
            >
              {vocabulary.map(w => (
                <option key={w.id} value={w.word} className="bg-black text-white">
                  {w.word}
                </option>
              ))}
            </select>
          </div>

          {/* Result Card */}
          {result && (
            <div className="mt-4 p-4 rounded-lg bg-[#111111] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-neutral-400">
                  Predicted Vector:
                </span>
                <div className="text-xl font-bold font-mono text-blue-400 mt-0.5">
                  &quot;{result.nearestWord.word}&quot;
                </div>
                <span className="text-xs text-neutral-400 font-mono">
                  {(result.cosineSimilarity * 100).toFixed(1)}% Cosine Match
                </span>
              </div>

              <button
                onClick={() => {
                  soundFx.playWhoosh();
                  onHighlightResult(result.nearestWord.word);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-medium transition-colors"
              >
                <span>Locate 3D</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
