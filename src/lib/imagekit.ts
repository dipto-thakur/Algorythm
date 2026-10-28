import type { ImageAsset } from "@/types/site";

export const PLACEHOLDER_SRC = "/assets/placeholders/image-placeholder.svg";

const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT?.trim().replace(/\/+$/, "") || null;

/**
 * Resolve an asset to a URL. Uses ImageKit only when both the endpoint and
 * `imagekitPath` exist; otherwise the local `src`. ImageKit URLs are served
 * as-is (unoptimized in next/image) so they are never transformed twice.
 */
export function resolveImage(asset: ImageAsset, opts: { width?: number; quality?: number } = {}) {
  if (endpoint && asset.imagekitPath) {
    const path = asset.imagekitPath.replace(/^\/+/, "");
    const hasTransform = path.includes("tr=") || path.includes("/tr:");
    const tr = `w-${opts.width ?? asset.width},q-${opts.quality ?? 80},f-auto`;
    return { src: `${endpoint}/${path}${hasTransform ? "" : `?tr=${tr}`}`, remote: true };
  }
  return { src: asset.src, remote: false };
}
