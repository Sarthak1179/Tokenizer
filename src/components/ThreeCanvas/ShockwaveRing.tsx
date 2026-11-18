import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ShockwaveEffect } from '../../types/nlp';

interface ShockwaveRingProps {
  effect: ShockwaveEffect;
  onComplete: (id: string) => void;
}

export const ShockwaveRing: React.FC<ShockwaveRingProps> = ({ effect, onComplete }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTimeRef = useRef<number>(Date.now());

  useFrame(() => {
    if (!meshRef.current) return;

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const progress = Math.min(1, elapsed / effect.duration);

    if (progress >= 1) {
      onComplete(effect.id);
      return;
    }

    // Expand scale outward
    const scale = 0.2 + progress * (effect.maxRadius * 2.5);
    meshRef.current.scale.set(scale, scale, scale);

    // Fade opacity
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    if (mat) {
      mat.opacity = Math.max(0, (1 - progress) * 0.85);
    }
  });

  return (
    <group position={effect.position}>
      {/* Horizontal ring on the ground / plane */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.45, 36]} />
        <meshBasicMaterial
          color={effect.color}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
