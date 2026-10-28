"use client";

import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useRegistrationClosed } from "@/lib/useNow";

export function FooterCta() {
  const closed = useRegistrationClosed();
  const { cta } = siteConfig;
  if (!cta.href || closed) return null;
  return (
    <a
      href={cta.href}
      className="inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-black shadow-[0_10px_30px_-8px_rgba(255,255,255,0.4)] transition-transform hover:scale-[1.03] active:scale-[0.97]"
    >
      {cta.label}
      <ArrowUpRight aria-hidden className="size-4" />
    </a>
  );
}