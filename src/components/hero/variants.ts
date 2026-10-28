import type { Variants } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;
export const stack: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } };
export const rise: Variants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } };