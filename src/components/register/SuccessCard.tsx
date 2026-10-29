"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GroupLink } from "@/app/register/actions";
import { siteConfig } from "@/config/site";
import { useReducedMotion } from "@/lib/useReducedMotion";

export type Done = { name: string; whatsapp: string; eventNames: string[]; groups: GroupLink[] };

const ease = [0.22, 1, 0.36, 1] as const;
const glass =
  "bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_40px_90px_-30px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/[0.08]";
const tile = "rounded-3xl bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]";
const label = "text-xs font-medium uppercase tracking-[0.14em] text-white/60";

export function SuccessCard({ done }: { done: Done }) {
  const reduce = useReducedMotion();
  const { event } = siteConfig;
  const title = useRef<HTMLHeadingElement>(null);
  const [opened, setOpened] = useState<string[]>([]);
  const missing = done.eventNames.filter((n) => !done.groups.some((g) => g.name === n));
  const many = done.groups.length > 1;

  // Land at the top and move focus to the heading so screen readers announce the result.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    title.current?.focus({ preventScroll: true });
  }, [reduce]);

  const draw = (delay: number, duration: number) => ({
    initial: reduce ? false : { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration, delay, ease },
  });

  return (
    <motion.section
      aria-labelledby="done-title"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className={`rounded-[2rem] p-2 ${glass}`}
    >
      {/* confirmation */}
      <div className={`${tile} p-6 text-center sm:p-10`}>
        <svg viewBox="0 0 52 52" aria-hidden className="mx-auto size-16" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <motion.circle cx="26" cy="26" r="23" className="stroke-green/40" {...draw(0, 0.7)} />
          <motion.path d="M15 27l8 8 14-16" className="stroke-green" {...draw(0.45, 0.5)} />
        </svg>
        <h2 id="done-title" ref={title} tabIndex={-1} className="mt-5 font-sans text-3xl font-bold outline-none sm:text-4xl">
          You&apos;re in, {done.name.split(" ")[0]}!
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/75">Your registration is saved. You&apos;re registered for:</p>
        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {done.eventNames.map((n) => (
            <li key={n} className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-bold">
              {n}
            </li>
          ))}
        </ul>
      </div>

      {/* next step: WhatsApp groups */}
      <div className={`${tile} mt-2 p-5 sm:p-7`}>
        <p className={label}>[Next step]</p>
        <h3 className="mt-2 font-sans text-xl font-bold sm:text-2xl">
          Join your WhatsApp group{many ? "s" : ""}
        </h3>
        <p className="mt-1.5 text-sm leading-6 text-white/70">Updates, schedule changes and announcements for your events will be shared there.</p>

        {done.groups.length > 0 ? (
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {done.groups.map((g, i) => {
              const seen = opened.includes(g.slug);
              return (
                <motion.li
                  key={g.slug}
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.5 + i * 0.08, ease }}
                >
                  <a
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpened((p) => (p.includes(g.slug) ? p : [...p, g.slug]))}
                    className="group flex min-h-16 items-center gap-3 rounded-2xl bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors hover:bg-white/[0.13] focus-visible:bg-white/[0.13]"
                  >
                    <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-xl bg-green/20 text-green">
                      {seen ? <Check className="size-5" /> : <MessageCircle className="size-5" />}
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate font-sans text-base font-bold">{g.name}</span>
                      <span className="block text-sm text-white/65">{seen ? "Opened. Tap to open again" : "Join WhatsApp group"}</span>
                    </span>
                    <ArrowUpRight aria-hidden className="size-5 shrink-0 text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
                  </a>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-5 rounded-2xl bg-white/[0.05] px-4 py-3 text-sm text-white/75">
            Group links will be shared with you on WhatsApp ({done.whatsapp}).
          </p>
        )}

        {done.groups.length > 0 && missing.length > 0 && (
          <p className="mt-3 text-sm text-white/60">Group link for {missing.join(", ")} will be shared soon.</p>
        )}
      </div>

      {/* when + how we'll reach you */}
      <dl className="mt-2 grid gap-2 sm:grid-cols-2">
        <div className={`${tile} p-5`}>
          <dt className={label}>Event date</dt>
          <dd className="mt-2 font-sans text-lg font-bold">
            {event.dateLabel}
            {event.dateStatus === "tentative" && <span className="ml-2 text-sm font-medium text-orange">tentative</span>}
          </dd>
          {event.dateNote && <dd className="mt-1 text-sm text-white/65">{event.dateNote}</dd>}
        </div>
        <div className={`${tile} p-5`}>
          <dt className={label}>We&apos;ll reach you on</dt>
          <dd className="mt-2 font-sans text-lg font-bold tabular-nums">{done.whatsapp}</dd>
          <dd className="mt-1 text-sm text-white/65">WhatsApp</dd>
        </div>
      </dl>

      <div className="mt-2 flex">
        <Link
          href="/"
          className="inline-flex min-h-14 flex-1 items-center justify-center rounded-3xl bg-white px-8 text-base font-bold text-black transition-transform hover:scale-[1.01] active:scale-[0.98]"
        >
          Back to event page
        </Link>
      </div>
    </motion.section>
  );
}