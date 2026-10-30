"use client";
//src\components\effects\ScrollScene.tsx
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MathUtils, type Group, type PointsMaterial } from "three";

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
  const target = useRef(0); // raw scroll progress, written by listener
  const current = useRef(0); // damped progress, written in frame loop
  const viewH = useRef(800);

  const isNarrow = useThree((s) => s.size.width < 640);
  const count = isNarrow ? 380 : 700;

  const positions = useMemo(() => {
    const rand = rng(1440);
    const a = new Float32Array(count * 3);
    for (let i = 0; i < a.length; i += 3) {
      a[i] = (rand() - 0.5) * 24;
      a[i + 1] = (rand() - 0.5) * 12;
      a[i + 2] = (rand() - 0.5) * 10 - 2;
    }
    return a;
  }, [count]);

  // Scroll read once per event (passive), not per frame. No React state.
  useEffect(() => {
    const read = () => {
      viewH.current = Math.max(1, window.innerHeight * 0.9);
      target.current = MathUtils.clamp(window.scrollY / viewH.current, 0, 1);
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read, { passive: true });
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  useFrame((_, delta) => {
    const g = group.current;
    const m = material.current;
    if (!g || !m) return;

    // Frame-rate independent smoothing: no stutter on fast flicks or mobile momentum.
    current.current = MathUtils.damp(current.current, target.current, 6, delta);
    const p = current.current;

    // Scrolled past hero: stop drawing entirely.
    const hidden = p > 0.995;
    if (g.visible === hidden) g.visible = !hidden;
    if (hidden) return;

    g.rotation.y += delta * 0.015;
    g.position.y = p * 2.5;
    g.position.z = p * 2;
    m.opacity = 0.75 * (1 - p * p); // eases out, holds brightness longer
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={material}
          size={isNarrow ? 0.045 : 0.035}
          color="#ffffff"
          transparent
          opacity={0.75}
          depthWrite={false}
          sizeAttenuation
        />
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