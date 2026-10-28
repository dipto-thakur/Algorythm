"use client";

import Image from "next/image";
import { useState } from "react";
import { PLACEHOLDER_SRC, resolveImage } from "@/lib/imagekit";
import type { ImageAsset } from "@/types/site";

type Props = { asset: ImageAsset; fill?: boolean; priority?: boolean; sizes?: string; className?: string };

/** Local or ImageKit image with a placeholder fallback and stable dimensions. */
export function SmartImage({ asset, fill, priority, sizes, className }: Props) {
  const [failed, setFailed] = useState(false);
  const { src, remote } = resolveImage(asset);
  const alt = asset.decorative ? "" : asset.alt;
  const common = {
    src: failed ? PLACEHOLDER_SRC : src,
    priority,
    sizes,
    className,
    unoptimized: remote || failed,
    style: asset.focal ? { objectPosition: asset.focal } : undefined,
    onError: () => setFailed(true),
  };
  return fill ? <Image {...common} alt={alt} fill /> : <Image {...common} alt={alt} width={asset.width} height={asset.height} />;
}
