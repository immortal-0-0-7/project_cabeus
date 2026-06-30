import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createProceduralMoonTextures } from '@/utils/proceduralMoon';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MoonProps {
  mouse: React.RefObject<THREE.Vector2>;
}

export function Moon({ mouse }: MoonProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const reducedMotion = useReducedMotion();
  const textures = useMemo(() => createProceduralMoonTextures(1024), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!reducedMotion) {
      mesh.rotation.y += delta * 0.035;
    }

    const targetX = mouse.current.y * 0.12;
    const targetY = mouse.current.x * 0.18;
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetX, 0.04);
    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, -targetY, 0.04);
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[2.15, 192, 192]} />
      <meshPhysicalMaterial
        map={textures.map}
        normalMap={textures.normalMap}
        roughnessMap={textures.roughnessMap}
        displacementMap={textures.displacementMap}
        displacementScale={0.18}
        normalScale={new THREE.Vector2(1.4, 1.4)}
        metalness={0.015}
        roughness={0.92}
        envMapIntensity={0.15}
        clearcoat={0.04}
        clearcoatRoughness={0.85}
      />
    </mesh>
  );
}
