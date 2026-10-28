# ALGORYTHM landing page

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind v4 · Radix · Framer Motion · R3F.

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

## Edit points
- `src/config/site.ts`: event info, nav, CTA, footer, feature flags, **image map** (`siteAssets`)
- `src/data/schedule.ts`, `src/data/faq.ts`: repeated content (FAQ answers are `null` placeholders)
- `src/app/globals.css`: color + font tokens (Tailwind v4 `@theme`), rails/grid CSS
- `NEXT_PUBLIC_REGISTER_URL`: enables "Register now" (disabled without it)

## ImageKit
Set `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`, then add `imagekitPath: "folder/file.jpg"` to an entry in `siteAssets`. Nothing else changes. Missing/failed images fall back to `public/assets/placeholders/image-placeholder.svg`.

## Notes / deviations
- Grid system used minimally: vertical rails + dividers below the hero only.
- Gray `#6B6B6B` (3.8:1) lightened to `#9B9B9B` for AA. Mobile text floor 14px.
- NeueBit is not freely installable → Pixelify Sans fallback. Add `next/font/local` if you have the file.
- `about-artwork.png` and `logo.png` are crops of `Desktop - Homepage.png` (no standalone exports). Replace with real exports.
- "team" nav link hidden: no team section in the homepage design (`href: null` in config).
- Timeline is live HTML text, not the exported SVGs. Mobile uses a single left-aligned line.
- Three.js: starfield over the hero only; off on <768px, reduced motion, or `features.scene = false`.
- Verified: `tsc`, `eslint`, `next build` (fonts stubbed; sandbox blocks Google Fonts). No browser/screenshot test run.
