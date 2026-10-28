"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { AmbientBackground } from "@/components/effects/AmbientBackground";
import { HeroPanel } from "@/components/hero/HeroPanel";
import { ease, stack } from "@/components/hero/variants";
import { SmartImage } from "@/components/ui/SmartImage";
import { siteAssets, siteConfig } from "@/config/site";
import { useReducedMotion } from "@/lib/useReducedMotion";


const letters: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.055 } } };
const letter: Variants = {
  hidden: { opacity: 0, y: 36, filter: "blur(10px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};
// Arrives just after the last letter lands.
const sub: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease, delay: 0.55 } },
};

export function HeroSection({ registeredCount }: { registeredCount: number | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.04, 1.14]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const titleOpacity = useTransform(scrollYProgress, [0.05, 0.6], [1, 0]);
  const mx = useMotionValue(50);
  const my = useMotionValue(40);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${mx}% ${my}%, rgba(255,255,255,0.12), transparent 65%)`;

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative flex min-h-svh flex-col items-center gap-6 overflow-hidden border-b border-dashed border-line px-3 pb-8 pt-24 sm:gap-8 sm:px-6 sm:pt-28"
    >
      <motion.div aria-hidden className="absolute inset-0" style={reduce ? undefined : { y: bgY, scale: bgScale }}>
        <SmartImage asset={siteAssets.hero} fill priority sizes="100vw" className="object-cover" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-[rgba(37,177,255,0.88)] mix-blend-soft-light" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_38%,rgba(0,0,0,0.5),transparent)]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
      <AmbientBackground />
      {!reduce && <motion.div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block" style={{ background: spotlight }} />}

      <motion.div
        className="relative z-10 flex w-full flex-1 flex-col items-center justify-center px-2 py-6 text-center"
        style={reduce ? undefined : { y: titleY, opacity: titleOpacity }}
        variants={stack}
        initial={reduce ? false : "hidden"}
        animate="show"
      >
        <motion.h1
          id="hero-title"
          aria-label={siteConfig.name}
          variants={letters}
          className="flex justify-center font-display text-[clamp(3.5rem,13vw,8.5rem)] leading-none tracking-wide drop-shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
        >
          {siteConfig.name.split("").map((c, i) => (
            <motion.span
              key={i}
              aria-hidden
              variants={letter}
              className="inline-block bg-gradient-to-b from-white via-white to-white/55 bg-clip-text text-transparent"
            >
              {c}
            </motion.span>
          ))}
        </motion.h1>

          <motion.p
            variants={sub}
            className="mt-5  text-balance text-base leading-7 text-white/85 drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:mt-6 sm:text-lg"
          >
            {siteConfig.subtext}
          </motion.p>
        
      </motion.div>

      <HeroPanel registeredCount={registeredCount} />
    </section>
  );
}