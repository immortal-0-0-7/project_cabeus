import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import type { RefObject } from 'react';
import { Moon } from '@/components/3d/Moon';
import { Nebula } from '@/components/3d/Nebula';
import { StarField } from '@/components/3d/StarField';
import { FloatingParticles } from '@/components/3d/FloatingParticles';
import { CameraRig } from '@/components/3d/CameraRig';
import { LightingSetup } from '@/components/3d/LightingSetup';
import { SceneEffects } from '@/components/3d/SceneEffects';

interface LandingSceneProps {
  mouse: RefObject<THREE.Vector2>;
}

function SceneContent({ mouse }: LandingSceneProps) {
  return (
    <>
      <color attach="background" args={['#02040a']} />
      <fog attach="fog" args={['#02040a', 18, 90]} />
      <CameraRig mouse={mouse} />
      <LightingSetup />
      <Nebula mouse={mouse} />
      <StarField />
      <FloatingParticles />
      <Moon mouse={mouse} />
      <SceneEffects />
    </>
  );
}

export function LandingScene({ mouse }: LandingSceneProps) {
  return (
    <Canvas
      className="touch-none"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
      camera={{ position: [0, 0.35, 7.5], fov: 42, near: 0.1, far: 200 }}
    >
      <Suspense fallback={null}>
        <SceneContent mouse={mouse} />
      </Suspense>
    </Canvas>
  );
}
