import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';

useGLTF.preload('/models/moon.glb');

const TARGET_DIAMETER = 10;
const MOON_POSITION: [number, number, number] = [4.8, 0, 0];
const ROTATION_SPEED = 0.065;

function prepareLunarMaterial(material: THREE.Material): THREE.MeshStandardMaterial {
  if (
    material instanceof THREE.MeshStandardMaterial ||
    material instanceof THREE.MeshPhysicalMaterial
  ) {
    material.metalness = 0;
    material.roughness = 0.97;
    material.color.set('#c8c8d0');
    material.emissive.set('#0a0a10');
    material.emissiveIntensity = 0.03;
    if (material.map) {
      material.map.colorSpace = THREE.SRGBColorSpace;
    }
    material.needsUpdate = true;
    return material;
  }

  const source = material as THREE.MeshStandardMaterial;
  const lunarMaterial = new THREE.MeshStandardMaterial({
    map: source.map ?? null,
    normalMap: source.normalMap ?? null,
    roughnessMap: source.roughnessMap ?? null,
    aoMap: source.aoMap ?? null,
    color: new THREE.Color('#c8c8d0'),
    roughness: 0.97,
    metalness: 0,
    emissive: new THREE.Color('#0a0a10'),
    emissiveIntensity: 0.03,
  });

  if (lunarMaterial.map) {
    lunarMaterial.map.colorSpace = THREE.SRGBColorSpace;
  }

  material.dispose();
  return lunarMaterial;
}

export function Moon() {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();
  const { scene } = useGLTF('/models/moon.glb');

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = TARGET_DIAMETER / maxDim;

    clone.position.sub(center);
    clone.scale.setScalar(scale);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = true;
      child.receiveShadow = true;

      if (Array.isArray(child.material)) {
        child.material = child.material.map(prepareLunarMaterial);
      } else {
        child.material = prepareLunarMaterial(child.material);
      }
    });

    return clone;
  }, [scene]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || reducedMotion) return;

    group.rotation.y += delta * ROTATION_SPEED;
  });

  return (
    <group ref={groupRef} position={MOON_POSITION}>
      <primitive object={model} />
    </group>
  );
}
