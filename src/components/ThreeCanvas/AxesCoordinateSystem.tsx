import React from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

interface AxesProps {
  axisLength?: number;
}

export const AxesCoordinateSystem: React.FC<AxesProps> = ({
  axisLength = 8
}) => {
  return (
    <group>
      {/* High-Precision Ground Grid */}
      <gridHelper
        args={[24, 24, 0x3b82f6, 0x1f242d]}
        position={[0, -0.01, 0]}
      />

      {/* Origin Marker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#3b82f6"
          emissiveIntensity={1.5}
          roughness={0.1}
        />
      </mesh>

      {/* X Axis - Crimson Red */}
      <group>
        <mesh position={[axisLength / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, axisLength, 16]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.0}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[axisLength, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.14, 0.4, 24]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#ef4444"
            emissiveIntensity={1.5}
          />
        </mesh>
        <Text
          position={[axisLength + 0.6, 0, 0]}
          fontSize={0.4}
          color="#ef4444"
          anchorX="center"
          anchorY="middle"
        >
          +X
        </Text>
      </group>

      {/* Y Axis - Vibrant Emerald */}
      <group>
        <mesh position={[0, axisLength / 2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, axisLength, 16]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.0}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, axisLength, 0]}>
          <coneGeometry args={[0.14, 0.4, 24]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#10b981"
            emissiveIntensity={1.5}
          />
        </mesh>
        <Text
          position={[0, axisLength + 0.6, 0]}
          fontSize={0.4}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          +Y
        </Text>
      </group>

      {/* Z Axis - Electric Blue */}
      <group>
        <mesh position={[0, 0, axisLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, axisLength, 16]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 0, axisLength]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.14, 0.4, 24]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={1.5}
          />
        </mesh>
        <Text
          position={[0, 0, axisLength + 0.6]}
          fontSize={0.4}
          color="#3b82f6"
          anchorX="center"
          anchorY="middle"
        >
          +Z
        </Text>
      </group>
    </group>
  );
};
