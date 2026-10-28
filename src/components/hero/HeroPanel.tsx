"use client";

import { motion, type Variants } from "framer-motion";
import { CalendarDays, CalendarX2, Timer } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Countdown } from "./Countdown";
import { InfoTile } from "./InfoTile";
import { RegisterCta } from "./RegisterCta";
import { RegisteredBadge } from "./RegisteredBadge";
import { ease } from "./variants";

const { event, registration } = siteConfig;
const icon = "size-3.5 shrink-0";

const panel: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease,
      delay: 0.15,
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

export function HeroPanel() {
  const reduce = useReducedMotion();
  const count = registration.registeredCount;

  return (
    <div className="relative z-10 w-full max-w-xl">
      {count !== null && (
        <RegisteredBadge
          count={count}
          className="absolute -top-4 right-5 z-20"
        />
      )}

      <motion.div
        variants={panel}
        initial={reduce ? false : "hidden"}
        animate="show"
        className="flex flex-col gap-2 rounded-[2rem] bg-black/30 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_32px_80px_-32px_rgba(0,0,0,0.75)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/[0.08]"
      >
        <InfoTile
          label="Registration closes in"
          icon={<Timer aria-hidden="true" className={icon} />}
          info={registration.info}
        >
          <div className="mt-4">
            <Countdown />
          </div>
        </InfoTile>

        <div className="grid grid-cols-2 gap-2">
          <InfoTile
            label="Reg. deadline"
            icon={<CalendarX2 aria-hidden="true" className={icon} />}
          >
            <p className="mt-3 font-sans text-lg font-bold leading-tight tracking-tight sm:text-xl">
              {registration.deadlineLabel}
            </p>
          </InfoTile>

          <InfoTile
            label="Event date"
            icon={<CalendarDays aria-hidden="true" className={icon} />}
            info={event.dateInfo}
          >
            <p className="mt-3 font-sans text-lg font-bold leading-tight tracking-tight sm:text-xl">
              {event.dateLabel}
            </p>

            {event.timeLabel && (
              <p className="mt-1 text-sm leading-relaxed text-white/70">
                {event.timeLabel}
              </p>
            )}
          </InfoTile>
        </div>
      </motion.div>

      <RegisterCta />
    </div>
  );
}