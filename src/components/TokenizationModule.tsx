import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ArrowRight, Hash, Tag, Info, Layers } from 'lucide-react';
import { Token, TokenizerMode, TokenType } from '../types/nlp';
import { soundFx } from '../utils/audio';

interface TokenizationModuleProps {
  inputText: string;
  setInputText: (text: string) => void;
  tokens: Token[];
  onTokenize: (text: string, mode: TokenizerMode) => void;
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
  mode: TokenizerMode;
  setMode: (mode: TokenizerMode) => void;
}

const PRESET_SENTENCES = [
  "Unbelievable transformations in artificial intelligence.",
  "King minus man plus woman equals queen in vector space.",
  "Self-attention mechanisms weigh token representations effortlessly.",
  "The supersonic rocket accelerated into deep cosmos."
];

export const TokenizationModule: React.FC<TokenizationModuleProps> = ({
  inputText,
  setInputText,
  tokens,
  onTokenize,
  selectedToken,
  onSelectToken,
  mode,
  setMode,
}) => {
  const [isTokenizing, setIsTokenizing] = useState(false);

  const handleTokenizeClick = () => {
    setIsTokenizing(true);
    soundFx.playTokenize();
    onTokenize(inputText, mode);
    setTimeout(() => {
      setIsTokenizing(false);
    }, 350);
  };

  const handlePresetSelect = (preset: string) => {
    soundFx.playTick();
    setInputText(preset);
    onTokenize(preset, mode);
  };

  // Border styling for enterprise UI
  const getTypeBadgeStyles = (type: TokenType, isSelected: boolean) => {
    if (isSelected) {
      return 'border-blue-500 bg-blue-500/10 text-white ring-1 ring-blue-500/50';
    }

    switch (type) {
      case 'prefix':
        return 'border-indigo-500/30 bg-indigo-500/5 text-indigo-300 hover:border-indigo-400';
      case 'root':
        return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300 hover:border-emerald-400';
      case 'suffix':
        return 'border-amber-500/30 bg-amber-500/5 text-amber-300 hover:border-amber-400';
      case 'punct':
        return 'border-white/10 bg-white/5 text-neutral-400 hover:border-white/20';
      case 'word':
      default:
        return 'border-white/15 bg-white/5 text-neutral-200 hover:border-white/30';
    }
  };

  const getTypeLabel = (type: TokenType) => {
    switch (type) {
      case 'prefix':
        return 'PRE';
      case 'root':
        return 'ROOT';
      case 'suffix':
        return 'SUF';
      case 'punct':
        return 'PUNCT';
      case 'word':
      default:
        return 'WORD';
    }
  };

  return (
    <div className="enterprise-panel rounded-xl p-5 flex flex-col gap-4">
      {/* Header and Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center font-mono text-[11px] font-bold">
            01
          </div>
          <h2 className="text-sm font-semibold tracking-tight text-white uppercase font-mono">
            Tokenization Engine
          </h2>
        </div>

        {/* Algorithm Segmented Controls */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#111111] border border-white/5 text-xs font-mono">
          <button
            onClick={() => {
              setMode('bpe');
              soundFx.playTick();
              onTokenize(inputText, 'bpe');
            }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mode === 'bpe'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            BPE
          </button>
          <button
            onClick={() => {
              setMode('wordpiece');
              soundFx.playTick();
              onTokenize(inputText, 'wordpiece');
            }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mode === 'wordpiece'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            WordPiece
          </button>
          <button
            onClick={() => {
              setMode('word');
              soundFx.playTick();
              onTokenize(inputText, 'word');
            }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mode === 'word'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Word
          </button>
          <button
            onClick={() => {
              setMode('char');
              soundFx.playTick();
              onTokenize(inputText, 'char');
            }}
            className={`px-2.5 py-1 rounded-md transition-all ${
              mode === 'char'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Byte
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex flex-col gap-2.5">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleTokenizeClick();
            }
          }}
          rows={3}
          placeholder="Enter sentence for token segmentation..."
          className="enterprise-input rounded-lg p-3 text-sm text-neutral-100 placeholder-neutral-500 font-sans resize-none"
        />

        {/* Presets and Submit */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 max-w-[70%]">
            <span className="text-[11px] text-neutral-400 font-mono mr-1">Presets:</span>
            {PRESET_SENTENCES.slice(0, 2).map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handlePresetSelect(preset)}
                className="text-[11px] px-2 py-0.5 rounded bg-[#141414] hover:bg-[#1a1a1a] text-neutral-400 hover:text-neutral-200 border border-white/5 transition-colors truncate max-w-[170px]"
                title={preset}
              >
                {preset}
              </button>
            ))}
          </div>

          <button
            onClick={handleTokenizeClick}
            disabled={isTokenizing || !inputText.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm disabled:opacity-50 ml-auto"
          >
            <Cpu className={`w-3.5 h-3.5 ${isTokenizing ? 'animate-spin' : ''}`} />
            <span>{isTokenizing ? 'Segmenting...' : 'Tokenize'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Token Legend */}
      <div className="flex items-center gap-3 pt-2 pb-1 border-t border-white/5 text-[10px] font-mono text-neutral-400">
        <span className="text-neutral-400">Tags:</span>
        <span className="flex items-center gap-1 text-indigo-400">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Prefix
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Root / Stem
        </span>
        <span className="flex items-center gap-1 text-amber-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Suffix
        </span>
        <span className="flex items-center gap-1 text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" /> Word
        </span>
      </div>

      {/* Deconstructed Token Stream */}
      <div className="p-3.5 rounded-lg bg-[#000000] border border-white/5 min-h-[90px] flex flex-wrap items-center gap-2">
        <AnimatePresence mode="popLayout">
          {tokens.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full text-center py-4 text-neutral-400 text-xs font-mono"
            >
              Enter a sentence and click &quot;Tokenize&quot; to inspect subword boundaries.
            </motion.div>
          ) : (
            tokens.map((token, index) => {
              const isSelected = selectedToken?.id === token.id;
              const badgeStyle = getTypeBadgeStyles(token.type, isSelected);

              return (
                <motion.button
                  key={token.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -5 }}
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 26,
                    delay: index * 0.03, // Staggered spring
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    soundFx.playHover();
                    onSelectToken(token);
                  }}
                  className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-mono ${badgeStyle}`}
                >
                  <span className="text-xs font-bold tracking-tight">
                    {token.text}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5 text-[9px] opacity-75">
                    <span className="px-1 rounded bg-black/40 uppercase">
                      {getTypeLabel(token.type)}
                    </span>
                    <span>#{token.tokenId}</span>
                  </div>
                </motion.button>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
