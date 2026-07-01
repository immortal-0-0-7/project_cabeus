import { Sparkles } from '@react-three/drei';

export function FloatingParticles() {
  return (
    <>
      <Sparkles
        count={70}
        scale={[14, 10, 14]}
        size={1.8}
        speed={0.25}
        opacity={0.18}
        color="#67d8ff"
        noise={0.6}
      />
      <Sparkles
        count={45}
        scale={[18, 12, 18]}
        size={1.2}
        speed={0.15}
        opacity={0.1}
        color="#6e5dff"
        noise={0.8}
      />
    </>
  );
}
