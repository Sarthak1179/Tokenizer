# VectorSpace NLP • Tokenizer & 3D Vector Embedding Explorer

A modern, sleek, dark-themed interactive web application built with **React**, **Three.js (React Three Fiber)**, **Tailwind CSS**, and **Framer Motion** that visualizes and explains core Natural Language Processing (NLP) concepts: tokenization, dense vector embeddings, high-dimensional Cartesian geometry, and semantic vector analogies.

---

## 🚀 Key Features

### 1. Interactive Tokenization Module
- **Live Text Input & Presets:** Type arbitrary natural language phrases or select from curated NLP benchmarks.
- **Multiple Tokenization Algorithms:**
  - **BPE (Byte-Pair Encoding):** Subword segmentation showing prefixes, stems, and suffix suffixes.
  - **WordPiece (BERT-style):** Subword continuation tags with `##` notation.
  - **Word:** Whitespace and boundary segmentation.
  - **Byte / Character:** Granular byte-level token breakdown.
- **Physics-Based Staggered Spring Animation:** When clicking **"Tokenize"**, the sentence breaks apart into individual token blocks that physically separate.
- **Neon Subword Categorization:** Distinct neon glow borders:
  - 🟣 **Prefixes** (`un-`, `re-`, `dis-`, etc.)
  - 🟢 **Roots & Stems** (`believ`, `transform`, `artifici`, etc.)
  - 🟡 **Suffixes** (`-able`, `-ation`, `-ing`, `-ly`, etc.)
  - 🔵 **Words**
  - 🔷 **Punctuation**
- **Token Inspection:** Each token reveals its discrete vocabulary ID (`#10421`) and can be selected to stream into the embedding visualizer.

### 2. Embedding Array Visualizer
- **Cascading Matrix Slot-Machine Effect:** Watch selected tokens morph into floating decimal arrays. Numbers rapidly decrypt and roll like a sci-fi slot machine before locking into their normalized vector values.
- **16-D Dense Vector Heatmap:** Positive weights glow cyan; negative weights glow rose/magenta.
- **Spatial 3D Projection:** Deconstructs vectors into $[X, Y, Z]$ Cartesian axes with normalized dimension gauges.
- **Interactive Cosine Similarity Meter:** Select two tokens or words to calculate $\cos(\theta) = \frac{u \cdot v}{\|u\| \|v\|}$ with live affinity meters.

### 3. 3D Word Embedding Visualization (React Three Fiber)
- **Interactive 3D Cartesian Coordinate System:** Glowing X (Crimson), Y (Emerald), and Z (Cyan) axes with arrowheads, tick marks, and ground coordinate grid planes.
- **Floating Semantic Clusters:** 
  - 👑 **Royalty & Society:** *king*, *queen*, *man*, *woman*, *prince*, *princess*, *emperor*, *monarch*
  - 🤖 **AI & Computation:** *ai*, *neural*, *transformer*, *algorithm*, *robot*, *tensor*, *vector*, *computer*
  - 🌲 **Nature & Cosmos:** *forest*, *tree*, *mountain*, *river*, *ocean*, *star*, *galaxy*
  - 🏎️ **Vehicles & Velocity:** *car*, *truck*, *airplane*, *rocket*, *train*, *speed*
  - 💖 **Sentiments & Emotions:** *joy*, *love*, *ecstasy*, *peace*, *sorrow*, *gloom*, *rage*
  - 🍏 **Food & Organic:** *apple*, *banana*, *orange*, *fruit*, *bread*, *coffee*
- **OrbitControls:** Smooth damping, zoom, pan, and cinematic slow-rotation around the space.
- **Glassmorphic Hover Tooltip:** Hovering over any 3D node animates a glowing glass card displaying coordinates, vector norm, and its top 3 nearest semantic neighbors with similarity percentages.

### 4. Vocabulary Builder Tool
- **Inject Custom Concepts:** Input any new word or token and assign it to a semantic domain or custom 3D coordinates.
- **Shooting Comet & Shockwave Ripple Animation:** The new word shoots into the 3D space as a glowing projectile from the screen's edge, landing at its vector coordinates and detonating a 3D expanding shockwave ring and celebratory confetti!

### 5. Bonus: Semantic Vector Math Playground
- Test the classic Word2Vec vector analogy property:
  $$\vec{King} - \vec{Man} + \vec{Woman} \approx \vec{Queen}$$
- Real-time arithmetic on 3D and 16D coordinates with automatic nearest neighbor identification and 3D camera tracking.

### 6. Futuristic Audio Synthesizer (Web Audio API)
- Micro-interactions: tokenization sweeps, matrix rolls, whoosh on shooting words, shockwave thumps, and hover blips, with a mute toggle in the top navigation.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **3D Graphics:** Three.js + `@react-three/fiber` + `@react-three/drei`
- **Styling:** Tailwind CSS + Glassmorphism design system
- **Animation:** Framer Motion + Canvas Confetti
- **Audio:** Web Audio API synth
- **Icons:** Lucide React

---

## 💻 Getting Started

Inside the `tokenizer` directory:

```bash
# 1. Install dependencies (already completed)
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

Open `http://localhost:5173` in your browser.
