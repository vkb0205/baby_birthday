import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function StarText() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, targets, colors } = useMemo(() => {
    const text = "Happy birthday\nmy emnhiiu";
    const canvas = document.createElement('canvas');
    const width = 1024;
    const height = 512;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    
    // Use a nice serif font
    ctx.font = `bold 80px "Georgia", serif`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lines = text.split('\n');
    const lineHeight = 100;
    const startY = height / 2 - (lines.length - 1) * lineHeight / 2;
    
    lines.forEach((line, i) => {
      ctx.fillText(line, width / 2, startY + i * lineHeight);
    });
    
    const imgData = ctx.getImageData(0, 0, width, height).data;
    const targetPoints: THREE.Vector3[] = [];
    
    // Sample pixels
    for (let y = 0; y < height; y += 3) {
      for (let x = 0; x < width; x += 3) {
        const index = (y * width + x) * 4;
        if (imgData[index] > 128) {
          const px = (x / width - 0.5) * 14; 
          const py = -(y / height - 0.5) * 14 * (height / width);
          const pz = (Math.random() - 0.5) * 0.2;
          targetPoints.push(new THREE.Vector3(px, py, pz));
        }
      }
    }

    const count = targetPoints.length;
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorObj = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Random starting positions (scattered in the universe)
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60 + 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 20;

      // Target positions
      targets[i * 3] = targetPoints[i].x;
      targets[i * 3 + 1] = targetPoints[i].y;
      targets[i * 3 + 2] = targetPoints[i].z;

      // Colors (pinkish/white/gold)
      const rand = Math.random();
      if (rand > 0.7) colorObj.set('#ffb3ff');
      else if (rand > 0.4) colorObj.set('#ffffff');
      else colorObj.set('#ff69b4');
      
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;
    }

    return { positions, targets, colors, count };
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime();
    
    // Animation logic
    // Delay start by 1.5 seconds, then animate over 6 seconds
    const progress = Math.max(0, Math.min(1, (time - 1.5) / 6));
    
    // Easing function (exponential out)
    const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

    const positionsAttr = pointsRef.current.geometry.attributes.position;
    
    for (let i = 0; i < positions.length / 3; i++) {
      const i3 = i * 3;
      
      // Add some floating motion that gets smaller as they settle
      const floatX = Math.sin(time * 0.5 + i) * 0.05 * easeOut;
      const floatY = Math.cos(time * 0.6 + i) * 0.05 * easeOut;
      
      positionsAttr.array[i3] = THREE.MathUtils.lerp(positions[i3], targets[i3] + floatX, easeOut);
      positionsAttr.array[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targets[i3 + 1] + floatY, easeOut);
      positionsAttr.array[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], targets[i3 + 2], easeOut);
    }
    
    positionsAttr.needsUpdate = true;
  });

  return (
    <group position={[0, 4, -3]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
