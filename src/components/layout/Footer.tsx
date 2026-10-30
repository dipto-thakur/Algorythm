//src\components\layout\Footer.tsx
import { ArrowUp, ArrowUpRight, Github, Heart, Linkedin, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteAssets, siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { telHref, waHref } from "@/lib/contact";
import { FooterCta } from "./FooterCta";

const { college, event, contact, footer, maker } = siteConfig;
const nav = siteConfig.navigation.filter((i): i is { label: string; href: string } => i.href !== null);
const hasContact = !!(contact.phone || contact.whatsapp);

const social = {
  github: { label: "GitHub", Icon: Github },
  linkedin: { label: "LinkedIn", Icon: Linkedin },
} as const;

const heading = "text-xs font-medium uppercase tracking-[0.14em] text-white/60";
const link =
  "inline-flex min-h-11 items-center text-sm font-medium text-white/75 transition-colors hover:text-white focus-visible:text-white";
const tile =
  "group flex min-h-14 items-center gap-3 rounded-2xl bg-white/[0.06] px-4 py-2 transition-colors hover:bg-white/[0.12] focus-visible:bg-white/[0.12]";

  function ContactTile({
    href,
    icon,
    label,
    value,
    external,
  }: {
    href: string;
    icon: React.ReactNode;
    label: string;
    value: string;
    external?: boolean;
  }) {
    return (
      <a
        href={href}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        className="group flex min-w-0 items-center gap-3 py-2.5 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/[0.06] text-white/70 transition-colors group-hover:bg-white/10">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] tracking-wide text-white/45">
            {label}
          </span>
          <span className="block truncate text-sm font-medium text-white/90">
            {value}
          </span>
        </span>
      </a>
    );
  }

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-dashed border-line px-3 pb-6 pt-10 sm:px-6 lg:px-[84px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(48,128,237,0.14),transparent_70%)]"
      />
      <Reveal className="relative mx-auto max-w-[90rem]">
        <div className="p-4 sm:p-7">
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-6 lg:grid-cols-12 lg:gap-x-10">
            {/* Brand */}
            <div className="flex flex-col gap-4 md:col-span-6 lg:col-span-4">
              <SmartImage asset={siteAssets.collegeLogo} className="h-12 w-auto self-start" />
              {college.name &&
                (college.site ? (
                  <a
                    href={college.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${college.name} website (opens in new tab)`}
                    className="group inline-flex items-start gap-1.5 self-start font-sans text-xl font-bold leading-tight transition-colors hover:text-orange focus-visible:text-orange sm:text-2xl"
                  >
                    {college.name}
                    <ArrowUpRight
                      aria-hidden
                      className="mt-1 size-4 shrink-0 text-white/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-orange"
                    />
                  </a>
                ) : (
                  <p className="font-sans text-xl font-bold leading-tight sm:text-2xl">{college.name}</p>
                ))}
              <p className="text-sm leading-6 text-white/75">
                <span className="font-bold text-white">{siteConfig.name}</span>
                <br />
                {event.dateLabel}
                {event.dateStatus === "tentative" && <span className="text-orange"> · tentative</span>}
              </p>
              <div className="mt-1 max-w-sm">
                <FooterCta />
              </div>
            </div>

            {/* Explore */}
            {nav.length > 0 && (
              <nav aria-label="Footer" className="md:col-span-2 lg:col-span-2">
                <h2 className={heading}>[Explore]</h2>
                <ul className="mt-3 grid grid-cols-2 gap-x-4 md:grid-cols-1">
                  {nav.map((i) => (
                    <li key={i.label}>
                      <a href={i.href} className={link}>
                        {i.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

{/* Helpline */}
{hasContact && (
  <section
    aria-labelledby="footer-helpline"
    className="min-w-0 md:col-span-2 lg:col-span-3"
  >
    <h2 id="footer-helpline" className={heading}>
      HELPLINE
    </h2>

    <div className="mt-3 divide-y divide-white/[0.08]">
      {contact.phone && (
        <ContactTile
          href={telHref(contact.phone)}
          icon={<Phone className="size-4" />}
          label="Phone"
          value={contact.phone}
        />
      )}

      {contact.whatsapp && (
        <ContactTile
          href={waHref(contact.whatsapp, contact.whatsappMessage)}
          icon={<MessageCircle className="size-4" />}
          label="WhatsApp"
          value={contact.whatsapp}
          external
        />
      )}
    </div>

    {contact.hours && (
      <p className="mt-3 text-xs text-white/40">
        {contact.hours}
      </p>
    )}
  </section>
)}

            {/* Location */}
            <section aria-labelledby="footer-location" className="min-w-0 md:col-span-2 lg:col-span-3">
              <h2 id="footer-location" className={heading}>
                [Location]
              </h2>
              <address className="mt-3 flex gap-3 not-italic">
                <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-orange" />
                <div className="min-w-0">
                  <p className="font-sans text-base font-bold leading-snug">{event.venue}</p>
                  {college.address && <p className="mt-1 text-sm leading-6 text-white/75">{college.address}</p>}
                  {event.venueMapUrl && (
                    <a
                      href={event.venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-1 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:text-orange hover:decoration-orange focus-visible:text-orange"
                    >
                      Open in Google Maps
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  )}
                </div>
              </address>
            </section>
          </div>


{/* Bottom bar */}
<div className="mt-10 border-t border-white/[0.08] pt-6 text-white/60 sm:mt-12">
  <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
    <div className="flex flex-wrap items-center justify-center gap-x-3 sm:justify-start">
      <p className="inline-flex items-center gap-1.5 text-xs text-white/40">
        Made with
        <Heart
          aria-label="love"
          role="img"
          className="size-3.5 fill-orange text-orange"
        />
        by <span className="text-white/60">{maker.name}</span>
      </p>

      {maker.links.length > 0 && (
        <>
          <span aria-hidden="true" className="h-3 w-px bg-white/15" />
          <ul className="flex items-center">
            {maker.links.map(({ platform, href }) => {
              const { label, Icon } = social[platform];

              return (
                <li key={platform}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (opens in new tab)`}
                    className="grid size-9 place-items-center rounded-full transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
                  >
                    <Icon aria-hidden="true" className="size-4" />
                  </a>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>

    <a
      href="#top"
      aria-label="Back to top"
      className="grid size-11 shrink-0 place-items-center rounded-full bg-white/[0.08] text-white transition-colors hover:bg-white/[0.16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange"
    >
      <ArrowUp aria-hidden="true" className="size-4" />
    </a>
  </div>
</div>

        </div>
      </Reveal>
    </footer>
  );
}