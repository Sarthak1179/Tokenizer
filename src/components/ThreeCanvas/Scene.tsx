import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { WordNode, ShockwaveEffect, ShootingCometEffect } from '../../types/nlp';
import { AxesCoordinateSystem } from './AxesCoordinateSystem';
import { WordNodeMesh } from './WordNodeMesh';
import { VectorConnections } from './VectorConnections';
import { ShockwaveRing } from './ShockwaveRing';
import { ShootingCometMesh } from './ShootingCometMesh';

interface SceneProps {
  vocabulary: WordNode[];
  selectedNode: WordNode | null;
  hoveredNode: WordNode | null;
  highlightedWord: string | null;
  onHoverNode: (node: WordNode | null, event?: THREE.Event) => void;
  onClickNode: (node: WordNode) => void;
  shockwaves: ShockwaveEffect[];
  comets: ShootingCometEffect[];
  onCometLand: (comet: ShootingCometEffect) => void;
  onShockwaveComplete: (id: string) => void;
  autoRotate: boolean;
}

// Camera controller that smoothly tracks target when focused
const CameraRig: React.FC<{
  targetCoords: [number, number, number] | null;
  controlsRef: React.RefObject<OrbitControlsImpl>;
}> = ({ targetCoords, controlsRef }) => {
  useFrame(() => {
    if (targetCoords && controlsRef.current) {
      const targetVec = new THREE.Vector3(...targetCoords);
      controlsRef.current.target.lerp(targetVec, 0.05);
      controlsRef.current.update();
    }
  });

  return null;
};

export const Scene: React.FC<SceneProps> = ({
  vocabulary,
  selectedNode,
  hoveredNode,
  highlightedWord,
  onHoverNode,
  onClickNode,
  shockwaves,
  comets,
  onCometLand,
  onShockwaveComplete,
  autoRotate
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const targetCoords = useMemo<[number, number, number] | null>(() => {
    if (highlightedWord) {
      const match = vocabulary.find(
        w => w.word.toLowerCase() === highlightedWord.toLowerCase()
      );
      if (match) return match.coords;
    }
    if (selectedNode) {
      return selectedNode.coords;
    }
    return null;
  }, [highlightedWord, selectedNode, vocabulary]);

  return (
    <div
      className="w-full h-full relative bg-black select-none"
      style={{ width: '100%', height: '100%', minHeight: '600px' }}
    >
      <Canvas
        className="w-full h-full"
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onPointerMissed={() => onHoverNode(null)}
      >
        {/* Strict Explicit Camera Setup */}
        <PerspectiveCamera
          makeDefault
          position={[13, 11, 15]}
          fov={50}
          near={0.1}
          far={1000}
        />

        {/* Solid Pure Black Background */}
        <color attach="background" args={['#000000']} />

        {/* High-Contrast Professional Lighting System */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 8]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, 10, -8]} intensity={0.8} color="#60a5fa" />
        <pointLight position={[0, 8, 0]} intensity={1.2} distance={30} color="#3b82f6" />
        <pointLight position={[0, -5, 0]} intensity={0.5} distance={20} color="#ffffff" />

        {/* Glowing Cartesian Axes with Ground Grid */}
        <AxesCoordinateSystem axisLength={8} />

        {/* Semantic Vector Connections */}
        <VectorConnections
          vocabulary={vocabulary}
          activeNode={hoveredNode || selectedNode}
        />

        {/* 3D Word Nodes */}
        {vocabulary.map((node) => {
          const isHovered = hoveredNode?.id === node.id;
          const isSelected = selectedNode?.id === node.id;
          const isHighlighted = highlightedWord?.toLowerCase() === node.word.toLowerCase();

          return (
            <WordNodeMesh
              key={node.id}
              node={node}
              isHovered={isHovered}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              onHover={onHoverNode}
              onClick={onClickNode}
            />
          );
        })}

        {/* Shooting Comets on Word Injection */}
        {comets.map((comet) => (
          <ShootingCometMesh
            key={comet.id}
            comet={comet}
            onLand={onCometLand}
          />
        ))}

        {/* Shockwave Rings on Word Landing */}
        {shockwaves.map((sw) => (
          <ShockwaveRing
            key={sw.id}
            effect={sw}
            onComplete={onShockwaveComplete}
          />
        ))}

        {/* Dynamic Controls with Orbit Pan and Auto-Rotate */}
        <CameraRig targetCoords={targetCoords} controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          maxDistance={45}
          minDistance={2.5}
          autoRotate={autoRotate}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
