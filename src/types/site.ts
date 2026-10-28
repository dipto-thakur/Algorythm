export type ImageAsset = {
  /** Local fallback / placeholder path under /public. */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Decorative images render with empty alt. */
  decorative?: boolean;
  /** CSS object-position, e.g. "50% 20%". */
  focal?: string;
  /** Path inside your ImageKit library. When set (and endpoint configured) it replaces `src`. */
  imagekitPath?: string;
};

export type NavItem = { label: string; href: string | null };
export type ScheduleItem = { time: string; title: string };
export type FaqItem = { id: string; question: string; answer: string | null };
export type EventItem = { slug: string; name: string; kind: string; blurb: string };
export type Credit = { name: string; subtext: string };