import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Billboard, Text } from '@react-three/drei';
import { ShootingCometEffect } from '../../types/nlp';
import { soundFx } from '../../utils/audio';

interface ShootingCometMeshProps {
  comet: ShootingCometEffect;
  onLand: (comet: ShootingCometEffect) => void;
}

export const ShootingCometMesh: React.FC<ShootingCometMeshProps> = ({ comet, onLand }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [currentPos, setCurrentPos] = useState<[number, number, number]>(comet.startPos);
  const startTimeRef = useRef<number>(Date.now());
  const hasLandedRef = useRef<boolean>(false);

  useFrame(() => {
    if (hasLandedRef.current) return;

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const rawProgress = elapsed / comet.duration;

    if (rawProgress >= 1) {
      hasLandedRef.current = true;
      soundFx.playShockwave();
      onLand(comet);
      return;
    }

    // Cubic ease-out
    const t = 1 - Math.pow(1 - rawProgress, 3);

    const x = comet.startPos[0] + (comet.targetPos[0] - comet.startPos[0]) * t;
    const y = comet.startPos[1] + (comet.targetPos[1] - comet.startPos[1]) * t;
    const z = comet.startPos[2] + (comet.targetPos[2] - comet.startPos[2]) * t;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }
    setCurrentPos([x, y, z]);
  });

  return (
    <group ref={groupRef} position={comet.startPos}>
      {/* Comet Glowing Head */}
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={comet.color}
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Trailing Aura */}
      <mesh>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial
          color={comet.color}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Travelling Word Label */}
      <Billboard position={[0, 0.45, 0]}>
        <Text
          fontSize={0.28}
          color="#38bdf8"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#030712"
        >
          {comet.word}
        </Text>
      </Billboard>
    </group>
  );
};
