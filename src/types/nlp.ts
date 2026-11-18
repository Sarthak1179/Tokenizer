export type TokenType = 'prefix' | 'suffix' | 'root' | 'punct' | 'word' | 'special';

export interface Token {
  id: string;
  index: number;
  text: string;
  cleanText: string;
  type: TokenType;
  start: number;
  end: number;
  tokenId: number; // Simulated vocab ID e.g. 10243
  vector16: number[]; // 16-dim dense vector
  coords3D: [number, number, number]; // 3D coordinates for R3F
}

export type TokenizerMode = 'bpe' | 'wordpiece' | 'word' | 'char';

export interface WordNode {
  id: string;
  word: string;
  category: string;
  coords: [number, number, number];
  color: string;
  denseVector: number[]; // 16-dim representation
  description?: string;
  isCustom?: boolean;
  addedAt?: number;
}

export interface SemanticCluster {
  id: string;
  name: string;
  color: string;
  center: [number, number, number];
  description: string;
}

export interface ShockwaveEffect {
  id: string;
  position: [number, number, number];
  color: string;
  maxRadius: number;
  duration: number; // in seconds
  createdAt: number;
}

export interface ShootingCometEffect {
  id: string;
  word: string;
  startPos: [number, number, number];
  targetPos: [number, number, number];
  color: string;
  startTime: number;
  duration: number; // in seconds
}

export interface VectorMathQuery {
  wordA: string;
  wordB: string;
  wordC: string;
}

export interface VectorMathResult {
  targetCoords: [number, number, number];
  targetVector: number[];
  nearestWord: WordNode;
  cosineSimilarity: number;
  topMatches: { word: WordNode; similarity: number }[];
}
