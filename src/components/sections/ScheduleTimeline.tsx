"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { ScheduleItem } from "@/types/site";

const line = "absolute inset-y-0 left-[9.5px] w-px md:left-1/2";

export function ScheduleTimeline({ items }: { items: ScheduleItem[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 110, damping: 28, restDelta: 0.001 });

  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl">
      <span aria-hidden className={cn(line, "bg-white/10")} />
      <motion.span aria-hidden className={cn(line, "origin-top bg-blue shadow-[0_0_12px_#3080ed]")} style={reduce ? undefined : { scaleY }} />
      {items.map((item, i) => {
        const left = i % 2 === 1;
        const last = i === items.length - 1;
        return (
          <li key={`${i}-${item.time}`} className={cn("relative pb-12 pl-10 md:grid md:grid-cols-2 md:pb-14 md:pl-0", last && "pb-0 md:pb-0")}>
            <motion.span
              aria-hidden
              className="absolute left-0 top-0.5 z-10 size-5 rounded-full bg-blue shadow-[0_0_0_6px_rgba(48,128,237,0.18)] md:left-1/2 md:-ml-2.5"
              initial={reduce ? false : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: "-20% 0px" }}
              transition={{ type: "spring", stiffness: 380, damping: 18 }}
            />
            {last && <span aria-hidden className="absolute bottom-0 left-[8px] top-7 z-[5] w-[3px] bg-background md:left-1/2 md:-ml-[1.5px]" />}
            <motion.div
              className={cn("md:col-start-2 md:pl-10", left && "md:col-start-1 md:row-start-1 md:pr-10 md:text-right")}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <time className="block text-base font-bold text-blue">{item.time}</time>
              <p className="mt-1.5 text-sm font-medium uppercase tracking-wide sm:text-base">{item.title}</p>
            </motion.div>
          </li>
        );
      })}
    </ol>
  );
}