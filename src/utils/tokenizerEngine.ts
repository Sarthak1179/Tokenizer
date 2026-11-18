import { Token, TokenType, TokenizerMode, WordNode } from '../types/nlp';
import { INITIAL_VOCABULARY, SEMANTIC_CLUSTERS } from '../data/defaultVocabulary';

// Common subword affixes for BPE / WordPiece simulation
const KNOWN_PREFIXES = ['un', 're', 'dis', 'pre', 'sub', 'auto', 'anti', 'in', 'im', 'over', 'under', 'super', 'hyper', 'trans', 'inter', 'multi'];
const KNOWN_SUFFIXES = ['ing', 'tion', 'able', 'ible', 'ness', 'ment', 'ly', 'ized', 'izes', 'ed', 'er', 'est', 'ity', 'al', 'ous', 'ful', 'less', 'ive', 'ism', 'ist'];

// Deterministic hash to integer
export function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
}

// Generate a 16-D normalized vector from text
export function generateToken16DVector(text: string, vocab?: WordNode[]): number[] {
  // If the word exists in vocabulary, use its dense vector or align closely
  const normalized = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = vocab?.find(w => w.word.toLowerCase() === normalized);
  if (match && match.denseVector.length === 16) {
    return [...match.denseVector];
  }

  const hash = hashString(text);
  const vec: number[] = [];

  for (let d = 0; d < 16; d++) {
    const angle = (hash * (d + 1) * 0.173) % (Math.PI * 2);
    const charMod = text.charCodeAt(d % text.length) || 65;
    const val = Math.sin(angle) * 0.7 + Math.cos(charMod * 0.3) * 0.3;
    vec.push(Number(val.toFixed(3)));
  }

  const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map(v => Number((v / norm).toFixed(3)));
}

// Project a token into 3D space
export function projectTokenTo3D(text: string, vocab?: WordNode[]): [number, number, number] {
  const clean = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = vocab?.find(w => w.word.toLowerCase() === clean);
  if (match) {
    return [match.coords[0], match.coords[1], match.coords[2]];
  }

  // Fallback: project via deterministic hash into bound sphere [-5, 5]
  const h1 = hashString(text + '_x');
  const h2 = hashString(text + '_y');
  const h3 = hashString(text + '_z');

  const x = Number((((h1 % 1000) / 1000) * 8 - 4).toFixed(2));
  const y = Number((((h2 % 1000) / 1000) * 8 - 4).toFixed(2));
  const z = Number((((h3 % 1000) / 1000) * 8 - 4).toFixed(2));

  return [x, y, z];
}

