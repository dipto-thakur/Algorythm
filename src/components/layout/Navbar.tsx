"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { siteAssets, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";

const { college, cta } = siteConfig;
const items = siteConfig.navigation.filter(
  (item): item is { label: string; href: string } => item.href !== null,
);

const transition = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    const previous = scrollY.getPrevious() ?? 0;

    setScrolled(value > 24);

    if (!reduce && !open && value > 180) {
      setHidden(value > previous + 2);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const elements = items
      .map((item) => document.querySelector(item.href))
      .filter((element): element is Element => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75] },
    );

    elements.forEach((element) => observer.observe(element));

    const handleScroll = () => {
      if (window.scrollY < 120) setActive(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden && !open ? "-110%" : "0%" }}
      transition={{ duration: reduce ? 0 : 0.4, ease: transition }}
      className={cn(
        "fixed inset-x-0 top-0 z-40",
        "transition-[padding] duration-300",
        scrolled ? "px-3 pt-3 sm:px-5" : "px-0 pt-0",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "relative mx-auto flex max-w-[90rem] items-center justify-between gap-4",
          "px-5 transition-[height,border-radius,background-color,box-shadow,border-color] duration-300 sm:px-7 lg:px-10",
          scrolled
            ? [
                "h-[64px] rounded-2xl border border-white/15",
                "bg-black/45 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]",
                "backdrop-blur-2xl backdrop-saturate-150",
                "supports-[backdrop-filter]:bg-black/25",
              ].join(" ")
            : "h-[84px] border border-transparent bg-transparent",
        )}
      >
        <a
          href="#"
          aria-label={college.name ?? "Home"}
          className="group flex min-w-0 max-w-[75%] items-center gap-3"
        >
          <SmartImage
            asset={siteAssets.collegeLogo}
            priority
            className={cn(
              "w-auto shrink-0 rounded-lg bg-white p-1",
              "transition-[height,transform] duration-300",
              "group-hover:scale-[1.03]",
              scrolled ? "h-9 sm:h-10" : "h-10 sm:h-12",
            )}
          />

          {college.name && (
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-sans text-sm font-bold tracking-tight text-white sm:text-base lg:text-lg">
                {college.name}
              </span>

              {college.address && (
                <span
                  className={cn(
                    "hidden truncate text-xs font-medium text-white/55 transition-[opacity,max-height] duration-300 sm:block",
                    scrolled ? "max-h-0 opacity-0" : "max-h-5 opacity-100",
                  )}
                >
                  {college.address}
                </span>
              )}
            </span>
          )}
        </a>

        <div className="hidden items-center gap-3 md:flex">
          <ul className="flex items-center gap-1">
            {items.map((item) => {
              const isActive = active === item.href;

              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "relative inline-flex min-h-10 items-center justify-center rounded-xl px-3.5",
                      "text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-white/65 hover:text-white",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        aria-hidden="true"
                        className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.09]"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {cta.href && (
            <motion.a
              href={cta.href}
              whileHover={reduce ? undefined : { scale: 1.035 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              transition={{ duration: 0.2, ease: transition }}
              className={cn(
                "ml-1 inline-flex min-h-10 items-center justify-center gap-2",
                "rounded-xl bg-white px-4 text-sm font-semibold text-black",
                "transition-colors hover:bg-white/90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
              )}
            >
              {cta.label}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </motion.a>
          )}
        </div>

        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger
            aria-label="Open menu"
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl md:hidden",
              "border border-white/15 bg-white/[0.06] text-white",
              "transition-colors hover:bg-white/10",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
            )}
          >
            <Menu aria-hidden="true" className="size-5" />
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>

            <Dialog.Content
              aria-describedby={undefined}
              onCloseAutoFocus={(event) => event.preventDefault()}
              className={cn(
                "fixed inset-x-3 top-3 z-50 flex max-h-[calc(100dvh-24px)] flex-col overflow-y-auto",
                "rounded-3xl border border-white/15 bg-[#111]/90 p-5 text-white",
                "shadow-[0_24px_80px_-20px_rgba(0,0,0,0.8)]",
                "backdrop-blur-2xl backdrop-saturate-150 sm:inset-x-5 sm:top-5 sm:p-7",
              )}
            >
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  Navigation
                </Dialog.Title>

                <Dialog.Close
                  aria-label="Close menu"
                  className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.05] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <X aria-hidden="true" className="size-5" />
                </Dialog.Close>
              </div>

              <ul className="mt-5 flex flex-col">
                {items.map((item, index) => (
                  <motion.li
                    key={item.label}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: reduce ? 0 : 0.04 * index,
                      duration: reduce ? 0 : 0.35,
                      ease: transition,
                    }}
                    className="border-b border-white/[0.09] last:border-b-0"
                  >
                    <Dialog.Close asChild>
                      <a
                        href={item.href}
                        className="group flex min-h-14 items-center gap-4 py-3 font-sans text-xl font-semibold tracking-tight transition-colors hover:text-white/70 sm:text-2xl"
                      >
                        <span className="w-6 font-mono text-xs tabular-nums text-white/35">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">{item.label}</span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="size-4 text-white/30 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80"
                        />
                      </a>
                    </Dialog.Close>
                  </motion.li>
                ))}
              </ul>

              {cta.href && (
                <Dialog.Close asChild>
                  <a
                    href={cta.href}
                    className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
                  >
                    {cta.label}
                    <ArrowUpRight aria-hidden="true" className="size-4" />
                  </a>
                </Dialog.Close>
              )}

              {college.name && (
                <div className="mt-7 border-t border-white/10 pt-5">
                  <p className="text-sm font-semibold text-white/85">
                    {college.name}
                  </p>
                  {college.address && (
                    <p className="mt-1 text-xs leading-relaxed text-white/45">
                      {college.address}
                    </p>
                  )}
                </div>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>
    </motion.header>
  );
}