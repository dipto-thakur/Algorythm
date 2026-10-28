"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { siteAssets, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

const { college, cta } = siteConfig;
const items = siteConfig.navigation.filter((i): i is { label: string; href: string } => i.href !== null);
const ease = [0.22, 1, 0.36, 1] as const;

// Same glass language as the hero countdown panel and the register page.
const glass =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_20px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop-saturate-150";

export function Navbar() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { scrollY } = useScroll();

  // Compact + glass after 24px; slide away on scroll down, back on scroll up.
  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(v > 24);
    setHidden(!reduce && !open && v > 180 && v > prev + 2);
  });

  // Active section tracking (home only; other pages have no sections).
  useEffect(() => {
    if (!isHome) return;
    const els = items.map((i) => document.querySelector(i.href)).filter((e): e is Element => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top) setActive(`#${top.target.id}`);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75] },
    );
    els.forEach((el) => io.observe(el));
    const onScroll = () => window.scrollY < 120 && setActive(null);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [isHome]);

  const activeHref = isHome ? active : null;
  const hrefFor = (h: string) => (isHome ? h : `/${h}`); // "#about" works on / ; "/#about" from other pages
  const showCta = !!cta.href && pathname !== "/register";

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? "-130%" : "0%" }}
      transition={{ duration: reduce ? 0 : 0.4, ease }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5"
    >
      <nav
        aria-label="Primary"
        className={cn(
          "pointer-events-auto mx-auto flex items-center justify-between gap-3 rounded-full p-1.5 pr-1.5 transition-[max-width,background-color] duration-500 sm:pl-2",
          glass,
          scrolled ? "max-w-4xl bg-black/40 supports-[backdrop-filter]:bg-white/[0.07]" : "max-w-6xl bg-black/25 supports-[backdrop-filter]:bg-white/[0.06]",
        )}
      >
        <Link href="/" aria-label={college.name ?? "Home"} className="group flex min-w-0 flex-1 items-center gap-3 rounded-full md:flex-none md:max-w-[45%]">
          <SmartImage
            asset={siteAssets.collegeLogo}
            priority
            className="h-10 w-auto shrink-0 rounded-full  bg-white p-1 transition-transform duration-300 group-hover:scale-[1.04]"
          />
          {college.name && (
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-sans text-sm font-bold tracking-tight sm:text-base">{college.name}</span>
              {college.address && (
                <span
                  className={cn(
                    "hidden truncate text-xs font-medium text-white/60 transition-[max-height,opacity] duration-300 lg:block",
                    scrolled ? "max-h-0 opacity-0" : "max-h-5 opacity-100",
                  )}
                >
                  {college.address}
                </span>
              )}
            </span>
          )}
        </Link>

        {/* desktop */}
        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center gap-0.5">
            {items.map((i) => {
              const on = activeHref === i.href;
              return (
                <li key={i.label}>
                  <Link
                    href={hrefFor(i.href)}
                    aria-current={on ? "location" : undefined}
                    className={cn(
                      "relative inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors",
                      on ? "text-white" : "text-white/70 hover:text-white",
                    )}
                  >
                    {on && (
                      <motion.span
                        layoutId="nav-pill"
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{i.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {showCta && (
            <motion.a
              href={cta.href ?? undefined}
              whileHover={reduce ? undefined : { scale: 1.04 }}
              whileTap={reduce ? undefined : { scale: 0.96 }}
              className="ml-1 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-5 text-sm font-bold text-black shadow-[0_8px_24px_-8px_rgba(255,255,255,0.5)]"
            >
              {cta.label}
              <ArrowUpRight aria-hidden className="size-4" />
            </motion.a>
          )}
        </div>

        {/* mobile */}
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            aria-label="Open menu"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-colors hover:bg-white/[0.18] md:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <Dialog.Content
              aria-describedby={undefined}
              onCloseAutoFocus={(e) => e.preventDefault()}
              className={cn(
                "fixed inset-x-3 top-3 z-50 flex max-h-[calc(100dvh-1.5rem)] flex-col overflow-y-auto rounded-[2rem] bg-black/45 p-3 sm:inset-x-5",
                glass,
                "supports-[backdrop-filter]:bg-white/[0.08]",
              )}
            >
              <div className="flex items-center justify-between pl-3 pt-1">
                <Dialog.Title className="text-xs font-medium uppercase tracking-[0.18em] text-white/60">Menu</Dialog.Title>
                <Dialog.Close
                  aria-label="Close menu"
                  className="grid size-11 place-items-center rounded-full bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-colors hover:bg-white/[0.18]"
                >
                  <X aria-hidden className="size-5" />
                </Dialog.Close>
              </div>

              <ul className="mt-2 grid gap-1">
                {items.map((i, n) => (
                  <motion.li
                    key={i.label}
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduce ? 0 : 0.05 * n + 0.05, duration: 0.4, ease }}
                  >
                    <Dialog.Close asChild>
                      <Link
                        href={hrefFor(i.href)}
                        aria-current={activeHref === i.href ? "location" : undefined}
                        className={cn(
                          "flex min-h-14 items-center gap-4 rounded-2xl px-4 font-sans text-2xl font-bold transition-colors",
                          activeHref === i.href ? "bg-white/[0.12]" : "hover:bg-white/[0.08]",
                        )}
                      >
                        <span className="text-xs font-medium tabular-nums text-blue">{String(n + 1).padStart(2, "0")}</span>
                        {i.label}
                      </Link>
                    </Dialog.Close>
                  </motion.li>
                ))}
              </ul>

              {showCta && (
                <Dialog.Close asChild>
                  <a
                    href={cta.href ?? undefined}
                    className="mt-3 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white text-base font-bold text-black shadow-[0_8px_24px_-8px_rgba(255,255,255,0.5)]"
                  >
                    {cta.label}
                    <ArrowUpRight aria-hidden className="size-5" />
                  </a>
                </Dialog.Close>
              )}

              {college.name && (
                <p className="mt-4 rounded-2xl bg-white/[0.05] px-4 py-3 text-sm text-white/70">
                  <span className="block font-sans font-bold text-white">{college.name}</span>
                  {college.address}
                </p>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </motion.header>
  );
}