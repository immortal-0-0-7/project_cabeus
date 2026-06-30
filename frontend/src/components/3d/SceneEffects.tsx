import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function SceneEffects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={1.35}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={0.72}
      />
      <Vignette eskil offset={0.18} darkness={0.65} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
}
