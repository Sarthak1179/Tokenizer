import React from 'react';
import { Volume2, VolumeX, Sparkles, Box, Plus, Compass, HelpCircle, Activity } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenVocabBuilder: () => void;
  onOpenVectorMath: () => void;
  onOpenAbout: () => void;
  vocabCount: number;
  tokenCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  onOpenVocabBuilder,
  onOpenVectorMath,
  onOpenAbout,
  vocabCount,
  tokenCount
}) => {
  return (
    <header className="h-14 w-full bg-black border-b border-white/10 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 z-40 select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs shadow-md shadow-blue-500/20">
          V
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm tracking-tight text-white">
            VectorSpace
          </span>
          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
            / NLP Embedding Explorer
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400 ml-1">
            v2.0
          </span>
        </div>
      </div>

      {/* System Status Indicators */}
      <div className="hidden md:flex items-center gap-5 text-xs font-mono">
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>WebGL Engine: Active</span>
        </div>
        <div className="h-3 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1.5 text-neutral-400">
          <span>Tokens:</span>
          <span className="text-white font-medium">{tokenCount}</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-400">
          <span>3D Vocab:</span>
          <span className="text-blue-400 font-medium">{vocabCount} nodes</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Vector Math Modal Trigger */}
        <button
          onClick={() => {
            soundFx.playHover();
            onOpenVectorMath();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 transition-colors"
          title="Word Vector Math (King - Man + Woman = Queen)"
        >
          <Compass className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Vector Math</span>
        </button>

        {/* Add Word Modal Trigger */}
        <button
          onClick={() => {
            soundFx.playHover();
            onOpenVocabBuilder();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Word</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={onToggleMute}
          className={`p-1.5 rounded-lg text-xs transition-colors border ${
            isMuted
              ? 'text-neutral-500 border-white/5 bg-[#111111]'
              : 'text-neutral-300 border-white/10 bg-[#141414] hover:text-white'
          }`}
          title={isMuted ? 'Unmute Audio Feedback' : 'Mute Audio Feedback'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Help / Guide */}
        <button
          onClick={onOpenAbout}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-white border border-white/10 bg-[#111111] hover:bg-[#1a1a1a] transition-colors"
          title="Architecture Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
