import * as THREE from 'three';

const TAU = Math.PI * 2;

function fract(n: number): number {
  return n - Math.floor(n);
}

function hash2(x: number, y: number): number {
  return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function noise2D(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);

  const ux = xf * xf * (3 - 2 * xf);
  const uy = yf * yf * (3 - 2 * yf);

  return THREE.MathUtils.lerp(
    THREE.MathUtils.lerp(a, b, ux),
    THREE.MathUtils.lerp(c, d, ux),
    uy,
  );
}

function fbm(x: number, y: number, octaves: number): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency);
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2.05;
  }

  return value / maxValue;
}

function craterField(u: number, v: number): number {
  const sx = u * TAU;
  const sy = v * TAU;
  const base = fbm(sx * 2.4, sy * 2.4, 5);
  const detail = fbm(sx * 9.5 + 12.7, sy * 9.5 - 4.2, 4);
  const micro = fbm(sx * 28 + 3.1, sy * 28 + 8.4, 3);
  const craterNoise = fbm(sx * 14 - 20, sy * 14 + 11, 6);
  const craters = Math.pow(Math.max(0, 1 - craterNoise * 1.15), 2.8);

  return base * 0.35 + detail * 0.25 + micro * 0.08 + craters * 0.55;
}

function sampleHeight(u: number, v: number): number {
  const wrappedU = fract(u);
  const wrappedV = Math.max(0.001, Math.min(0.999, v));
  return craterField(wrappedU, wrappedV);
}

export interface MoonTextureSet {
  map: THREE.DataTexture;
  normalMap: THREE.DataTexture;
  roughnessMap: THREE.DataTexture;
  displacementMap: THREE.DataTexture;
}

export function createProceduralMoonTextures(size = 1024): MoonTextureSet {
  const albedo = new Uint8Array(size * size * 4);
  const normal = new Uint8Array(size * size * 4);
  const roughness = new Uint8Array(size * size * 4);
  const displacement = new Uint8Array(size * size * 4);

  const step = 1 / size;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const idx = (y * size + x) * 4;

      const height = sampleHeight(u, v);
      const hx =
        sampleHeight(u + step, v) - sampleHeight(u - step, v);
      const hy =
        sampleHeight(u, v + step) - sampleHeight(u, v - step);

      const normalStrength = 4.5;
      let nx = -hx * normalStrength;
      let ny = -hy * normalStrength;
      const nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      const nzNorm = nz / len;

      const regolith = 0.12 + height * 0.22;
      const mare = smoothstep(0.42, 0.72, fbm(u * TAU * 1.6, v * TAU * 1.6, 4));
      const albedoValue = THREE.MathUtils.clamp(
        regolith + mare * 0.06 - height * 0.08,
        0.06,
        0.38,
      );

      const roughnessValue = THREE.MathUtils.clamp(
        0.78 + height * 0.18 - mare * 0.08,
        0.55,
        0.98,
      );

      albedo[idx] = Math.floor(albedoValue * 255);
      albedo[idx + 1] = Math.floor(albedoValue * 255);
      albedo[idx + 2] = Math.floor(albedoValue * 255);
      albedo[idx + 3] = 255;

      normal[idx] = Math.floor((nx * 0.5 + 0.5) * 255);
      normal[idx + 1] = Math.floor((ny * 0.5 + 0.5) * 255);
      normal[idx + 2] = Math.floor((nzNorm * 0.5 + 0.5) * 255);
      normal[idx + 3] = 255;

      roughness[idx] = Math.floor(roughnessValue * 255);
      roughness[idx + 1] = Math.floor(roughnessValue * 255);
      roughness[idx + 2] = Math.floor(roughnessValue * 255);
      roughness[idx + 3] = 255;

      displacement[idx] = Math.floor(height * 255);
      displacement[idx + 1] = Math.floor(height * 255);
      displacement[idx + 2] = Math.floor(height * 255);
      displacement[idx + 3] = 255;
    }
  }

  const map = new THREE.DataTexture(albedo, size, size, THREE.RGBAFormat);
  const normalMap = new THREE.DataTexture(normal, size, size, THREE.RGBAFormat);
  const roughnessMap = new THREE.DataTexture(roughness, size, size, THREE.RGBAFormat);
  const displacementMap = new THREE.DataTexture(displacement, size, size, THREE.RGBAFormat);

  for (const tex of [map, normalMap, roughnessMap, displacementMap]) {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
  }

  map.colorSpace = THREE.SRGBColorSpace;
  normalMap.colorSpace = THREE.LinearSRGBColorSpace;
  roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
  displacementMap.colorSpace = THREE.LinearSRGBColorSpace;

  return { map, normalMap, roughnessMap, displacementMap };
}
