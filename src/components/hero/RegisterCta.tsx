"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRegistrationClosed } from "@/lib/useNow";
import { rise } from "./variants";

const { cta } = siteConfig;
const base = "relative flex min-h-[4.25rem] w-full items-center justify-center gap-2 rounded-3xl px-10 text-lg font-bold";

export function RegisterCta() {
  const reduce = useReducedMotion();
  const closed = useRegistrationClosed();
  const enabled = !!cta.href && !closed;

  return (
    <motion.div variants={rise} className="mt-8 flex flex-col items-center gap-3">
      {enabled ? (
        <motion.a
          href={cta.href ?? undefined}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className={`${base} relative gap-2 bg-white text-black shadow-[0_0_44px_-4px_rgba(255,255,255,0.45)]`}
        >
          {!reduce && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border border-white"
              animate={{ scale: [1, 1.2], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <span className="relative">{cta.label}</span>
          <ArrowUpRight aria-hidden className="relative size-5" />
        </motion.a>
      ) : (
        <span role="link" aria-disabled="true" className={`${base} cursor-not-allowed border border-white/40 bg-white/10 text-white/70`}>
          {closed ? "Registrations closed" : cta.label}
        </span>
      )}
      {!closed && !cta.href && <p className="text-sm text-white/80">Registration link coming soon</p>}
    </motion.div>
  );
}