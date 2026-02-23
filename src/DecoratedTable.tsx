import React from 'react';
import { Sparkles, Text, useTexture, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import ptb1 from './assets/Ptb1.JPG';
import ptb2 from './assets/Ptb2.JPG';
import ptb3 from './assets/Ptb3.JPG';
import ptb4 from './assets/Ptb4.mp4';

// A smarter Polaroid that adapts to image dimensions
function Polaroid({ position, rotation, url, scale = 1.3 }: { position: [number, number, number], rotation: [number, number, number], url: string, scale?: number }) {
  const texture = useVideoTexture(url, {
    muted: true,        // Safari WILL NOT autoplay video if it thinks there is sound
    playsInline: true,  // Forces iOS Safari not to open the video in fullscreen mode
    crossOrigin: 'Anonymous', // Prevents Safari security blocks on hosted videos
    loop: true,
    autoPlay: true
  });
  texture.colorSpace = THREE.SRGBColorSpace;

  // --- 1. Calculate Dimensions based on the loaded image ---
  // Grab actual dimensions from the loaded image data
  const imgWidth = texture.image.width;
  const imgHeight = texture.image.height;
  const aspectRatio = imgWidth / imgHeight;

  // Define constants for the Polaroid look
  const PHOTO_BASE_WIDTH = 0.7; // We fix the width, height adjusts dynamically
  const MARGIN_SIDE = 0.05;
  const MARGIN_TOP = 0.05;
  const MARGIN_BOTTOM = 0.25; // The classic thick "chin"
  const FRAME_THICKNESS = 0.02;

  // Calculate dynamic geometry sizes
  // If portrait (aspect < 1), height will be larger than width.
  const photoHeight = PHOTO_BASE_WIDTH / aspectRatio;
  const frameWidth = PHOTO_BASE_WIDTH + (MARGIN_SIDE * 2);
  const frameHeight = photoHeight + MARGIN_TOP + MARGIN_BOTTOM;

  // Calculate offset: The photo isn't centered vertically because of the chin.
  // We need to shift it slightly "up" (negative Z on the table surface) relative to the frame center.
  const photoZOffset = -((frameHeight / 2) - (MARGIN_TOP + photoHeight / 2));

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* White frame box */}
      {/* Note: boxGeometry args are [width, height (thickness), depth (length on table)] */}
      <mesh castShadow receiveShadow position={[0, FRAME_THICKNESS / 2, 0]}>
        <boxGeometry args={[frameWidth, FRAME_THICKNESS, frameHeight]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} emissive="#222222" />
      </mesh>

      {/* Photo area plane */}
      {/* Positioned slightly above the frame, shifted Z to account for the chin */}
      <mesh position={[0, FRAME_THICKNESS + 0.001, photoZOffset]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[PHOTO_BASE_WIDTH, photoHeight]} />
        {/* toneMapped={false} makes it glow brightly in the dark scene */}
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

export function DecoratedTable({ onCardClick }: { onCardClick?: () => void }) {
  const customCake = useGLTF('/cake_3d.glb');
  const customTable = useGLTF('/antique_table.glb');
  return (
    <group position={[0, -2, 0]}>
      {/* THE TABLE SURFACE */}
      <primitive 
        object={customTable.scene} 
        position={[0, -6.75, 0]} // You may need to tweak the Y value if your table sits too high or low
        scale={0.3} // You may need to change this if your table imports giant or tiny
      />

      {/* THE CUSTOM 3D BIRTHDAY CAKE */}
      <group position={[0, 0, 0]}>
        
        {/* Render your loaded model */}
        {/* You may need to change the scale=[x,x,x] if your model imports too huge or too tiny! */}
        <primitive 
          object={customCake.scene} 
          position={[0, 1.4, 0]} 
          scale={0.3}
          rotation={[0, -Math.PI/2, 0]}
        />
        
        {/* Keep the magical candle lighting! */}
        {/* Adjust the Y position (currently 1.9) up or down so the light sits exactly on your model's candle */}
        <pointLight position={[0, 2.5, 0]} intensity={2.5} color="#ffaa00" distance={5} />
        <Sparkles position={[0, 1.5, 0]} count={15} scale={0.5} size={2} speed={0.8} color="#ffaa00" />
      </group>

      {/* BIRTHDAY CARDS */}
      <group 
        position={[-1.8, 0.1, 1.2]} 
        rotation={[0, 0.5, 0]}
        onClick={(e) => { 
          e.stopPropagation(); 
          // Send '1' when this card is clicked
          if (onCardClick) onCardClick(1); 
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <planeGeometry args={[1.2, 1.6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} />
        </mesh>
        <Text
          position={[0, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.15}
          color="#ff007f"
          anchorX="center"
          anchorY="middle"
        >
          {`To my\nUniverse`}
        </Text>
      </group>
      
      <group 
        position={[1.8, 0.1, 0.8]} 
        rotation={[0, -0.4, 0]}
        onClick={(e) => { 
          e.stopPropagation(); 
          // Send '2' when this card is clicked
          if (onCardClick) onCardClick(2); 
        }}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <planeGeometry args={[1.2, 1.6]} />
          <meshStandardMaterial color="#fff0f5" roughness={0.1} />
        </mesh>
        <Text
          position={[0, 0.01, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.12}
          color="#800040"
          anchorX="center"
          anchorY="middle"
        >
          {`I love you\nto the stars\nand back.`}
        </Text>
      </group>

      {/* FLOATING ROSE PETALS */}
      <Sparkles count={40} scale={5} size={4} speed={0.2} color="#ff0055" position={[0, 1, 0]} />

      {/* POLAROIDS (Photobooth photos) */}
      {/* Replace the 'url' props below with your own photos! */}
      {/* You can upload them and use their URLs, or place them in the public folder and use '/photo1.jpg' */}
      <Polaroid 
        position={[-2.2, 0.01, 2.0]} 
        rotation={[0, Math.PI / 6, 0]} 
        url={ptb1} 
      />
      <Polaroid 
        position={[-0.8, 0.01, 2.6]} 
        rotation={[0, -Math.PI / 12, 0]} 
        url={ptb2}
      />
      <Polaroid 
        position={[0.8, 0.01, 2.6]} 
        rotation={[0, Math.PI / 8, 0]} 
        url={ptb3}
      />
      <Polaroid 
        position={[2.2, 0.01, 2.0]} 
        rotation={[0, -Math.PI / 6, 0]} 
        url={ptb4} 
      />
    </group>
  );
}
