import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Binary, ArrowRightLeft, Compass, RotateCcw } from 'lucide-react';
import { Token, WordNode } from '../types/nlp';
import { computeCosineSimilarity } from '../utils/tokenizerEngine';
import { soundFx } from '../utils/audio';

interface EmbeddingVisualizerProps {
  selectedToken: Token | null;
  allTokens: Token[];
  vocabulary: WordNode[];
  onSelectToken: (token: Token) => void;
  onFocus3DWord: (word: string) => void;
}

// Enterprise Digital Slot Decimal Component
const MatrixSlotDecimal: React.FC<{
  targetValue: number;
  index: number;
  isCycling: boolean;
}> = ({ targetValue, index, isCycling }) => {
  const [displayValue, setDisplayValue] = useState<string>(targetValue.toFixed(3));
  const [isLocked, setIsLocked] = useState<boolean>(!isCycling);

  useEffect(() => {
    if (!isCycling) {
      setDisplayValue(targetValue.toFixed(3));
      setIsLocked(true);
      return;
    }

    setIsLocked(false);
    let iterations = 0;
    const maxIterations = 8 + (index % 4) * 2; // Staggered lock

    const interval = setInterval(() => {
      iterations++;
      if (iterations < maxIterations) {
        const sign = Math.random() > 0.5 ? '+' : '-';
        const num = (Math.random()).toFixed(3).slice(1);
        setDisplayValue(`${sign}${num}`);
      } else {
        setDisplayValue(targetValue >= 0 ? `+${targetValue.toFixed(3)}` : targetValue.toFixed(3));
        setIsLocked(true);
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [targetValue, isCycling, index]);

  const numVal = parseFloat(displayValue);
  const isPositive = numVal >= 0;

  return (
    <div
      className={`p-2 rounded-lg border font-mono flex flex-col items-center justify-center transition-all ${
        isLocked
          ? isPositive
            ? 'border-blue-500/30 bg-[#0d1424] text-blue-300'
            : 'border-rose-500/30 bg-[#1c0d12] text-rose-300'
          : 'border-blue-400 bg-blue-950/40 text-blue-200 animate-pulse'
      }`}
    >
      <span className="text-[9px] text-neutral-400 mb-0.5">
        d_{index}
      </span>
      <span className="text-xs font-bold tracking-tight">
        {displayValue}
      </span>
      <div className="w-full h-1 mt-1 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full ${isPositive ? 'bg-blue-400' : 'bg-rose-500'}`}
          style={{ width: `${Math.min(100, Math.abs(numVal) * 100)}%` }}
        />
      </div>
    </div>
  );
};

export const EmbeddingVisualizer: React.FC<EmbeddingVisualizerProps> = ({
  selectedToken,
  allTokens,
  vocabulary,
  onSelectToken,
  onFocus3DWord
}) => {
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [compareTokenId, setCompareTokenId] = useState<string>('');
  const [subTab, setSubTab] = useState<'dense' | 'spatial' | 'similarity'>('dense');

  useEffect(() => {
    if (selectedToken) {
      setIsRolling(true);
      soundFx.playTick();
      const timer = setTimeout(() => setIsRolling(false), 600);
      return () => clearTimeout(timer);
    }
  }, [selectedToken?.id]);

  if (!selectedToken) {
    return (
      <div className="enterprise-panel rounded-xl p-5 text-center text-neutral-400 font-mono text-xs">
        Select a token above to inspect its numerical vector embedding.
      </div>
    );
  }

  const compareTarget = allTokens.find(t => t.id === compareTokenId) || 
                        (allTokens.length > 1 ? allTokens.find(t => t.id !== selectedToken.id) : null);

  const similarityScore = compareTarget 
    ? computeCosineSimilarity(selectedToken.vector16, compareTarget.vector16)
    : 0;

  const vectorNorm = Math.sqrt(
    selectedToken.vector16.reduce((sum, val) => sum + val * val, 0)
  ).toFixed(3);

  return (
    <div className="enterprise-panel rounded-xl p-5 flex flex-col gap-4">
      {/* Header and Sub-Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono text-[11px] font-bold">
            02
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-white uppercase font-mono">
            Embedding Array Visualizer
          </h2>
        </div>

        <div className="flex items-center p-0.5 rounded-lg bg-[#111111] border border-white/5 text-xs font-mono">
          <button
            onClick={() => setSubTab('dense')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              subTab === 'dense' ? 'bg-blue-600 text-white font-medium' : 'text-neutral-400 hover:text-white'
            }`}
          >
            16-D Array
          </button>
          <button
            onClick={() => setSubTab('spatial')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              subTab === 'spatial' ? 'bg-blue-600 text-white font-medium' : 'text-neutral-400 hover:text-white'
            }`}
          >
            3D Proj
          </button>
          <button
            onClick={() => setSubTab('similarity')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              subTab === 'similarity' ? 'bg-blue-600 text-white font-medium' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Similarity
          </button>
        </div>
      </div>

      {/* Selected Token Metadata Strip */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-[#000000] border border-white/5 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Token:</span>
          <span className="text-blue-400 font-bold">&quot;{selectedToken.text}&quot;</span>
          <span className="text-neutral-400">#{selectedToken.tokenId}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-neutral-400">||v||: <span className="text-emerald-400">{vectorNorm}</span></span>
          <button
            onClick={() => {
              soundFx.playWhoosh();
              onFocus3DWord(selectedToken.cleanText);
            }}
            className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition-colors"
          >
            Locate 3D
          </button>
        </div>
      </div>

      {/* View Mode: 16-D Dense Array */}
      {subTab === 'dense' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>Matrix slot-machine decimal cascade:</span>
            <button
              onClick={() => {
                setIsRolling(true);
                soundFx.playTick();
                setTimeout(() => setIsRolling(false), 600);
              }}
              className="text-blue-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Re-roll
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {selectedToken.vector16.map((val, idx) => (
              <MatrixSlotDecimal
                key={`${selectedToken.id}-dim-${idx}`}
                targetValue={val}
                index={idx}
                isCycling={isRolling}
              />
            ))}
          </div>
        </div>
      )}

      {/* View Mode: 3D Spatial Projection */}
      {subTab === 'spatial' && (
        <div className="grid grid-cols-3 gap-2 font-mono">
          <div className="p-3 rounded-lg bg-[#000000] border border-rose-500/30 flex flex-col">
            <span className="text-[10px] text-rose-400 uppercase">X Coordinate</span>
            <span className="text-lg font-bold text-white mt-1">
              {selectedToken.coords3D[0] >= 0 ? `+${selectedToken.coords3D[0].toFixed(2)}` : selectedToken.coords3D[0].toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#000000] border border-emerald-500/30 flex flex-col">
            <span className="text-[10px] text-emerald-400 uppercase">Y Coordinate</span>
            <span className="text-lg font-bold text-white mt-1">
              {selectedToken.coords3D[1] >= 0 ? `+${selectedToken.coords3D[1].toFixed(2)}` : selectedToken.coords3D[1].toFixed(2)}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-[#000000] border border-blue-500/30 flex flex-col">
            <span className="text-[10px] text-blue-400 uppercase">Z Coordinate</span>
            <span className="text-lg font-bold text-white mt-1">
              {selectedToken.coords3D[2] >= 0 ? `+${selectedToken.coords3D[2].toFixed(2)}` : selectedToken.coords3D[2].toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* View Mode: Cosine Similarity Matcher */}
      {subTab === 'similarity' && (
        <div className="flex flex-col gap-3 font-mono text-xs">
          {compareTarget ? (
            <div className="p-3 rounded-lg bg-[#000000] border border-white/5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>&quot;{selectedToken.text}&quot; vs &quot;{compareTarget.text}&quot;</span>
                <span className="text-blue-400 font-bold">
                  {(similarityScore * 100).toFixed(1)}% Match
                </span>
              </div>
              <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, (similarityScore + 1) * 50))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>-1.0 (Opposite)</span>
                <span>0.0 (Orthogonal)</span>
                <span>+1.0 (Aligned)</span>
              </div>
            </div>
          ) : (
            <div className="text-neutral-400">Tokenize multiple words to compute cosine alignment.</div>
          )}
        </div>
      )}
    </div>
  );
};
