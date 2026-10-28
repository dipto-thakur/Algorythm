"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ease } from "./variants";

export function RegisteredBadge({ count, className }: { count: number; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString("en-IN"));

  useEffect(() => {
    if (reduce) {
      mv.set(count);
      return;
    }
    const c = animate(mv, count, { duration: 1.6, delay: 1.3, ease });
    return () => c.stop();
  }, [count, reduce, mv]);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.1, duration: 0.6, ease }}
      className={`flex items-center gap-2.5 rounded-full bg-black/55 px-4 py-2 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl ${className ?? ""}`}
    >
      <span aria-hidden className="relative flex size-2.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green opacity-75" />
        <span className="relative inline-flex size-2.5 rounded-full bg-green" />
      </span>
      <span aria-label={`${count} registered`}>
        <motion.b className="font-bold tabular-nums">{text}</motion.b> registered
      </span>
    </motion.div>
  );
}