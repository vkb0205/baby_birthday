import React from 'react';
import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { VerseBackground } from './VerseBackground';
import { DecoratedTable } from './DecoratedTable';
import { StarText } from './StarText';

function CinematicCamera() {
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (time < 12) {
      const progress = Math.min(1, time / 12);
      const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      
      const startPos = new THREE.Vector3(0, 12, 25);
      const endPos = new THREE.Vector3(0, 2, 10);
      
      state.camera.position.lerpVectors(startPos, endPos, ease);
      state.camera.lookAt(0, 0, 0);
    }
  });
  return null;
}

// CRITICAL FIX: Changed prop type to accept a number
export function Scene({ onCardClick }: { onCardClick?: (cardNumber: number) => void }) {
  return (
    <>
      <CinematicCamera />
      <VerseBackground />

      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <DecoratedTable onCardClick={onCardClick} />
        
        <spotLight 
          position={[0, 8, 0]} 
          angle={0.6} 
          penumbra={1} 
          intensity={5} 
          color="#ffb3ff" 
          castShadow 
        />
      </Float>

      <StarText />

      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.4} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>

      <ambientLight intensity={0.2} color="#ffb3ff" />
    </>
  );
}