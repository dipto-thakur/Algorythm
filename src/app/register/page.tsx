import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, MessageCircle, Phone, Timer } from "lucide-react";
import Link from "next/link";
import { RegistrationForm } from "@/components/register/RegistrationForm";
import { SmartImage } from "@/components/ui/SmartImage";
import { siteAssets, siteConfig } from "@/config/site";
import { telHref, waHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: `Register | ${siteConfig.name}`,
  description: `Register for ${siteConfig.name}. Pick one or more events.`,
};

const { contact, college, event, registration } = siteConfig;

const glass =
  "bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/[0.08]";
const action =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-white/[0.08] px-4 text-sm font-bold transition-colors hover:bg-white/[0.16]";

export default function RegisterPage() {
  return (
    <>
      {/* Hero artwork as a fixed backdrop for the whole page. Layers keep the glass panels readable. */}
      <div aria-hidden className="fixed inset-0 z-10 overflow-hidden bg-background">
        <SmartImage asset={siteAssets.hero} fill priority sizes="100vw" className="scale-105 object-cover" />
        <div className="absolute inset-0 bg-[rgba(37,177,255,0.88)] mix-blend-soft-light" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent,rgba(0,0,0,0.5))]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <main id="main" className="relative z-10 mx-auto min-h-svh max-w-4xl px-3 pb-16 pt-24 sm:pt-28 sm:px-6 ">


        <section className="pb-8 pt-10 sm:pt-14">
          <h1 className="bg-gradient-to-b from-white via-white to-white/55 bg-clip-text font-display text-[clamp(3rem,11vw,6rem)] leading-none text-transparent drop-shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
            Register
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
            {siteConfig.name}
            {college.name ? `, ${college.name}` : ""}. Fill in your details once, then add details for each event you pick.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
            <li className={`flex items-center gap-2 rounded-full px-3.5 py-2 ${glass}`}>
              <Timer aria-hidden className="size-3.5 text-orange" />
              Closes {registration.deadlineLabel}
            </li>
            <li className={`flex items-center gap-2 rounded-full px-3.5 py-2 ${glass}`}>
              <CalendarDays aria-hidden className="size-3.5 text-blue" />
              {event.dateLabel}
              {event.dateStatus === "tentative" && <span className="text-orange">tentative</span>}
            </li>
          </ul>
        </section>

        <RegistrationForm />

        {(contact.phone || contact.whatsapp) && (
          <section aria-label="Need help?" className={`mt-12 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${glass}`}>
            <p className="px-1 text-sm font-bold">Stuck or something not working?</p>
            <div className="flex flex-wrap gap-2">
              {contact.phone && (
                <a href={telHref(contact.phone)} className={action}>
                  <Phone aria-hidden className="size-4 text-blue" /> {contact.phone}
                </a>
              )}
              {contact.whatsapp && (
                <a href={waHref(contact.whatsapp, contact.whatsappMessage)} target="_blank" rel="noopener noreferrer" className={action}>
                  <MessageCircle aria-hidden className="size-4 text-green" /> WhatsApp
                </a>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}