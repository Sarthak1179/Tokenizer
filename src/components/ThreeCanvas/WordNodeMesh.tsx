import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { WordNode } from '../../types/nlp';
import { soundFx } from '../../utils/audio';

interface WordNodeMeshProps {
  node: WordNode;
  isHovered: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  onHover: (node: WordNode | null, event?: THREE.Event) => void;
  onClick: (node: WordNode) => void;
}

export const WordNodeMesh: React.FC<WordNodeMeshProps> = ({
  node,
  isHovered,
  isSelected,
  isHighlighted,
  onHover,
  onClick
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [internalHover, setInternalHover] = useState(false);

  // Subtle floating breathing animation
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const offset = (node.coords[0] + node.coords[1]) * 0.4;
      meshRef.current.position.y = node.coords[1] + Math.sin(time * 1.5 + offset) * 0.05;

      if (ringRef.current && (isHovered || isSelected || internalHover)) {
        ringRef.current.rotation.z += 0.02;
      }
    }
  });

  const active = isHovered || isSelected || internalHover;
  const radius = active ? 0.24 : 0.18;

  return (
    <group position={[node.coords[0], node.coords[1], node.coords[2]]}>
      {/* 3D Sphere Mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          soundFx.playHover();
          onClick(node);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setInternalHover(true);
          soundFx.playHover();
          onHover(node, e);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setInternalHover(false);
          onHover(null);
        }}
      >
        <sphereGeometry args={[radius, 28, 28]} />
        <meshStandardMaterial
          color={active ? '#ffffff' : node.color}
          emissive={node.color}
          emissiveIntensity={active ? 2.0 : isHighlighted ? 1.4 : 0.8}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* Electric Blue Halo Ring for active nodes */}
      {(active || isHighlighted) && (
        <mesh ref={ringRef} position={[0, 0, 0]}>
          <ringGeometry args={[0.3, 0.36, 36]} />
          <meshBasicMaterial
            color="#3b82f6"
            side={THREE.DoubleSide}
            transparent
            opacity={active ? 0.9 : 0.5}
          />
        </mesh>
      )}

      {/* Billboarded Text Label (Built-in font, 100% reliable) */}
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        position={[0, radius + 0.28, 0]}
      >
        <Text
          fontSize={active ? 0.28 : 0.22}
          color={active ? '#60a5fa' : '#ffffff'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {node.word}
        </Text>
      </Billboard>
    </group>
  );
};
