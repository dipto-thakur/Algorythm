"use client";

import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useNow } from "@/lib/useNow";
import { ease } from "./variants";

const labels = ["days", "hrs", "min", "sec"];

function Digit({ value, label }: { value: number | null; label: string }) {
  const text = value === null ? "--" : String(value).padStart(2, "0");
  return (
    <div className="text-center">
      <div className="relative h-10 overflow-hidden font-display text-4xl leading-10 tabular-nums sm:h-11 sm:text-[2.5rem] sm:leading-[2.75rem]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className="block"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <p className="mt-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white/60">{label}</p>
    </div>
  );
}

export function Countdown() {
  const now = useNow();
  const left = now === null ? null : Math.max(0, new Date(siteConfig.registration.deadlineISO).getTime() - now);

  if (left === 0) return <p className="font-sans text-xl font-bold text-orange">Registrations closed</p>;

  const s = left === null ? null : Math.floor(left / 1000);
  const vals = s === null ? [null, null, null, null] : [Math.floor(s / 86400), Math.floor((s % 86400) / 3600), Math.floor((s % 3600) / 60), s % 60];
  const aria = s === null ? "Time left to register" : `${vals[0]} days ${vals[1]} hours left to register`;

  return (
    <div role="timer" aria-label={aria} className="grid grid-cols-4 gap-1">
      {labels.map((l, i) => (
        <Digit key={l} value={vals[i] ?? null} label={l} />
      ))}
    </div>
  );
}