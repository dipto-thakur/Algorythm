import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, MapPin, CalendarDays, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { events } from "@/data/events";
import { eventDetails } from "@/data/event-details";
import { driveLinks } from "@/lib/drive";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventRegisterCta } from "@/components/events/EventRegisterCta";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams() {
  return events.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const e = events.find((x) => x.slug === slug);
  if (!e) return {};
  return {
    title: `${e.name} | ${siteConfig.name}`,
    description: e.blurb,
    openGraph: { title: `${e.name} | ${siteConfig.name}`, description: e.blurb },
  };
}

function Block({
  label,
  title,
  color,
  children,
}: {
  label: string;
  title: string;
  color: "orange" | "blue" | "green";
  children: React.ReactNode;
}) {
  return (
    <Reveal className="mt-14">
      <SectionHeading label={label} title={title} color={color} align="left" />
      <div className="px-5 pt-6">{children}</div>
    </Reveal>
  );
}

export default async function EventPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const e = events.find((x) => x.slug === slug);
  if (!e) notFound();

  const d = eventDetails[slug] ?? {};
  const poster = d.poster ? driveLinks(d.poster) : null;
  const brochure = d.brochure ? driveLinks(d.brochure) : null;
  const { event } = siteConfig;
  const idx = events.findIndex((x) => x.slug === slug);
  const next = events.length > 1
    ? events[(idx + 1) % events.length]
    : undefined;

  const hasAny = Boolean(
    d.about?.length || poster || brochure || d.team || d.prizes?.length || d.rules?.length || d.contacts?.length,
  );

  return (
    <main id="main" className="page-rails pb-24 pt-28">
      <div className="rail-bounded">
        <Link
          href="/#events"
          className="inline-flex items-center gap-2 px-5 text-sm text-white/60 transition-colors hover:text-orange"
        >
          <ArrowLeft aria-hidden className="size-4" /> All events
        </Link>

        <Reveal className="mt-6">
          <SectionHeading label={e.kind} title={e.name} color="orange" align="left" />
          <div className="px-5 pt-6">
            <p className="max-w-2xl text-base leading-7 text-white/80">{d.tagline ?? e.blurb}</p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-dashed border-line p-4">
                <dt className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
                  <CalendarDays aria-hidden className="size-4" /> Date
                </dt>
                <dd className="mt-2 text-sm text-white/90">
                  {event.dateLabel}
                  {event.dateStatus === "tentative" && <span className="ml-2 text-orange">(tentative)</span>}
                  {event.timeLabel && <span className="block text-white/60">{event.timeLabel}</span>}
                  {event.dateNote && <span className="block text-white/60">{event.dateNote}</span>}
                </dd>
              </div>
              <div className="rounded-2xl border border-dashed border-line p-4">
                <dt className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted">
                  <MapPin aria-hidden className="size-4" /> Venue
                </dt>
                <dd className="mt-2 text-sm text-white/90">
                  {siteConfig.college.name}
                  <span className="block text-white/60">{event.venue}</span>
                  {event.venueMapUrl && (
                    <a
                      href={event.venueMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-blue hover:underline"
                    >
                      Open map <ExternalLink aria-hidden className="size-3.5" />
                    </a>
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <EventRegisterCta />
              <p className="text-sm text-white/60">
                Register by {siteConfig.registration.deadlineLabel}
              </p>
            </div>
          </div>
        </Reveal>

        {!hasAny && (
          <Reveal className="mt-14">
            <p className="mx-5 rounded-2xl border border-dashed border-line p-6 text-sm text-white/70">
              Full details for {e.name} are on the way. Check back soon.
            </p>
          </Reveal>
        )}

        {(d.about?.length || poster) && (
          <Block label="About" title={`What is ${e.name}?`} color="blue">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              {d.about?.length ? (
                <div className="space-y-4 text-sm leading-7 text-white/80">
                  {d.about.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : (
                <div />
              )}
              {poster && (
                <div className="overflow-hidden rounded-2xl border border-dashed border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={poster.image} alt={`${e.name} poster`} loading="lazy" className="h-auto w-full" />
                </div>
              )}
            </div>
          </Block>
        )}

        {brochure && (
          <Block label="Brochure" title="Everything in one PDF" color="orange">
            <div className="flex flex-wrap gap-3">
              <a
                href={brochure.view}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm text-white/90 transition-colors hover:border-orange hover:text-orange"
              >
                <ExternalLink aria-hidden className="size-4" /> Open
              </a>
              <a
                href={brochure.download}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm text-white/90 transition-colors hover:border-orange hover:text-orange"
              >
                <Download aria-hidden className="size-4" /> Download
              </a>
            </div>
            <iframe
              src={brochure.preview}
              title={`${e.name} brochure`}
              loading="lazy"
              className="mt-5 h-[70vh] w-full rounded-2xl border border-dashed border-line bg-black"
            />
          </Block>
        )}

        {d.team && (
          <Block label="Team" title="Team criteria" color="green">
            <div className="space-y-5 text-sm leading-7 text-white/80">
              {d.team.size && (
                <p>
                  <span className="text-muted">Team size: </span>
                  {d.team.size}
                </p>
              )}
              {d.team.eligibility?.length ? (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted">Eligibility</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-green">
                    {d.team.eligibility.map((x, i) => (
                      <li key={i}>{x}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {d.team.notes?.length ? (
                <ul className="list-disc space-y-1 pl-5 marker:text-green">
                  {d.team.notes.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Block>
        )}

        {d.prizes?.length ? (
          <Block label="Prizes" title="What you win" color="orange">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {d.prizes.map((p, i) => (
                <li key={i} className="rounded-2xl border border-dashed border-line p-4">
                  <p className="text-xs uppercase tracking-wide text-orange">{p.place}</p>
                  <p className="mt-2 text-sm text-white/90">{p.reward}</p>
                </li>
              ))}
            </ul>
          </Block>
        ) : null}

        {d.rules?.length ? (
          <Block label="Rules" title="Ground rules" color="blue">
            <ol className="space-y-3 text-sm leading-7 text-white/80">
              {d.rules.map((r, i) => (
                <li key={i} className="flex gap-4">
                  <span className="pt-0.5 font-medium text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </Block>
        ) : null}

        {d.contacts?.length ? (
          <Block label="Contact" title="Got doubts?" color="green">
            <ul className="grid gap-4 sm:grid-cols-2">
              {d.contacts.map((c, i) => (
                <li key={i} className="rounded-2xl border border-dashed border-line p-4">
                  <p className="font-sans text-lg font-bold">{c.name}</p>
                  {c.role && <p className="text-xs uppercase tracking-wide text-muted">{c.role}</p>}
                  {c.phone && (
                    <a
                      href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}
                      className="mt-3 inline-flex items-center gap-2 text-sm text-green hover:underline"
                    >
                      <Phone aria-hidden className="size-4" /> {c.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Block>
        ) : null}

{next && (
  <Reveal className="mt-16">
    <Link
      href={`/events/${next.slug}`}
      className="group flex items-center justify-between gap-4 border-y border-dashed border-line px-5 py-6 transition-colors hover:bg-white/[0.03]"
    >
      <span>
        <span className="block text-xs uppercase tracking-wide text-muted">
          Next event
        </span>
        <span className="mt-1 block font-sans text-xl font-bold transition-colors group-hover:text-orange">
          {next.name}
        </span>
      </span>
      <ExternalLink
        aria-hidden="true"
        className="size-5 text-white/50 transition-colors group-hover:text-orange"
      />
    </Link>
  </Reveal>
)}
      </div>
    </main>
  );
}