// Calculate Cosine Similarity between two vectors
export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length === 0 || vecB.length === 0) return 0;
  const len = Math.min(vecA.length, vecB.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Calculate Euclidean Distance in 3D
export function computeEuclideanDistance3D(p1: [number, number, number], p2: [number, number, number]): number {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  const dz = p1[2] - p2[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Find top N nearest words in vocabulary to a coordinate or vector
export function findNearestNeighbors(
  targetVector: number[],
  vocabulary: WordNode[],
  topK: number = 4
): { word: WordNode; similarity: number; distance3D: number }[] {
  const results = vocabulary.map(w => {
    const similarity = computeCosineSimilarity(targetVector, w.denseVector);
    const distance3D = targetVector.length >= 3 
      ? computeEuclideanDistance3D(
          [targetVector[0], targetVector[1], targetVector[2]],
          w.coords
        )
      : 0;
    return { word: w, similarity, distance3D };
  });

  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, topK);
}

// Perform Word Vector Analogy: A - B + C
export function computeVectorAnalogy(
  wordA: string,
  wordB: string,
  wordC: string,
  vocabulary: WordNode[]
) {
  const nodeA = vocabulary.find(w => w.word.toLowerCase() === wordA.toLowerCase());
  const nodeB = vocabulary.find(w => w.word.toLowerCase() === wordB.toLowerCase());
  const nodeC = vocabulary.find(w => w.word.toLowerCase() === wordC.toLowerCase());

  if (!nodeA || !nodeB || !nodeC) return null;

  // 3D vector arithmetic: A - B + C
  const target3D: [number, number, number] = [
    Number((nodeA.coords[0] - nodeB.coords[0] + nodeC.coords[0]).toFixed(3)),
    Number((nodeA.coords[1] - nodeB.coords[1] + nodeC.coords[1]).toFixed(3)),
    Number((nodeA.coords[2] - nodeB.coords[2] + nodeC.coords[2]).toFixed(3))
  ];

  // 16D vector arithmetic
  const target16D: number[] = [];
  for (let i = 0; i < 16; i++) {
    const val = nodeA.denseVector[i] - nodeB.denseVector[i] + nodeC.denseVector[i];
    target16D.push(val);
  }
  const norm16 = Math.sqrt(target16D.reduce((s, v) => s + v * v, 0)) || 1;
  const normalized16D = target16D.map(v => Number((v / norm16).toFixed(3)));

  // Exclude input words from match candidates
  const candidateVocab = vocabulary.filter(
    w => w.word.toLowerCase() !== wordA.toLowerCase() &&
         w.word.toLowerCase() !== wordB.toLowerCase() &&
         w.word.toLowerCase() !== wordC.toLowerCase()
  );

  const nearest = findNearestNeighbors(normalized16D, candidateVocab, 4);

  return {
    targetCoords: target3D,
    targetVector: normalized16D,
    nearestWord: nearest[0]?.word || vocabulary[0],
    cosineSimilarity: nearest[0]?.similarity || 0,
    topMatches: nearest
  };
}

// Main Tokenization Parser
export function tokenizeText(
  inputText: string,
  mode: TokenizerMode,
  vocab: WordNode[] = INITIAL_VOCABULARY
): Token[] {
  if (!inputText.trim()) return [];

  const tokens: Token[] = [];
  let tokenIndex = 0;

  if (mode === 'char') {
    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i];
      if (char === ' ') continue; // Show visual chars
      const isPunct = /[.,/#!$%^&*;:{}=\-_`~()?"']/.test(char);
      const vec16 = generateToken16DVector(char, vocab);
      const coords3D = projectTokenTo3D(char, vocab);

      tokens.push({
        id: `token-char-${i}-${char}`,
        index: tokenIndex++,
        text: char,
        cleanText: char,
        type: isPunct ? 'punct' : 'word',
        start: i,
        end: i + 1,
        tokenId: 100 + char.charCodeAt(0),
        vector16: vec16,
        coords3D
      });
    }
    return tokens;
  }

  // Regex splitting by whitespace and punctuation boundaries
  const regex = /([a-zA-Z0-9]+|[^\s\w]|\s+)/g;
  let match;

  while ((match = regex.exec(inputText)) !== null) {
    const segment = match[0];
    const startIndex = match.index;
    const endIndex = startIndex + segment.length;

    // Skip purely whitespace
    if (/^\s+$/.test(segment)) {
      continue;
    }

    // Punctuation
    if (/^[^\s\w]+$/.test(segment)) {
      const vec16 = generateToken16DVector(segment, vocab);
      const coords3D = projectTokenTo3D(segment, vocab);
      tokens.push({
        id: `token-${tokenIndex}-${segment}`,
        index: tokenIndex++,
        text: segment,
        cleanText: segment,
        type: 'punct',
        start: startIndex,
        end: endIndex,
        tokenId: 20000 + (hashString(segment) % 5000),
        vector16: vec16,
        coords3D
      });
      continue;
    }

    // Word Mode: simply keep whole word
    if (mode === 'word') {
      const vec16 = generateToken16DVector(segment, vocab);
      const coords3D = projectTokenTo3D(segment, vocab);
      tokens.push({
        id: `token-${tokenIndex}-${segment}`,
        index: tokenIndex++,
        text: segment,
        cleanText: segment.toLowerCase(),
        type: 'word',
        start: startIndex,
        end: endIndex,
        tokenId: 1000 + (hashString(segment) % 25000),
        vector16: vec16,
        coords3D
      });
      continue;
    }

    // BPE / WordPiece Subword Deconstruction
    const lowerWord = segment.toLowerCase();

    // Check if word has known prefix
    let remaining = lowerWord;
    let foundPrefix = '';
    let foundSuffix = '';

    for (const prefix of KNOWN_PREFIXES) {
      if (remaining.length > prefix.length + 3 && remaining.startsWith(prefix)) {
        foundPrefix = prefix;
        remaining = remaining.slice(prefix.length);
        break;
      }
    }

    for (const suffix of KNOWN_SUFFIXES) {
      if (remaining.length > suffix.length + 2 && remaining.endsWith(suffix)) {
        foundSuffix = suffix;
        remaining = remaining.slice(0, -suffix.length);
        break;
      }
    }

    if (foundPrefix || foundSuffix) {
      // Deconstruct into prefix, root, suffix tokens
      let currentOffset = startIndex;

      if (foundPrefix) {
        const prefixDisplay = mode === 'bpe' ? `${foundPrefix}@@` : foundPrefix;
        const vec = generateToken16DVector(foundPrefix, vocab);
        tokens.push({
          id: `token-${tokenIndex}-${foundPrefix}`,
          index: tokenIndex++,
          text: prefixDisplay,
          cleanText: foundPrefix,
          type: 'prefix',
          start: currentOffset,
          end: currentOffset + foundPrefix.length,
          tokenId: 5000 + (hashString(foundPrefix) % 3000),
          vector16: vec,
          coords3D: projectTokenTo3D(foundPrefix, vocab)
        });
        currentOffset += foundPrefix.length;
      }

      if (remaining) {
        const rootDisplay = (foundPrefix && mode === 'wordpiece') ? `##${remaining}` : remaining;
        const vec = generateToken16DVector(remaining, vocab);
        tokens.push({
          id: `token-${tokenIndex}-${remaining}`,
          index: tokenIndex++,
          text: rootDisplay,
          cleanText: remaining,
          type: 'root',
          start: currentOffset,
          end: currentOffset + remaining.length,
          tokenId: 10000 + (hashString(remaining) % 15000),
          vector16: vec,
          coords3D: projectTokenTo3D(remaining, vocab)
        });
        currentOffset += remaining.length;
      }

      if (foundSuffix) {
        const suffixDisplay = mode === 'wordpiece' ? `##${foundSuffix}` : `-${foundSuffix}`;
        const vec = generateToken16DVector(foundSuffix, vocab);
        tokens.push({
          id: `token-${tokenIndex}-${foundSuffix}`,
          index: tokenIndex++,
          text: suffixDisplay,
          cleanText: foundSuffix,
          type: 'suffix',
          start: currentOffset,
          end: endIndex,
          tokenId: 8000 + (hashString(foundSuffix) % 3000),
          vector16: vec,
          coords3D: projectTokenTo3D(foundSuffix, vocab)
        });
      }
    } else {
      // No prefix/suffix matched, whole word token
      const vec16 = generateToken16DVector(segment, vocab);
      const coords3D = projectTokenTo3D(segment, vocab);
      tokens.push({
        id: `token-${tokenIndex}-${segment}`,
        index: tokenIndex++,
        text: segment,
        cleanText: lowerWord,
        type: 'word',
        start: startIndex,
        end: endIndex,
        tokenId: 1000 + (hashString(segment) % 25000),
        vector16: vec16,
        coords3D
      });
    }
  }

  return tokens;
}
