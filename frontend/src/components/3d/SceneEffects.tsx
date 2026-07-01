import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function SceneEffects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={0.45}
        luminanceThreshold={0.62}
        luminanceSmoothing={0.85}
        mipmapBlur
        radius={0.72}
      />
      <Vignette eskil offset={0.18} darkness={0.82} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
}
