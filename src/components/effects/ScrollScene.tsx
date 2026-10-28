"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, PointsMaterial } from "three";

// Seeded PRNG keeps render pure and the starfield stable.
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Stars() {
  const group = useRef<Group>(null);
  const material = useRef<PointsMaterial>(null);
  const positions = useMemo(() => {
    const rand = rng(1440);
    const a = new Float32Array(700 * 3);
    for (let i = 0; i < a.length; i += 3) {
      a[i] = (rand() - 0.5) * 24;
      a[i + 1] = (rand() - 0.5) * 12;
      a[i + 2] = (rand() - 0.5) * 10 - 2;
    }
    return a;
  }, []);

  // Scroll progress is read from the DOM inside the frame loop: no React state per frame.
  useFrame((_, delta) => {
    const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, window.innerHeight * 0.9)));
    if (group.current) {
      group.current.rotation.y += delta * 0.015;
      group.current.position.y = p * 2.5;
      group.current.position.z = p * 2;
    }
    if (material.current) material.current.opacity = 0.75 * (1 - p);
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial ref={material} size={0.035} color="#ffffff" transparent depthWrite={false} sizeAttenuation />
      </points>
    </group>
  );
}

export default function ScrollScene({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 55 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      aria-hidden
    >
      <Stars />
    </Canvas>
  );
}
