import React, { useMemo } from 'react';
import * as THREE from 'three';
import { WordNode } from '../../types/nlp';

interface VectorConnectionsProps {
  vocabulary: WordNode[];
  activeNode: WordNode | null;
}

export const VectorConnections: React.FC<VectorConnectionsProps> = ({
  vocabulary,
  activeNode
}) => {
  // Pre-configured semantic relationships
  const staticPairs = useMemo(() => {
    return [
      ['king', 'queen'],
      ['man', 'woman'],
      ['king', 'man'],
      ['queen', 'woman'],
      ['prince', 'princess'],
      ['ai', 'neural'],
      ['neural', 'transformer'],
      ['algorithm', 'computer'],
      ['vector', 'tensor'],
      ['forest', 'tree'],
      ['river', 'ocean'],
      ['star', 'galaxy'],
      ['car', 'truck'],
      ['airplane', 'rocket'],
      ['joy', 'ecstasy'],
      ['joy', 'love'],
      ['sorrow', 'gloom'],
      ['apple', 'banana'],
      ['apple', 'fruit'],
    ];
  }, []);

  // Generate lines for static semantic pairs
  const staticLines = useMemo(() => {
    const lines: { points: [number, number, number][]; color: string }[] = [];

    staticPairs.forEach(([w1, w2]) => {
      const nodeA = vocabulary.find(v => v.word === w1);
      const nodeB = vocabulary.find(v => v.word === w2);
      if (nodeA && nodeB) {
        // Analogy pairs (king-man, queen-woman) get special dashed or cyan tone
        const isAnalogy = (w1 === 'king' && w2 === 'man') || (w1 === 'queen' && w2 === 'woman');
        lines.push({
          points: [nodeA.coords, nodeB.coords],
          color: isAnalogy ? '#38bdf8' : nodeA.color
        });
      }
    });

    return lines;
  }, [vocabulary, staticPairs]);

  // Dynamic lines to nearest neighbors of activeNode
  const dynamicLines = useMemo(() => {
    if (!activeNode) return [];

    const lines: { points: [number, number, number][]; color: string }[] = [];
    // Sort other nodes by distance
    const others = vocabulary
      .filter(v => v.id !== activeNode.id)
      .map(v => {
        const dx = v.coords[0] - activeNode.coords[0];
        const dy = v.coords[1] - activeNode.coords[1];
        const dz = v.coords[2] - activeNode.coords[2];
        return { node: v, dist: Math.sqrt(dx * dx + dy * dy + dz * dz) };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3); // top 3 nearest

    others.forEach(({ node }) => {
      lines.push({
        points: [activeNode.coords, node.coords],
        color: '#06b6d4'
      });
    });

    return lines;
  }, [activeNode, vocabulary]);

  return (
    <group>
      {/* Background static semantic clusters lines */}
      {staticLines.map((line, idx) => {
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...line.points[0]),
          new THREE.Vector3(...line.points[1])
        ]);

        return (
          <primitive
            key={`static-line-${idx}`}
            object={
              new THREE.Line(
                geom,
                new THREE.LineBasicMaterial({
                  color: line.color,
                  transparent: true,
                  opacity: 0.18
                })
              )
            }
          />
        );
      })}

      {/* Dynamic Nearest-Neighbor Lines for Active Node */}
      {dynamicLines.map((line, idx) => {
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...line.points[0]),
          new THREE.Vector3(...line.points[1])
        ]);

        return (
          <primitive
            key={`dyn-line-${idx}`}
            object={
              new THREE.Line(
                geom,
                new THREE.LineBasicMaterial({
                  color: '#38bdf8',
                  transparent: true,
                  opacity: 0.65,
                  linewidth: 2
                })
              )
            }
          />
        );
      })}
    </group>
  );
};
