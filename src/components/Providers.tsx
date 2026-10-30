"use client";
//src\components\Providers.tsx
import { MotionConfig } from "framer-motion";
import { SmoothScroll } from "@/components/effects/SmoothScroll";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      {children}
    </MotionConfig>
  );
}