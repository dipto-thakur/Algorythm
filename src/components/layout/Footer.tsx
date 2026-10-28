import { ArrowUp, ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteAssets, siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { telHref, waHref } from "@/lib/contact";
import { FooterCta } from "./FooterCta";

const { college, event, contact, footer } = siteConfig;
const nav = siteConfig.navigation.filter((i): i is { label: string; href: string } => i.href !== null);
const hasContact = !!(contact.phone || contact.whatsapp);

const heading = "text-xs font-medium uppercase tracking-[0.14em] text-white/60";
const link = "inline-flex min-h-11 items-center text-sm font-medium text-white/75 transition-colors hover:text-white";
const tile =
  "group flex min-h-14 items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-2 transition-colors hover:bg-white/[0.12] focus-visible:bg-white/[0.12]";

function ContactTile({ href, icon, label, value, tone, external }: {
  href: string; icon: React.ReactNode; label: string; value: string; tone: string; external?: boolean;
}) {
  return (
    <a href={href} {...(external && { target: "_blank", rel: "noopener noreferrer" })} className={tile}>
      <span aria-hidden className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs text-white/60">{label}</span>
        <span className="block truncate font-sans text-base font-bold">{value}</span>
      </span>
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-dashed border-line px-3 pb-6 pt-10 sm:px-6 lg:px-[84px]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(48,128,237,0.14),transparent_70%)]" />
      <Reveal className="relative mx-auto max-w-[90rem]">
        <div className="p-7">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
            {/* Brand */}
            <div className="flex flex-col gap-4 lg:basis-[34%]">
              <SmartImage asset={siteAssets.collegeLogo} className="h-12 w-auto self-start" />
              {college.name && <p className="font-sans text-xl font-bold leading-tight sm:text-2xl">{college.name}</p>}
              <p className="text-sm leading-6 text-white/75">
                <span className="font-bold text-white">{siteConfig.name}</span>
                <br />
                {event.dateLabel}
                {event.dateStatus === "tentative" && <span className="text-orange"> · tentative</span>}
              </p>
              <FooterCta />
            </div>

            {/* Explore */}
            {nav.length > 0 && (
              <nav aria-label="Footer" className="lg:flex-1">
                <h2 className={heading}>[Explore]</h2>
                <ul className="mt-3">
                  {nav.map((i) => (
                    <li key={i.label}>
                      <a href={i.href} className={link}>{i.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

{/* Helpline */}
{hasContact && (
  <section aria-labelledby="footer-helpline" className="min-w-0 lg:flex-[1.2]">
    <h2 id="footer-helpline" className={heading}>
      [Helpline]
    </h2>

    <div className="mt-4 flex flex-col gap-2">
      {contact.phone && (
        <ContactTile
          href={telHref(contact.phone)}
          icon={<Phone aria-hidden="true" className="size-4 text-blue" />}
          tone="bg-blue/10"
          label="Call us"
          value={contact.phone}
        />
      )}

      {contact.whatsapp && (
        <ContactTile
          href={waHref(contact.whatsapp, contact.whatsappMessage)}
          icon={<MessageCircle aria-hidden="true" className="size-4 text-green" />}
          tone="bg-green/10"
          label="WhatsApp"
          value={contact.whatsapp}
          external
        />
      )}
    </div>

    {contact.hours && (
      <p className="mt-3 text-xs leading-relaxed text-white/50 sm:text-sm">
        {contact.hours}
      </p>
    )}
  </section>
)}

            {/* Location */}
            <section aria-labelledby="footer-location" className="lg:flex-[1.2]">
              <h2 id="footer-location" className={heading}>[Location]</h2>
              <address className="mt-3 flex gap-3 not-italic">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-orange" />
                <div>
                  <p className="font-sans text-base font-bold">{event.venue}</p>
                  {college.address && <p className="mt-1 text-sm leading-6 text-white/75">{college.address}</p>}
                  {event.venueMapUrl && (
                    <a
                      href={event.venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-orange hover:decoration-orange"
                    >
                      Open in Google Maps
                      <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </address>
            </section>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col-reverse gap-4 pt-6 text-sm text-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:flex-row sm:items-center sm:justify-between">
            <p>{footer.text ?? `© ${year} ${siteConfig.name}`}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {footer.legalLinks.map((l) => (
                <a key={l.href} href={l.href} className="inline-flex min-h-11 items-center transition-colors hover:text-white">
                  {l.label}
                </a>
              ))}
              <a href="#" aria-label="Back to top" className="grid size-11 place-items-center rounded-full bg-white/[0.08] text-white transition-colors hover:bg-white/[0.16]">
                <ArrowUp aria-hidden className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}