'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PHASES, useProgress } from '@/lib/progress';

// same phase accents as ScrollSync, in 0..1 for the shader
const ACCENT: Record<string, [number, number, number]> = {
  cells: [244 / 255, 114 / 255, 182 / 255],
  device: [94 / 255, 234 / 255, 212 / 255],
  helix: [125 / 255, 211 / 255, 252 / 255],
  cloud: [34 / 255, 211 / 255, 238 / 255],
  network: [167 / 255, 139 / 255, 250 / 255],
  code: [74 / 255, 222 / 255, 128 / 255],
  constellation: [251 / 255, 191 / 255, 36 / 255],
  globe: [226 / 255, 232 / 255, 240 / 255],
};

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.999, 1.0); // fullscreen, pinned to far plane
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec3 uBase;   // near-black
  uniform vec3 uTint;   // dark accent wash
  uniform vec3 uGlow;   // brighter accent, sparse

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = (gl_FragCoord.xy / uRes);
    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 2.2;
    float t = uTime * 0.04;

    // domain-warped flow for organic blobs
    vec2 q = vec2(fbm(p * 0.8 + t), fbm(p * 0.8 - t + 4.7));
    float n = fbm(p * 1.1 + q * 1.6 + t * 0.4);

    vec3 col = mix(uBase, uTint, smoothstep(0.25, 0.85, n));
    col = mix(col, uGlow, pow(smoothstep(0.65, 1.0, n), 2.0) * 0.6);

    // gentle vignette for depth
    float vig = smoothstep(1.5, 0.15, length((uv - 0.5) * 2.0));
    col *= mix(0.55, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function GradientBackdrop() {
  const mesh = useRef<THREE.Mesh>(null);
  const { size } = useThree();
  const reduce = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uBase: { value: new THREE.Color(0.02, 0.025, 0.04) },
      uTint: { value: new THREE.Color(0.05, 0.09, 0.1) },
      uGlow: { value: new THREE.Color(0.1, 0.2, 0.2) },
    }),
    [],
  );

  const tmpA = useMemo(() => new THREE.Color(), []);
  const tmpB = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    if (!reduce) uniforms.uTime.value += delta;
    uniforms.uRes.value.set(size.width * state.viewport.dpr, size.height * state.viewport.dpr);

    // tint toward the current phase accent so the backdrop morphs too
    const pos = useProgress.getState().phasePos;
    const i0 = Math.min(Math.floor(pos), PHASES.length - 2);
    const f = pos - i0;
    const a = ACCENT[PHASES[i0]];
    const b = ACCENT[PHASES[i0 + 1]];
    tmpA.setRGB(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f);
    // dark wash + sparse glow derived from the accent
    tmpB.copy(tmpA).multiplyScalar(0.16);
    uniforms.uTint.value.lerp(tmpB, 0.05);
    tmpB.copy(tmpA).multiplyScalar(0.42);
    uniforms.uGlow.value.lerp(tmpB, 0.05);
  });

  return (
    <mesh ref={mesh} frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
