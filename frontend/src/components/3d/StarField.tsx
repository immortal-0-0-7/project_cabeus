import { Stars } from '@react-three/drei';

export function StarField() {
  return (
    <>
      <Stars
        radius={180}
        depth={80}
        count={12000}
        factor={4.2}
        saturation={0.15}
        fade
        speed={0.35}
      />
      <Stars
        radius={240}
        depth={120}
        count={6000}
        factor={2.8}
        saturation={0}
        fade
        speed={0.15}
      />
    </>
  );
}
