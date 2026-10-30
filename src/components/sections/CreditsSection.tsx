"use client";

import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import type { Credit } from "@/types/site";

const columns: { label: string; heading: string; items: readonly Credit[] }[] = [
  { label: "Patron", heading: "patron", items: siteConfig.credits.patrons },
  { label: "Associates", heading: "associations", items: siteConfig.credits.associations },
].filter((c) => c.items.length > 0);

export function CreditsSection() {
  if (columns.length === 0) return null;
  return (
    <section
      id="credits"
      aria-label="Patron and associations"
      className={cn("rail-bounded grid", columns.length > 1 && "md:grid-cols-2")}
    >
      {columns.map((col, i) => (
        <Reveal
          key={col.label}
          delay={i * 0.1}
          className={cn(i > 0 && "border-t border-dashed border-line md:border-l md:border-t-0")}
        >
          <h2 className="border-b border-dashed border-line px-5 py-5 text-sm uppercase tracking-wide text-muted">
            [{col.label}]
          </h2>
          <ul>
            {col.items.map((c) => (
              <li key={c.name} className="border-b border-dashed border-line px-5 py-8 last:border-b-0">
                <p className="font-sans text-2xl font-bold sm:text-3xl">{c.name}</p>
                <p className="mt-2 text-sm leading-6 text-white/80">{c.subtext}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </section>
  );
}