"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";

const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
};

/** null on server + hydration, then ticks every second. Hydration-safe. */
export const useNow = () =>
  useSyncExternalStore<number | null>(subscribe, () => Math.floor(Date.now() / 1000) * 1000, () => null);

export function useRegistrationClosed() {
  const now = useNow();
  return now !== null && now >= new Date(siteConfig.registration.deadlineISO).getTime();
}