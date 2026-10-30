"use client";
//src\components\ui\Reveal.tsx
import { motion, type Variants } from "framer-motion";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/lib/useReducedMotion";

const ease = [0.22, 1, 0.36, 1] as const;

const variants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease },
  }),
};

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce || !siteConfig.features.reveal) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={variants}
      custom={Math.min(delay, 0.4)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: "some", margin: "0px 0px -8% 0px" }}
    >
      {children}
    </motion.div>
  );
}