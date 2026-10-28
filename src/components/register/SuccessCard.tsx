"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/lib/useReducedMotion";

export type Done = { name: string; whatsapp: string; eventNames: string[] };

export function SuccessCard({ done }: { done: Done }) {
  const reduce = useReducedMotion();
  const { event } = siteConfig;
  return (
    <motion.div
      role="status"
      initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[2rem] bg-white/[0.05] p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl sm:p-12"
    >
      <motion.span
        aria-hidden
        initial={reduce ? false : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.2 }}
        className="mx-auto grid size-16 place-items-center rounded-full bg-green/20 text-green"
      >
        <CheckCircle2 className="size-9" />
      </motion.span>
      <h2 className="mt-6 font-sans text-3xl font-bold">You&apos;re in, {done.name.split(" ")[0]}!</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/75">
        Registered for <span className="font-bold text-white">{done.eventNames.join(", ")}</span>. We&apos;ll update you on WhatsApp
        ({done.whatsapp}). Event date: {event.dateLabel}
        {event.dateStatus === "tentative" ? " (tentative, exact date will be informed)." : "."}
      </p>
      <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-white px-8 text-sm font-bold text-black transition-transform hover:scale-[1.03] active:scale-[0.97]">
        Back to event page
      </Link>
    </motion.div>
  );
}