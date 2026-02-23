import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';

export function VerseBackground() {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.0002;
    }
  });

  return (
    <group ref={group}>
      {/* Pink Nebula Core */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[4, 64, 64]} position={[0, 5, -15]}>
          <meshBasicMaterial color="#ff66b2" transparent opacity={0.15} />
          <pointLight intensity={8} distance={40} color="#ff1493" />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <Sphere args={[3, 64, 64]} position={[-10, 2, -10]}>
          <meshBasicMaterial color="#ffb6c1" transparent opacity={0.1} />
          <pointLight intensity={5} distance={30} color="#ff69b4" />
        </Sphere>
      </Float>

      {/* Layered Pink Stars */}
      <Stars radius={50} depth={50} count={6000} factor={4} saturation={1} fade speed={1} />
      
      {/* Romantic Stardust */}
      <Sparkles count={500} scale={25} size={3} speed={0.2} color="#ff69b4" />
      <Sparkles count={200} scale={20} size={2} speed={0.4} color="#ffb6c1" />
      <Sparkles count={100} scale={15} size={1} speed={0.5} color="#ffd700" />

      {/* Deep Space Fog */}
      <mesh scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial side={THREE.BackSide} color="#200018" />
      </mesh>
    </group>
  );
}
