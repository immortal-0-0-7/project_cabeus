import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { nebulaFragmentShader, nebulaVertexShader } from '@/components/3d/shaders/nebula';

interface NebulaProps {
  mouse: React.RefObject<THREE.Vector2>;
}

export function Nebula({ mouse }: NebulaProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const smoothMouse = useRef(new THREE.Vector2(0, 0));

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uTime.value = clock.elapsedTime;
    smoothMouse.current.x = THREE.MathUtils.lerp(
      smoothMouse.current.x,
      mouse.current.x,
      0.04,
    );
    smoothMouse.current.y = THREE.MathUtils.lerp(
      smoothMouse.current.y,
      mouse.current.y,
      0.04,
    );
    material.uniforms.uMouse.value.copy(smoothMouse.current);
  });

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[120, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
        }}
      />
    </mesh>
  );
}
