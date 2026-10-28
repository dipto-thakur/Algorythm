"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { events } from "@/data/events";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function EventsSection() {
  const reduce = useReducedMotion();
  const linked = siteConfig.features.eventPages;

  return (
    <section id="events" aria-labelledby="events-title" className="rail-bounded">
      <Reveal>
        <SectionHeading id="events-title" label={`${String(events.length).padStart(2, "0")} Events`} title="paanch events, ek ALGORYTHM" color="green" />
      </Reveal>
      <ol className="mt-12 border-t border-dashed border-line">
        {events.map((e, i) => {
          const body = (
            <div className="group flex gap-4 px-5 py-6 transition-colors hover:bg-white/[0.03] sm:gap-6 sm:py-7 lg:grid lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1.2fr)_1.5rem] lg:items-center lg:gap-8">
              <span className="pt-1 text-sm font-medium text-blue lg:pt-0">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1 lg:contents">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-sans text-xl font-bold transition-colors group-hover:text-orange sm:text-2xl">{e.name}</h3>
                  <span className="rounded-full border border-white/25 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-white/80">
                    {e.kind}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-white/80 lg:mt-0">{e.blurb}</p>
              </div>
              {linked && (
                <ArrowUpRight
                  aria-hidden
                  className="hidden size-5 text-white/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange lg:block"
                />
              )}
            </div>
          );
          return (
            <motion.li
              key={e.slug}
              className="border-b border-dashed border-line last:border-b-0"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {linked ? (
                <Link href={`/events/${e.slug}`} aria-label={`${e.name}, ${e.kind}`} className="block">
                  {body}
                </Link>
              ) : (
                body
              )}
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}