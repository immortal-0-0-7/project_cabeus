import { Sparkles } from '@react-three/drei';

export function FloatingParticles() {
  return (
    <>
      <Sparkles
        count={120}
        scale={[14, 10, 14]}
        size={2.4}
        speed={0.25}
        opacity={0.45}
        color="#67d8ff"
        noise={0.6}
      />
      <Sparkles
        count={80}
        scale={[18, 12, 18]}
        size={1.6}
        speed={0.15}
        opacity={0.25}
        color="#6e5dff"
        noise={0.8}
      />
      <Sparkles
        count={60}
        scale={[10, 8, 10]}
        position={[0, -1.5, 2]}
        size={1.2}
        speed={0.1}
        opacity={0.2}
        color="#f4f7fa"
        noise={1}
      />
    </>
  );
}
