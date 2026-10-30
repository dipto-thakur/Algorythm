"use client";
//src\components\ui\ScrollProgress.tsx
import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 34, mass: 0.4, restDelta: 0.0005 });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, willChange: "transform" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-blue via-green to-orange"
    />
  );
}