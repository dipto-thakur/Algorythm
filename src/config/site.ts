import { z } from "zod";
import type { Credit, ImageAsset, NavItem } from "@/types/site";

const emptyToUndefined = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

// Direct property access so Next.js can inline NEXT_PUBLIC_* values.
const env = z
  .object({
    registerUrl: z.url().optional(),
    siteUrl: z.url().optional(),
    imagekitEndpoint: z.url().optional(),
  })
  .parse({
    registerUrl: emptyToUndefined(process.env.NEXT_PUBLIC_REGISTER_URL),
    siteUrl: emptyToUndefined(process.env.NEXT_PUBLIC_SITE_URL),
    imagekitEndpoint: emptyToUndefined(process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT),
  });

export const siteConfig = {
  name: "ALGORYTHM",
  brand: "VC",
  tagline: "kya hai ALGORYTHM?",
  description:
    "ALGORYTHM demystifies hackathons, cohorts, and meetups, helping you navigate the world of tech & marketing events.",
college: {
  name: "VIVEKANANDA COLLEGE",    // e.g. "Your College Name"
  address: "THAKURPUKUR KOLKATA", // e.g. "Street, City, State"
},
contact: {
  phone: "+918583096581",    // display format, e.g. "+91 98765 43210"
  whatsapp: "+918583096581", // same format; digits are extracted for the link
  whatsappMessage: "Hi! I have a question about the event." as string | null,
  hours: null as string | null,    // e.g. "10 AM to 6 PM"
},
credits: {
  patrons: [{ name: "Dr. Bhaskar Mahanayak", subtext: "Principal, Vivekananda College" }] as Credit[],
  associations: [{ name: "Faculties, Alumini, Students", subtext: "Department of Computer Science" }] as Credit[],
},
event: {
  venue: "Aeronautical Auditorium", // update to the real venue
  venueMapUrl: null as string | null, // paste Google Maps share link
  dateLabel: "1st week of December",
  dateStatus: "tentative" as "confirmed" | "tentative",
  dateNote: "Exact date will be informed" as string | null,
  timeLabel: null as string | null,
  timeZone: null as string | null,
dateInfo: "Tentative for now. The exact date and time will be informed." as string | null,
venueInfo: null as string | null, // falls back to college.address
},
registration: {
  deadlineLabel: "20th November",
  deadlineISO: "2026-11-20T23:59:59+05:30",
  registeredCount: 3, // e.g. 128; null hides the corner badge
  info: "Registrations close on 20th November. Register before the countdown hits zero." as string | null,
},
schedule: {
  draftTitle: "Working on it",
  draftNote: "Date abhi tentative hai, toh schedule bhi. Final hote hi yahin aa jayega. Thoda sabr, phir full dhamaal.",
},
  siteUrl: env.siteUrl ?? null,
  cta: { label: "Register now", href: env.registerUrl ?? null },
  // Items with href: null are hidden (the design has a "team" link but no team section on the homepage).
  navigation: [
    { label: "about", href: "#about" },
    { label: "events", href: "#events" },
    { label: "team", href: null },
    { label: "schedule", href: "#schedule" },
    { label: "faq", href: "#faq" },
  ] satisfies NavItem[],
  social: [] as { label: string; href: string }[], // none supplied
  footer: { text: null as string | null, legalLinks: [] as { label: string; href: string }[] },
   imagekitEndpoint: env.imagekitEndpoint ?? null,
  features: { scene: true, reveal: true, eventPages: false },
} as const;

export const siteAssets = {
collegeLogo: { src: "/college-logo.png", alt: "College logo", width: 72, height: 72 },
  hero: {
    src: "/assets/hero.svg",
    alt: "Aurora over a mountain night sky with four silhouettes watching",
    width: 1440,
    height: 784,
    decorative: true,
    focal: "50% 60%",
  },
  about: {
    src: "/assets/about-artwork.png",
    alt: "Cluster of developer technology logos",
    width: 470,
    height: 410,
    decorative: true,
    
  },
} as const satisfies Record<string, ImageAsset>;
