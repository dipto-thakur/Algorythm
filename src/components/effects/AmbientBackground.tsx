"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";

const ScrollScene = dynamic(() => import("./ScrollScene"), { ssr: false });

/** Lightweight starfield over the hero. Skipped on small screens, reduced motion, or when disabled. */
export function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!siteConfig.features.scene) return;
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 768px)");
    const update = () => setEnabled(!rm.matches && wide.matches);
    update();
    rm.addEventListener("change", update);
    wide.addEventListener("change", update);
    return () => {
      rm.removeEventListener("change", update);
      wide.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(([e]) => setVisible(e?.isIntersecting ?? false));
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0">
      {enabled && <ScrollScene active={visible} />}
    </div>
  );
}
