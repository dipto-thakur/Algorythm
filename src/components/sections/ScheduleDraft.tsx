"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/lib/useReducedMotion";

const ghosts = ["w-3/4", "w-1/2", "w-2/3"];

export function ScheduleDraft() {
  const reduce = useReducedMotion();
  const { draftTitle, draftNote } = siteConfig.schedule;

  return (
    <motion.div
      role="status"
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-xl border-y border-dashed border-line py-8"
    >
      <p className="text-xs uppercase tracking-wide text-muted">[Status]</p>
      <h3 className="mt-3 font-sans text-xl font-bold text-blue sm:text-2xl">{draftTitle}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-white/70">{draftNote}</p>

      {/* ghost timeline: hints at what's coming, hidden from assistive tech */}
      <ul aria-hidden className="relative mt-8 space-y-6 pl-8 before:absolute before:inset-y-1 before:left-[7px] before:w-px before:bg-white/10">
        {ghosts.map((w) => (
          <li key={w} className="relative">
            <span className="absolute -left-8 top-0.5 size-3.5 rounded-full border border-dashed border-line" />
            <div className="h-px w-16 bg-line" />
            <div className={`mt-3 h-px bg-white/10 ${w}`} />
          </li>
        ))}
      </ul>
    </motion.div>
  );
}