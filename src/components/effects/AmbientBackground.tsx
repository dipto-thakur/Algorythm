"use client";
//src\components\effects\AmbientBackground.tsx
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";

const ScrollScene = dynamic(() => import("./ScrollScene"), { ssr: false });

/** Swallows WebGL/Three crashes so the starfield can never break the page. */
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function canRunScene(): boolean {
  if (!siteConfig.features.scene) return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) < 4 || (nav.hardwareConcurrency ?? 8) < 4) return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Lightweight starfield over the hero. Skipped on small screens, reduced motion, low-end devices, or when disabled. */
export function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  // Capability + media query gate.
  useEffect(() => {
    if (!canRunScene()) return;
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

  // Defer Three.js mount until the browser is idle, so it never competes with LCP/hydration.
  useEffect(() => {
    if (!enabled) {
      setReady(false);
      return;
    }
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 1500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setReady(true), 400);
    return () => window.clearTimeout(id);
  }, [enabled]);

  // Pause when hero is off-screen (with a small lead so it resumes before it's seen).
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(([e]) => setInView(e?.isIntersecting ?? false), {
      rootMargin: "120px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  // Pause when the tab is backgrounded.
  useEffect(() => {
    if (!enabled) return;
    const onVis = () => setTabVisible(!document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [enabled]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    >
      {enabled && ready && (
        <SceneBoundary>
          <ScrollScene active={inView && tabVisible} />
        </SceneBoundary>
      )}
    </div>
  );
}