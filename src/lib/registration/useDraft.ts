"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TTL = 7 * 24 * 60 * 60 * 1000;

/** Hydration-safe localStorage draft: server and first client render use `initial`, then the saved draft loads. */
export function useDraft<T extends object>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const initialRef = useRef(initial);
  const cleared = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const { at, data } = JSON.parse(raw) as { at: number; data: Partial<T> };
          if (Date.now() - at < TTL) setState({ ...initialRef.current, ...data });
        }
      } catch {
        /* storage blocked or corrupt: start fresh */
      }
      setReady(true);
    }, 0);
    return () => clearTimeout(t);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => {
      if (cleared.current) return;
      try {
        localStorage.setItem(key, JSON.stringify({ at: Date.now(), data: state }));
      } catch {
        /* quota or private mode: ignore */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [key, state, ready]);

  const clear = useCallback(() => {
    cleared.current = true;
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }, [key]);

  return { state, setState, ready, clear };
}