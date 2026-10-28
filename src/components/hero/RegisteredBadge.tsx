"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ease } from "./variants";

export function RegisteredBadge({ count: initial, className }: { count: number; className?: string }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(initial);
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString("en-IN"));
  const first = useRef(true);

  // First run counts up from 0; later updates continue from the number currently shown.
  useEffect(() => {
    if (reduce) {
      mv.set(count);
      return;
    }
    const c = animate(mv, count, { duration: first.current ? 1.6 : 0.8, delay: first.current ? 1.3 : 0, ease });
    first.current = false;
    return () => c.stop();
  }, [count, reduce, mv]);

  // Live refresh every 30s while the tab is visible, and instantly when you come back to it.
  useEffect(() => {
    let alive = true;
    const poll = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/api/registered-count");
        if (!res.ok) return;
        const data = (await res.json()) as { count: number | null };
        if (alive && typeof data.count === "number") setCount(data.count);
      } catch {
        /* offline or server hiccup: keep showing the last known number */
      }
    };
    const id = setInterval(poll, 30_000);
    document.addEventListener("visibilitychange", poll);
    return () => {
      alive = false;
      clearInterval(id);
      document.removeEventListener("visibilitychange", poll);
    };
  }, []);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.1, duration: 0.6, ease }}
      className={`flex items-center gap-2.5 rounded-full bg-black/55 px-4 py-2 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur-xl ${className ?? ""}`}
    >
      <span aria-hidden className="relative flex size-2.5">
        <span className="absolute inline-flex size-full rounded-full bg-green opacity-75 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2.5 rounded-full bg-green" />
      </span>
      <span aria-label={`${count} registered`}>
        <motion.b className="font-bold tabular-nums">{text}</motion.b> registered
      </span>
    </motion.div>
  );
}