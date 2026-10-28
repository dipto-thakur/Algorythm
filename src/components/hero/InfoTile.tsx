"use client";

import * as Popover from "@radix-ui/react-popover";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { rise } from "./variants";

type Props = { label: string; icon: React.ReactNode; info?: string | null; className?: string; children: React.ReactNode };

/** Glass tile. Info opens on mouse hover, tap/click, or keyboard (Enter/Space on the icon). */
export function InfoTile({ label, icon, info, className, children }: Props) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const hover = (next: boolean) => (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !info) return; // touch uses tap on the icon
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), next ? 80 : 140);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Anchor asChild>
        <motion.div
          variants={rise}
          onPointerEnter={hover(true)}
          onPointerLeave={hover(false)}
          className={cn(
            "rounded-3xl bg-white/[0.07] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-colors hover:bg-white/[0.1] sm:p-5",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-white/60">
              {icon}
              {label}
            </p>
            {info && (
              <Popover.Trigger asChild>
                <button
                  type="button"
                  aria-label={`More about ${label}`}
                  className="relative -mr-1 -mt-1 grid size-6 shrink-0 place-items-center rounded-full text-white/60 transition-colors hover:text-white after:absolute after:-inset-2.5 after:content-['']"
                >
                  <Info aria-hidden className="size-4" />
                </button>
              </Popover.Trigger>
            )}
          </div>
          {children}
        </motion.div>
      </Popover.Anchor>

      {info && (
        <Popover.Portal>
          <Popover.Content
            side="top"
            sideOffset={8}
            collisionPadding={12}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onPointerEnter={hover(true)}
            onPointerLeave={hover(false)}
            className="pop-content z-50 max-w-[17rem] rounded-2xl bg-black/70 px-4 py-3 text-sm leading-5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_20px_50px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          >
            {info}
          </Popover.Content>
        </Popover.Portal>
      )}
    </Popover.Root>
  );
}