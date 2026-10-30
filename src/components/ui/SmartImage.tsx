"use client";
//src\components\ui\SmartImage.tsx
import Image from "next/image";
import { useCallback, useState } from "react";
import { PLACEHOLDER_SRC, resolveImage } from "@/lib/imagekit";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types/site";

type Props = { asset: ImageAsset; fill?: boolean; priority?: boolean; sizes?: string; className?: string };

/** Local or ImageKit image with placeholder fallback, stable dimensions and a soft fade-in. */
export function SmartImage({ asset, fill, priority, sizes, className }: Props) {
  const { src, remote } = resolveImage(asset);
  // Keyed by src: a new src automatically clears the old failure/loaded state.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const failed = failedSrc === src;
  const shown = failed ? PLACEHOLDER_SRC : src;
  const fade = !priority; // never delay LCP images
  const loaded = !fade || loadedSrc === src || failed;

  // Catches images already complete before hydration (cached / SSR), where onLoad never fires.
  const ref = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete && img.naturalWidth > 0) setLoadedSrc(src);
    },
    [src],
  );

  const common = {
    ref,
    src: shown,
    priority,
    sizes,
    alt: asset.decorative ? "" : asset.alt,
    "aria-hidden": asset.decorative ? true : undefined,
    unoptimized: remote || failed,
    className: cn(fade && "transition-opacity duration-500 ease-out", !loaded && "opacity-0", className),
    style: asset.focal ? { objectPosition: asset.focal } : undefined,
    onLoad: () => setLoadedSrc(src),
    onError: () => setFailedSrc(src),
  };

  return fill ? <Image {...common} fill /> : <Image {...common} width={asset.width} height={asset.height} />;
}