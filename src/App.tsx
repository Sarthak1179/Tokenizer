import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Token, TokenizerMode, WordNode, ShockwaveEffect, ShootingCometEffect } from './types/nlp';
import { INITIAL_VOCABULARY, SEMANTIC_CLUSTERS } from './data/defaultVocabulary';
import { tokenizeText } from './utils/tokenizerEngine';
import { soundFx } from './utils/audio';

import { Header } from './components/Header';
import { TokenizationModule } from './components/TokenizationModule';
import { EmbeddingVisualizer } from './components/EmbeddingVisualizer';
import { Scene } from './components/ThreeCanvas/Scene';
import { NodeTooltip } from './components/NodeTooltip';
import { VocabularyBuilder } from './components/VocabularyBuilder';
import { VectorMathModal } from './components/VectorMathModal';
import { AboutModal } from './components/AboutModal';

import { Rotate3d, Sparkles, Filter, Eye } from 'lucide-react';

export const App: React.FC = () => {
  // NLP Tokenizer State
  const [inputText, setInputText] = useState<string>(
    "Unbelievable transformations in artificial intelligence."
  );
  const [tokenizerMode, setTokenizerMode] = useState<TokenizerMode>('bpe');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // 3D Vector Space State
  const [vocabulary, setVocabulary] = useState<WordNode[]>(INITIAL_VOCABULARY);
  const [hovered3DNode, setHovered3DNode] = useState<WordNode | null>(null);
  const [selected3DNode, setSelected3DNode] = useState<WordNode | null>(null);
  const [highlighted3DWord, setHighlighted3DWord] = useState<string | null>(null);
  const [autoRotate3D, setAutoRotate3D] = useState<boolean>(true);
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('all');

  // Visual Effects State
  const [shockwaves, setShockwaves] = useState<ShockwaveEffect[]>([]);
  const [comets, setComets] = useState<ShootingCometEffect[]>([]);

  // Modals & Panels State
  const [isVocabBuilderOpen, setIsVocabBuilderOpen] = useState<boolean>(false);
  const [isVectorMathOpen, setIsVectorMathOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Initial Tokenization Run on mount
  useEffect(() => {
    const initialTokens = tokenizeText(inputText, tokenizerMode, vocabulary);
    setTokens(initialTokens);
    if (initialTokens.length > 0) {
      setSelectedToken(initialTokens[0]);
    }
  }, []);

  // Handle Tokenize Action
  const handleTokenize = useCallback((text: string, mode: TokenizerMode) => {
    const newTokens = tokenizeText(text, mode, vocabulary);
    setTokens(newTokens);
    if (newTokens.length > 0) {
      const candidate = newTokens.find(t => t.type !== 'punct') || newTokens[0];
      setSelectedToken(candidate);
    } else {
      setSelectedToken(null);
    }
  }, [vocabulary]);

  // Handle Adding a New Word (Comet shoot animation -> shockwave)
  const handleAddWord = useCallback((newNode: WordNode, startPos: [number, number, number]) => {
    const cometId = `comet-${Date.now()}`;
    const newComet: ShootingCometEffect = {
      id: cometId,
      word: newNode.word,
      startPos,
      targetPos: newNode.coords,
      color: newNode.color,
      startTime: Date.now(),
      duration: 0.95
    };

    setComets(prev => [...prev, newComet]);
    setHighlighted3DWord(newNode.word);
    setSelected3DNode(newNode);
  }, []);

  // When Comet lands at target coordinates
  const handleCometLand = useCallback((landedComet: ShootingCometEffect) => {
    setComets(prev => prev.filter(c => c.id !== landedComet.id));

    // Spawn Shockwave Ring
    const newShockwave: ShockwaveEffect = {
      id: `shockwave-${Date.now()}`,
      position: landedComet.targetPos,
      color: landedComet.color,
      maxRadius: 3.0,
      duration: 1.2,
      createdAt: Date.now()
    };
    setShockwaves(prev => [...prev, newShockwave]);

    // Add word into vocabulary
    setVocabulary(prev => {
      if (prev.some(w => w.word.toLowerCase() === landedComet.word.toLowerCase())) {
        return prev;
      }
      const cluster = Object.values(SEMANTIC_CLUSTERS).find(c => c.color === landedComet.color) || SEMANTIC_CLUSTERS.technology;
      const newNode: WordNode = {
        id: `custom-${landedComet.word}-${Date.now()}`,
        word: landedComet.word,
        category: cluster.id,
        coords: landedComet.targetPos,
        color: landedComet.color,
        description: `Custom entity injected into ${cluster.name}.`,
        denseVector: [
          landedComet.targetPos[0] / 5,
          landedComet.targetPos[1] / 5,
          landedComet.targetPos[2] / 5,
          ...Array(13).fill(0).map(() => Number((Math.random() * 0.4 - 0.2).toFixed(3)))
        ],
        isCustom: true,
        addedAt: Date.now()
      };
      return [...prev, newNode];
    });

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#60a5fa', '#ffffff']
      });
    } catch {
      // Ignored
    }
  }, []);

  const handleShockwaveComplete = useCallback((id: string) => {
    setShockwaves(prev => prev.filter(s => s.id !== id));
  }, []);

  const handleFocus3DWord = useCallback((wordText: string) => {
    setHighlighted3DWord(wordText);
    const match = vocabulary.find(w => w.word.toLowerCase() === wordText.toLowerCase());
    if (match) {
      setSelected3DNode(match);
    }
  }, [vocabulary]);

  // Filtered vocabulary based on top cluster pill
  const filteredVocabulary = selectedClusterFilter === 'all'
    ? vocabulary
    : vocabulary.filter(w => w.category === selectedClusterFilter);

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* Top Enterprise Header */}
      <Header
        isMuted={isMuted}
        onToggleMute={() => {
          const muted = soundFx.toggleMute();
          setIsMuted(muted);
        }}
        onOpenVocabBuilder={() => setIsVocabBuilderOpen(true)}
        onOpenVectorMath={() => setIsVectorMathOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        vocabCount={vocabulary.length}
        tokenCount={tokens.length}
      />

      {/* Main Strict Layout System */}
      <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Fixed Left Sidebar: Tokenizer & Embedding Visualizer Workbench */}
        <aside className="w-full lg:w-[480px] xl:w-[520px] h-full flex flex-col overflow-y-auto border-r border-white/10 bg-[#0A0A0A] p-5 gap-5 flex-shrink-0 z-20">
          <TokenizationModule
            inputText={inputText}
            setInputText={setInputText}
            tokens={tokens}
            onTokenize={handleTokenize}
            selectedToken={selectedToken}
            onSelectToken={(token) => {
              setSelectedToken(token);
              handleFocus3DWord(token.cleanText);
            }}
            mode={tokenizerMode}
            setMode={setTokenizerMode}
          />

          <EmbeddingVisualizer
            selectedToken={selectedToken}
            allTokens={tokens}
            vocabulary={vocabulary}
            onSelectToken={setSelectedToken}
            onFocus3DWord={handleFocus3DWord}
          />
        </aside>

        {/* Massive 3D Three.js WebGL Viewport */}
        <main className="flex-1 h-full min-h-[600px] relative bg-black flex flex-col overflow-hidden z-10">
          {/* Top 3D Floating HUD Toolbar */}
          <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
            {/* Semantic Cluster Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl backdrop-blur-md bg-black/70 border border-white/10 pointer-events-auto overflow-x-auto text-xs font-mono">
              <button
                onClick={() => setSelectedClusterFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedClusterFilter === 'all'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                All Domains ({vocabulary.length})
              </button>
              {Object.values(SEMANTIC_CLUSTERS).map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    soundFx.playTick();
                    setSelectedClusterFilter(c.id);
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                    selectedClusterFilter === c.id
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span>{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Orbit / Auto-Rotate Toggle */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => {
                  soundFx.playTick();
                  setAutoRotate3D(prev => !prev);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-colors backdrop-blur-md ${
                  autoRotate3D
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                    : 'bg-black/60 border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                <Rotate3d className="w-3.5 h-3.5" />
                <span>{autoRotate3D ? 'Auto-Rotate ON' : 'Paused'}</span>
              </button>
            </div>
          </div>

          {/* Guaranteed Visible 3D Three.js WebGL Container */}
          <div
            className="w-full h-full relative"
            style={{ width: '100%', height: '100%', minHeight: '600px' }}
          >
            <Scene
              vocabulary={filteredVocabulary}
              selectedNode={selected3DNode}
              hoveredNode={hovered3DNode}
              highlightedWord={highlighted3DWord}
              onHoverNode={(node) => setHovered3DNode(node)}
              onClickNode={(node) => {
                setSelected3DNode(node);
                setHighlighted3DWord(node.word);
              }}
              shockwaves={shockwaves}
              comets={comets}
              onCometLand={handleCometLand}
              onShockwaveComplete={handleShockwaveComplete}
              autoRotate={autoRotate3D}
            />
          </div>

          {/* Floating Glassmorphic Tooltip Card (Bottom-Right) */}
          <div className="absolute bottom-5 right-5 z-30 pointer-events-none">
            <NodeTooltip
              node={hovered3DNode || selected3DNode}
              vocabulary={vocabulary}
              onClose={() => {
                setSelected3DNode(null);
                setHovered3DNode(null);
                setHighlighted3DWord(null);
              }}
              onSelectNeighbor={(neighbor) => {
                setSelected3DNode(neighbor);
                setHighlighted3DWord(neighbor.word);
              }}
            />
          </div>

          {/* Orbit Controls Guide Hint (Bottom-Left) */}
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center gap-4 text-[11px] font-mono text-neutral-400 backdrop-blur-md bg-black/60 px-3 py-1.5 rounded-lg border border-white/5">
            <span>Left-drag: Orbit</span>
            <span>•</span>
            <span>Right-drag: Pan</span>
            <span>•</span>
            <span>Scroll: Zoom</span>
          </div>
        </main>
      </div>

      {/* Modals */}
      <VocabularyBuilder
        isOpen={isVocabBuilderOpen}
        onClose={() => setIsVocabBuilderOpen(false)}
        onAddWord={handleAddWord}
        existingWords={vocabulary}
      />

      <VectorMathModal
        isOpen={isVectorMathOpen}
        onClose={() => setIsVectorMathOpen(false)}
        vocabulary={vocabulary}
        onHighlightResult={(word) => {
          handleFocus3DWord(word);
        }}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
};
