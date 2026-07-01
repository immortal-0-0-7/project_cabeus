export const nebulaVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const nebulaFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;

  varying vec2 vUv;
  varying vec3 vPosition;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.05;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x += uMouse.x * 0.08;
    uv.y += uMouse.y * 0.05;

    float t = uTime * 0.04;
    vec2 flow = vec2(t * 0.3, t * 0.15);

    float nebulaA = fbm(uv * 1.8 + flow);
    float nebulaB = fbm(uv * 2.6 - flow * 1.4 + 4.2);
    float nebulaC = fbm(uv * 0.9 + vec2(-flow.y, flow.x));

    float density = smoothstep(0.15, 0.95, nebulaA * 0.55 + nebulaB * 0.35 + nebulaC * 0.25);

    vec3 deepSpace = vec3(0.0);
    vec3 iceBlue = vec3(0.03, 0.08, 0.12);
    vec3 missionBlue = vec3(0.02, 0.05, 0.1);
    vec3 cinematic = vec3(0.05, 0.03, 0.08);
    vec3 magenta = vec3(0.06, 0.02, 0.05);

    vec3 color = deepSpace;
    color = mix(color, missionBlue, density * 0.08);
    color = mix(color, iceBlue, pow(nebulaA, 2.2) * 0.05);
    color = mix(color, cinematic, pow(nebulaB, 1.8) * 0.04);
    color = mix(color, magenta, pow(nebulaC, 2.5) * 0.025);

    float vignette = 1.0 - length(uv * 0.55);
    color *= smoothstep(0.2, 1.0, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;
