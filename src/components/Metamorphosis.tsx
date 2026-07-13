'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { PHASES, useProgress } from '@/lib/progress';
import { buildFormations } from '@/lib/formations';
import { GradientBackdrop } from './GradientBackdrop';

const N = 2800;

const vertexShader = /* glsl */ `
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform float uSize;
  uniform float uPixelRatio;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize * uPixelRatio * (1.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a);
  }
`;

function Particles() {
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);

  const forms = useMemo(() => buildFormations(N), []);
  const phaseKeys = PHASES;

  // live buffers we mutate each frame
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(forms.cells.positions), 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(forms.cells.colors), 3));
    return g;
  }, [forms]);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uSize: { value: 26 },
          uPixelRatio: { value: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1 },
        },
      }),
    [],
  );

  // eased phase position, so morphs feel intentional, not linear
  const eased = useRef(0);
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useFrame((state, delta) => {
    const target = useProgress.getState().phasePos;
    // reduced motion: snap to the scroll-driven target, no autonomous drift.
    // Small base = snappy catch-up so the formation resolves quickly as you scroll.
    eased.current += (target - eased.current) * (reduceMotion ? 1 : 1 - Math.pow(0.0000005, delta));
    const p = eased.current;

    const i0 = Math.min(Math.floor(p), phaseKeys.length - 2);
    const f = p - i0;
    // smootherstep for organic settling
    const e = f * f * f * (f * (f * 6 - 15) + 10);

    const A = forms[phaseKeys[i0]];
    const B = forms[phaseKeys[i0 + 1]];
    const pos = geo.attributes.position.array as Float32Array;
    const col = geo.attributes.aColor.array as Float32Array;

    // gentle idle drift so it never looks frozen (disabled under reduced motion)
    const t = state.clock.elapsedTime;
    const driftAmp = reduceMotion ? 0 : 0.02;
    for (let i = 0; i < N; i++) {
      const j = i * 3;
      const drift = Math.sin(t * 0.6 + i) * driftAmp;
      pos[j] = A.positions[j] + (B.positions[j] - A.positions[j]) * e + drift;
      pos[j + 1] = A.positions[j + 1] + (B.positions[j + 1] - A.positions[j + 1]) * e;
      pos[j + 2] = A.positions[j + 2] + (B.positions[j + 2] - A.positions[j + 2]) * e + drift;
      col[j] = A.colors[j] + (B.colors[j] - A.colors[j]) * e;
      col[j + 1] = A.colors[j + 1] + (B.colors[j + 1] - A.colors[j + 1]) * e;
      col[j + 2] = A.colors[j + 2] + (B.colors[j + 2] - A.colors[j + 2]) * e;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.aColor.needsUpdate = true;

    if (group.current) {
      group.current.rotation.y = reduceMotion ? p * 0.15 : Math.sin(t * 0.08) * 0.35 + p * 0.15;
    }
  });

  return (
    <group ref={group}>
      <points ref={points} geometry={geo} material={mat} />
    </group>
  );
}

export function Metamorphosis() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <GradientBackdrop />
        <Particles />
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.6} intensity={1.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
