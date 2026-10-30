//src\app\register\page.tsx
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, CalendarDays, MessageCircle, Phone, Timer } from "lucide-react";
import Link from "next/link";
import { RegistrationForm } from "@/components/register/RegistrationForm";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { siteAssets, siteConfig } from "@/config/site";
import { telHref, waHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: `Register | ${siteConfig.name}`,
  description: `Register for ${siteConfig.name}. Pick one or more events.`,
};

const { contact, college, event, registration } = siteConfig;

const glass =
  "bg-black/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_30px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl backdrop-saturate-150 sm:backdrop-blur-2xl supports-[backdrop-filter]:bg-white/[0.08]";
const action =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-white/[0.08] px-4 text-sm font-bold transition-colors hover:bg-white/[0.16] focus-visible:bg-white/[0.16]";
const chip = `flex items-center gap-2 rounded-full px-3.5 py-2 ${glass}`;

export default function RegisterPage() {
  return (
    <>
      {/* Hero artwork as a fixed backdrop for the whole page. Layers keep the glass panels readable. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-10 overflow-hidden bg-background">
        <SmartImage asset={siteAssets.hero} fill priority sizes="100vw" className="scale-105 object-cover" />
        <div className="absolute inset-0 bg-[rgba(37,177,255,0.88)] mix-blend-soft-light" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent,rgba(0,0,0,0.5))]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <main id="main" className="relative z-10 mx-auto min-h-svh max-w-4xl px-3 pb-16 pt-24 sm:px-6 sm:pt-28">
        <Reveal>
          <Link
            href="/#events"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full pr-3 text-sm font-medium text-white/70 transition-colors hover:text-white focus-visible:text-white"
          >
            <span
              aria-hidden
              className="grid size-8 place-items-center rounded-full bg-white/[0.08] transition-colors group-hover:bg-white/[0.16]"
            >
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            </span>
            Back to events
          </Link>
        </Reveal>

        <section aria-labelledby="register-title" className="pb-8 pt-6 sm:pt-10">
          <Reveal>
            <h1
              id="register-title"
              className="bg-gradient-to-b from-white via-white to-white/55 bg-clip-text font-display text-[clamp(3rem,11vw,6rem)] leading-none text-transparent drop-shadow-[0_8px_40px_rgba(0,0,0,0.45)]"
            >
              Register
            </h1>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-white/80 sm:text-base">
              {siteConfig.name}
              {college.name ? `, ${college.name}` : ""}. Fill in your details once, then add details for each event you
              pick.{" "}
              <Link
                href="/#events"
                className="whitespace-nowrap font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-orange hover:decoration-orange focus-visible:text-orange"
              >
                Not sure which? Check events
              </Link>
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
              <li className={chip}>
                <Timer aria-hidden className="size-3.5 text-orange" />
                Closes {registration.deadlineLabel}
              </li>
              <li>
                <Link
                  href="/#events"
                  className={`${chip} group transition-colors hover:bg-white/[0.16] focus-visible:bg-white/[0.16]`}
                >
                  Event details
                  <ArrowUpRight
                    aria-hidden
                    className="size-3.5 text-white/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            </ul>
          </Reveal>
        </section>

        <RegistrationForm />

        {(contact.phone || contact.whatsapp) && (
          <Reveal className="mt-12">
            <section
              aria-label="Need help?"
              className={`flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${glass}`}
            >
              <p className="px-1 text-sm font-bold">Stuck or something not working?</p>
              <div className="flex flex-wrap gap-2">
                {contact.phone && (
                  <a href={telHref(contact.phone)} className={action}>
                    <Phone aria-hidden className="size-4 text-blue" /> {contact.phone}
                  </a>
                )}
                {contact.whatsapp && (
                  <a
                    href={waHref(contact.whatsapp, contact.whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={action}
                  >
                    <MessageCircle aria-hidden className="size-4 text-green" /> WhatsApp
                  </a>
                )}
              </div>
            </section>
          </Reveal>
        )}
      </main>
    </>
  );
}