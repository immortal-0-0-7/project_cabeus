import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  mouse: React.RefObject<THREE.Vector2>;
}

export function CameraRig({ mouse }: CameraRigProps) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.35, 7.5));
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(() => {
    target.current.x = THREE.MathUtils.lerp(target.current.x, mouse.current.x * 0.65, 0.035);
    target.current.y = THREE.MathUtils.lerp(
      target.current.y,
      0.35 + mouse.current.y * 0.35,
      0.035,
    );
    target.current.z = THREE.MathUtils.lerp(target.current.z, 7.5 + mouse.current.y * 0.15, 0.035);

    camera.position.copy(target.current);
    lookAt.current.x = THREE.MathUtils.lerp(lookAt.current.x, mouse.current.x * 0.25, 0.04);
    lookAt.current.y = THREE.MathUtils.lerp(lookAt.current.y, mouse.current.y * 0.12, 0.04);
    camera.lookAt(lookAt.current);
  });

  return null;
}
