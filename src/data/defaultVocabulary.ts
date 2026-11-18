import { WordNode, SemanticCluster } from '../types/nlp';

export const SEMANTIC_CLUSTERS: Record<string, SemanticCluster> = {
  royalty: {
    id: 'royalty',
    name: 'Royalty & Society',
    color: '#e11d48', // Rose / Red
    center: [4.5, 3.2, 2.0],
    description: 'Hierarchical social roles, status, and gendered titles exhibiting parallel vector properties.'
  },
  technology: {
    id: 'technology',
    name: 'AI & Computation',
    color: '#06b6d4', // Cyan
    center: [-4.0, 4.5, -3.0],
    description: 'Artificial intelligence, neural architecture, algorithms, and computational theory.'
  },
  nature: {
    id: 'nature',
    name: 'Nature & Cosmos',
    color: '#10b981', // Emerald
    center: [-3.5, -4.0, 3.5],
    description: 'Ecosystems, planetary bodies, organisms, and wilderness elements.'
  },
  vehicles: {
    id: 'vehicles',
    name: 'Vehicles & Velocity',
    color: '#f59e0b', // Amber
    center: [3.8, -3.5, -3.2],
    description: 'Transportation systems, mechanical engines, and kinetic acceleration.'
  },
  emotions: {
    id: 'emotions',
    name: 'Sentiments & Emotions',
    color: '#ec4899', // Pink / Magenta
    center: [0.2, 4.8, 3.8],
    description: 'Human subjective valence, emotional states, and affective experiences.'
  },
  food: {
    id: 'food',
    name: 'Food & Nourishment',
    color: '#8b5cf6', // Violet
    center: [-2.0, -1.5, -4.5],
    description: 'Edible flora, sustenance, culinary items, and agricultural products.'
  }
};

// Generates a deterministic 16D vector from a 3D coordinate + word seed
function generateDenseVector(word: string, coords: [number, number, number]): number[] {
  const [x, y, z] = coords;
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = (hash << 5) - hash + word.charCodeAt(i);
    hash |= 0;
  }

  const vec: number[] = [];
  // First 3 dimensions mirror normalized 3D coords
  const norm3d = Math.sqrt(x * x + y * y + z * z) || 1;
  vec.push(Number((x / norm3d).toFixed(3)));
  vec.push(Number((y / norm3d).toFixed(3)));
  vec.push(Number((z / norm3d).toFixed(3)));

  // Remaining 13 dimensions derived deterministically
  for (let d = 3; d < 16; d++) {
    const raw = Math.sin((hash + d * 1337) * 0.1) * 0.85 + Math.cos(x * d + y * 0.5) * 0.15;
    vec.push(Number(raw.toFixed(3)));
  }

  // Normalize 16-D vector
  const totalNorm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map(v => Number((v / totalNorm).toFixed(3)));
}

interface RawWordItem {
  id: string;
  word: string;
  category: string;
  coords: [number, number, number];
  color: string;
  description: string;
  denseVector: number[];
}

