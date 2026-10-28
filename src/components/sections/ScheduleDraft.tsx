"use client";

import { motion } from "framer-motion";
import { Hammer } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/lib/useReducedMotion";

const ghosts = ["w-3/4", "w-1/2", "w-2/3"];

function Dots({ reduce }: { reduce: boolean }) {
  return (
    <span aria-hidden className="mb-1.5 ml-0.5 flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-blue"
          animate={reduce ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export function ScheduleDraft() {
  const reduce = useReducedMotion();
  const { draftTitle, draftNote } = siteConfig.schedule;

  return (
    <motion.div
      role="status"
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-xl rounded-[2rem] bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:p-8"
    >
      <div className="flex items-start gap-4">
        <motion.span
          aria-hidden
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue/15 text-blue"
          style={{ transformOrigin: "75% 75%" }}
          animate={reduce ? undefined : { rotate: [0, -16, 0] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Hammer className="size-6" />
        </motion.span>
        <div className="min-w-0">
          <h3 className="flex items-end font-sans text-xl font-bold sm:text-2xl">
            {draftTitle}
            <Dots reduce={reduce} />
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-white/75">{draftNote}</p>
        </div>
      </div>

      {/* ghost timeline: hints at what's coming, hidden from assistive tech */}
      <ul aria-hidden className="relative mt-8 space-y-6 pl-9 before:absolute before:inset-y-1 before:left-[9px] before:w-px before:bg-white/10">
        {ghosts.map((w) => (
          <li key={w} className="relative">
            <span className="absolute -left-9 top-0.5 size-5 rounded-full bg-white/10" />
            <div className="h-3 w-16 rounded-full bg-white/10 motion-safe:animate-pulse" />
            <div className={`mt-2.5 h-3 rounded-full bg-white/[0.07] motion-safe:animate-pulse ${w}`} />
          </li>
        ))}
      </ul>
    </motion.div>
  );
}