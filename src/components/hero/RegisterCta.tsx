"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRegistrationClosed } from "@/lib/useNow";
import { ease } from "./variants";

const { cta } = siteConfig;

const base =
  "group relative flex min-h-[4.25rem] w-full items-center justify-center gap-2.5 rounded-2xl border px-8 text-base font-semibold tracking-tight transition-[background-color,border-color,box-shadow,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-lg";

const entrance: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease,
      delay: 0.3,
    },
  },
};

export function RegisterCta() {
  const reduce = useReducedMotion();
  const closed = useRegistrationClosed();
  const enabled = Boolean(cta.href) && !closed;

  return (
    <motion.div
      variants={entrance}
      initial={reduce ? false : "hidden"}
      animate="show"
      className="mt-5 flex flex-col items-center gap-3 sm:mt-6"
    >
      {enabled ? (
        <a
          href={cta.href!}
          className={`${base} border-white/70 bg-white text-black shadow-[0_8px_32px_-16px_rgba(255,255,255,0.35)] hover:border-white hover:bg-white/90 hover:shadow-[0_12px_36px_-16px_rgba(255,255,255,0.45)] active:bg-white/80`}
        >
          <span>{cta.label}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:size-[18px]"
          />
        </a>
      ) : (
        <span
          aria-disabled="true"
          className={`${base} cursor-not-allowed border-white/10 bg-white/[0.06] text-white/45 backdrop-blur-xl`}
        >
          {closed ? "Registrations closed" : cta.label}
        </span>
      )}

      {!closed && !cta.href && (
        <p className="text-sm text-white/50">
          Registration link coming soon
        </p>
      )}
    </motion.div>
  );
}