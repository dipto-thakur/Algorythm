"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useRegistrationClosed } from "@/lib/useNow";

export function EventRegisterCta() {
  const closed = useRegistrationClosed();
  const base =
    "group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-2xl border px-8 text-base font-semibold tracking-tight transition-colors";

  if (closed) {
    return (
      <span aria-disabled="true" className={`${base} cursor-not-allowed border-white/10 bg-white/[0.06] text-white/45`}>
        Registrations closed
      </span>
    );
  }
  return (
    <Link
      href={siteConfig.cta.href}
      className={`${base} border-white/70 bg-white text-black hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black`}
    >
      {siteConfig.cta.label}
      <ArrowUpRight aria-hidden className="size-[18px] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}