const RAW_VOCABULARY: RawWordItem[] = [
  // Royalty & Society
  {
    id: 'king',
    word: 'king',
    category: 'royalty',
    coords: [4.8, 3.5, 2.2],
    color: '#e11d48',
    description: 'Male monarch of an independent state.',
    denseVector: []
  },
  {
    id: 'queen',
    word: 'queen',
    category: 'royalty',
    coords: [4.2, 3.8, 2.0],
    color: '#e11d48',
    description: 'Female ruler or wife of a reigning king.',
    denseVector: []
  },
  {
    id: 'man',
    word: 'man',
    category: 'royalty',
    coords: [3.2, 1.2, 2.4],
    color: '#e11d48',
    description: 'Adult human male entity.',
    denseVector: []
  },
  {
    id: 'woman',
    word: 'woman',
    category: 'royalty',
    coords: [2.6, 1.5, 2.2],
    color: '#e11d48',
    description: 'Adult human female entity.',
    denseVector: []
  },
  {
    id: 'prince',
    word: 'prince',
    category: 'royalty',
    coords: [5.1, 2.9, 1.8],
    color: '#e11d48',
    description: 'Close male relative of a monarch, heir apparent.',
    denseVector: []
  },
  {
    id: 'princess',
    word: 'princess',
    category: 'royalty',
    coords: [4.5, 3.2, 1.6],
    color: '#e11d48',
    description: 'Daughter of a monarch or wife of a prince.',
    denseVector: []
  },
  {
    id: 'emperor',
    word: 'emperor',
    category: 'royalty',
    coords: [5.2, 3.7, 2.5],
    color: '#e11d48',
    description: 'Sovereign ruler of great rank of an empire.',
    denseVector: []
  },
  {
    id: 'monarch',
    word: 'monarch',
    category: 'royalty',
    coords: [4.6, 4.0, 2.1],
    color: '#e11d48',
    description: 'Head of state such as a king, queen, or emperor.',
    denseVector: []
  },

  // AI & Computation
  {
    id: 'ai',
    word: 'ai',
    category: 'technology',
    coords: [-4.2, 4.6, -3.2],
    color: '#06b6d4',
    description: 'Artificial simulation of cognitive intelligence in machines.',
    denseVector: []
  },
  {
    id: 'neural',
    word: 'neural',
    category: 'technology',
    coords: [-3.8, 4.8, -2.8],
    color: '#06b6d4',
    description: 'Pertaining to synthetic or biological neurons and networks.',
    denseVector: []
  },
  {
    id: 'transformer',
    word: 'transformer',
    category: 'technology',
    coords: [-4.0, 5.2, -3.1],
    color: '#06b6d4',
    description: 'Self-attention based deep learning sequence architecture.',
    denseVector: []
  },
  {
    id: 'algorithm',
    word: 'algorithm',
    category: 'technology',
    coords: [-4.5, 4.1, -3.5],
    color: '#06b6d4',
    description: 'Deterministic finite set of instructions for calculation.',
    denseVector: []
  },
  {
    id: 'robot',
    word: 'robot',
    category: 'technology',
    coords: [-3.5, 3.9, -2.5],
    color: '#06b6d4',
    description: 'Autonomous programmable electro-mechanical machine.',
    denseVector: []
  },
  {
    id: 'vector',
    word: 'vector',
    category: 'technology',
    coords: [-4.3, 4.7, -3.3],
    color: '#06b6d4',
    description: 'Ordered array of numbers representing position in n-space.',
    denseVector: []
  },
  {
    id: 'tensor',
    word: 'tensor',
    category: 'technology',
    coords: [-4.6, 4.9, -3.4],
    color: '#06b6d4',
    description: 'Multi-dimensional geometric array of numerical components.',
    denseVector: []
  },
  {
    id: 'computer',
    word: 'computer',
    category: 'technology',
    coords: [-4.8, 3.8, -3.0],
    color: '#06b6d4',
    description: 'Programmable electronic device for high-speed computation.',
    denseVector: []
  },

  // Nature & Cosmos
  {
    id: 'forest',
    word: 'forest',
    category: 'nature',
    coords: [-3.2, -4.2, 3.8],
    color: '#10b981',
    description: 'Dense ecosystem dominated by trees and biological flora.',
    denseVector: []
  },
  {
    id: 'tree',
    word: 'tree',
    category: 'nature',
    coords: [-3.0, -4.5, 3.6],
    color: '#10b981',
    description: 'Perennial woody plant typically with trunk and branches.',
    denseVector: []
  },
  {
    id: 'mountain',
    word: 'mountain',
    category: 'nature',
    coords: [-3.8, -3.7, 4.1],
    color: '#10b981',
    description: 'Elevated landform rising abruptly above surrounding landscape.',
    denseVector: []
  },
  {
    id: 'river',
    word: 'river',
    category: 'nature',
    coords: [-3.4, -4.4, 3.1],
    color: '#10b981',
    description: 'Continuous natural flowing watercourse heading toward a sea.',
    denseVector: []
  },
  {
    id: 'ocean',
    word: 'ocean',
    category: 'nature',
    coords: [-4.0, -4.1, 3.0],
    color: '#10b981',
    description: 'Vast continuous body of salt water covering earth surface.',
    denseVector: []
  },
  {
    id: 'star',
    word: 'star',
    category: 'nature',
    coords: [-2.8, -3.5, 4.5],
    color: '#10b981',
    description: 'Luminous astronomical sphere of plasma held by gravity.',
    denseVector: []
  },
  {
    id: 'galaxy',
    word: 'galaxy',
    category: 'nature',
    coords: [-2.5, -3.2, 4.8],
    color: '#10b981',
    description: 'Gravitationally bound system of stars, stellar remnants, and dark matter.',
    denseVector: []
  },

  // Vehicles & Velocity
  {
    id: 'car',
    word: 'car',
    category: 'vehicles',
    coords: [3.5, -3.2, -3.0],
    color: '#f59e0b',
    description: 'Four-wheeled motorized road vehicle for passenger transit.',
    denseVector: []
  },
  {
    id: 'truck',
    word: 'truck',
    category: 'vehicles',
    coords: [3.9, -3.0, -3.4],
    color: '#f59e0b',
    description: 'Heavy commercial motor vehicle designed to haul freight.',
    denseVector: []
  },
  {
    id: 'airplane',
    word: 'airplane',
    category: 'vehicles',
    coords: [4.2, -4.2, -2.8],
    color: '#f59e0b',
    description: 'Powered flying machine supported by wings and jet thrust.',
    denseVector: []
  },
  {
    id: 'rocket',
    word: 'rocket',
    category: 'vehicles',
    coords: [4.5, -4.5, -2.5],
    color: '#f59e0b',
    description: 'High-thrust projectile propelled by expelling reactionary mass.',
    denseVector: []
  },
  {
    id: 'train',
    word: 'train',
    category: 'vehicles',
    coords: [3.6, -3.1, -3.3],
    color: '#f59e0b',
    description: 'Connected series of rail carriages pulled along a track.',
    denseVector: []
  },
  {
    id: 'speed',
    word: 'speed',
    category: 'vehicles',
    coords: [4.0, -4.1, -3.1],
    color: '#f59e0b',
    description: 'Rate at which someone or something is able to move.',
    denseVector: []
  },

  // Sentiments & Emotions
  {
    id: 'joy',
    word: 'joy',
    category: 'emotions',
    coords: [0.5, 5.0, 3.9],
    color: '#ec4899',
    description: 'Vibrant feeling of profound pleasure and contentment.',
    denseVector: []
  },
  {
    id: 'love',
    word: 'love',
    category: 'emotions',
    coords: [0.2, 4.6, 4.2],
    color: '#ec4899',
    description: 'Deep affective bond of interpersonal warmth and commitment.',
    denseVector: []
  },
  {
    id: 'ecstasy',
    word: 'ecstasy',
    category: 'emotions',
    coords: [0.8, 5.3, 4.1],
    color: '#ec4899',
    description: 'Overwhelming feeling of boundless bliss and elation.',
    denseVector: []
  },
  {
    id: 'peace',
    word: 'peace',
    category: 'emotions',
    coords: [-0.1, 4.5, 4.4],
    color: '#ec4899',
    description: 'State of tranquility, serenity, and harmonic balance.',
    denseVector: []
  },
  {
    id: 'sorrow',
    word: 'sorrow',
    category: 'emotions',
    coords: [-0.6, 3.5, 3.1],
    color: '#ec4899',
    description: 'Distress and anguish caused by loss, affliction, or regret.',
    denseVector: []
  },
  {
    id: 'gloom',
    word: 'gloom',
    category: 'emotions',
    coords: [-0.8, 3.2, 2.9],
    color: '#ec4899',
    description: 'Subdued state of darkness, melancholy, or depression.',
    denseVector: []
  },
  {
    id: 'rage',
    word: 'rage',
    category: 'emotions',
    coords: [1.2, 3.8, 2.5],
    color: '#ec4899',
    description: 'Violent and uncontrolled emotional fury.',
    denseVector: []
  },

  // Food & Nourishment
  {
    id: 'apple',
    word: 'apple',
    category: 'food',
    coords: [-1.9, -1.6, -4.4],
    color: '#8b5cf6',
    description: 'Crisp round pomaceous fruit of an apple tree.',
    denseVector: []
  },
  {
    id: 'banana',
    word: 'banana',
    category: 'food',
    coords: [-2.2, -1.4, -4.6],
    color: '#8b5cf6',
    description: 'Curved tropical elongated fruit with yellow peel.',
    denseVector: []
  },
  {
    id: 'orange',
    word: 'orange',
    category: 'food',
    coords: [-1.7, -1.3, -4.2],
    color: '#8b5cf6',
    description: 'Citrus round edible fruit with fragrant orange rind.',
    denseVector: []
  },
  {
    id: 'fruit',
    word: 'fruit',
    category: 'food',
    coords: [-2.0, -1.5, -4.5],
    color: '#8b5cf6',
    description: 'Sweet fleshy seed-bearing structure of flowering plants.',
    denseVector: []
  },
  {
    id: 'bread',
    word: 'bread',
    category: 'food',
    coords: [-2.5, -1.8, -4.1],
    color: '#8b5cf6',
    description: 'Staple food prepared from dough of flour and water by baking.',
    denseVector: []
  },
  {
    id: 'coffee',
    word: 'coffee',
    category: 'food',
    coords: [-1.5, -2.0, -4.8],
    color: '#8b5cf6',
    description: 'Aromatic brewed drink made from roasted coffee beans.',
    denseVector: []
  }
];

export const INITIAL_VOCABULARY: WordNode[] = RAW_VOCABULARY.map(item => ({
  ...item,
  denseVector: generateDenseVector(item.word, item.coords)
}));
