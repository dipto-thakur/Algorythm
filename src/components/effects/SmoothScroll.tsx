"use client";
//src\components\effects\SmoothScroll.tsx
import Lenis from "lenis";
import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    const start = () => {
      if (lenis || rm.matches) return;
      lenis = new Lenis({
        autoRaf: true, // one shared rAF, pauses with hidden tab
        lerp: 0.12, // higher = snappier, less main-thread work
        smoothWheel: true, // wheel only
        syncTouch: false, // touch stays native, free + best on mobile
        anchors: { offset: -80 }, // matches scroll-padding-top: 5rem
      });
    };
    const stop = () => {
      lenis?.destroy();
      lenis = null;
    };
    const onChange = () => (rm.matches ? stop() : start());

    start();
    rm.addEventListener("change", onChange);
    return () => {
      rm.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return null;
}