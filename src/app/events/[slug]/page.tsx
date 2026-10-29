import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { events } from "@/data/events";
import { eventDetails } from "@/data/event-details";
import { driveLinks } from "@/lib/drive";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventRegisterCta } from "@/components/events/EventRegisterCta";
import { ArrowLeft, ArrowRight, CalendarDays, Download, ExternalLink, FileText, Image as ImageIcon, MapPin, Phone, Timer } from "lucide-react";
import { telHref } from "@/lib/contact";
import { cn } from "@/lib/utils";


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

const label = "flex items-center gap-2 text-xs uppercase tracking-wide text-muted";
const btn =
  "inline-flex min-h-11 items-center gap-2 border border-dashed border-line px-4 text-sm text-white/90 transition-colors hover:border-orange hover:text-orange";
const cell = "border-r border-b border-dashed border-line p-5";

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
        <Link href="/#events" className="inline-flex min-h-11 items-center gap-2 px-5 text-sm text-white/60 transition-colors hover:text-orange">
          <ArrowLeft aria-hidden className="size-4" /> All events
        </Link>

        <Reveal className="mt-4">
          <SectionHeading label={e.kind} title={e.name} color="orange" align="left" />
          <p className="max-w-2xl px-5 pt-6 text-base leading-7 text-white/80">{d.tagline ?? e.blurb}</p>
        </Reveal>

        {!hasAny && (
          <Reveal className="mt-14">
            <p className="mx-5 border border-dashed border-line p-6 text-sm text-white/70">Full details for {e.name} are on the way. Check back soon.</p>
          </Reveal>
        )}

        {d.about?.length ? (
          <Block label="About" title={`What is ${e.name}?`} color="blue">
            <div className="w-auto space-y-4 text-sm leading-7 text-white/80">
              {d.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Block>
        ) : null}

        {(poster || brochure) && (
          <Block label="Resources" title="Poster & brochure" color="orange">
            <ul className="divide-y divide-dashed divide-line ">
              {poster && (
                <li className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <span className="flex items-center gap-3 text-sm text-white/90">
                    <ImageIcon aria-hidden className="size-4 text-orange" /> {e.name} poster
                  </span>
                  <span className="flex gap-2">
                    <a href={poster.image} target="_blank" rel="noopener noreferrer" className={btn}>
                      <ExternalLink aria-hidden className="size-4" /> Open
                    </a>
                    <a href={poster.image} download className={btn}>
                      <Download aria-hidden className="size-4" /> Download
                    </a>
                  </span>
                </li>
              )}
              {brochure && (
                <li className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <span className="flex items-center gap-3 text-sm text-white/90">
                    <FileText aria-hidden className="size-4 text-orange" /> {e.name} brochure (PDF)
                  </span>
                  <span className="flex gap-2">
                    <a href={brochure.view} target="_blank" rel="noopener noreferrer" className={btn}>
                      <ExternalLink aria-hidden className="size-4" /> Open
                    </a>
                    <a href={brochure.download} className={btn}>
                      <Download aria-hidden className="size-4" /> Download
                    </a>
                  </span>
                </li>
              )}
            </ul>
          </Block>
        )}

        {d.team && (
          <Block label="Team" title="Team criteria" color="green">
            <div className="w-auto text-sm leading-7 text-white/80">
              {d.team.size && (
                <p className="flex gap-3 py-4">
                  <span className="w-28 shrink-0 text-muted">Team size</span>
                  <span className="font-bold text-white">{d.team.size}</span>
                </p>
              )}
              {d.team.eligibility?.length ? (
                <div className="py-4">
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
            <ul className="grid border-l border-t border-dashed border-line sm:grid-cols-2 lg:grid-cols-3">
              {d.prizes.map((p, i) => (
                <li key={i} className={cell}>
                  <p className="text-xs uppercase tracking-wide text-orange">{p.place}</p>
                  <p className="mt-2 font-sans text-lg font-bold text-white/90">{p.reward}</p>
                </li>
              ))}
            </ul>
          </Block>
        ) : null}

        {d.rules?.length ? (
          <Block label="Rules" title="Ground rules" color="blue">
            <ol className="">
              {d.rules.map((r, i) => (
                <li key={i} className="flex gap-4 py-4 text-sm  text-white/80">
                  <span className="w-6 shrink-0 pt-0.5 font-medium tabular-nums text-blue">{String(i + 1).padStart(2, "0")}</span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </Block>
        ) : null}

        {d.contacts?.length ? (
          <Block label="Contact" title="Got doubts?" color="green">
            <ul className="grid sm:grid-cols-2">
              {d.contacts.map((c, i) => (
                <li key={i} className={cell}>
                  <p className="font-sans text-lg font-bold">{c.name}</p>
                  {c.role && <p className="text-xs uppercase tracking-wide text-muted">{c.role}</p>}
                  {c.phone && (
                    <a href={telHref(c.phone)} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-green hover:underline">
                      <Phone aria-hidden className="size-4" /> {c.phone}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Block>
        ) : null}

        {/* Register: after the details, so readers can act once they're convinced */}
        <Reveal className="mt-16">
          <section
            aria-labelledby="join-title"
            className="flex flex-col gap-6 border-y border-dashed border-line px-5 py-8 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">[Join in]</p>
              <h2 id="join-title" className="mt-2 font-sans text-2xl font-bold sm:text-3xl">
                Ready for {e.name}?
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Registration closes {siteConfig.registration.deadlineLabel}.
                {event.dateStatus === "tentative" && " Event date is tentative and will be informed."}
              </p>
            </div>
            <div className="sm:min-w-[15rem]">
              <EventRegisterCta />
            </div>
          </section>
        </Reveal>

        {next && (
          <Reveal>
            <Link
              href={`/events/${next.slug}`}
              className="group flex min-h-16 items-center justify-between gap-4 border-b border-dashed border-line px-5 py-6 transition-colors hover:bg-white/[0.03]"
            >
              <span>
                <span className="block text-xs uppercase tracking-wide text-muted">Next event</span>
                <span className="mt-1 block font-sans text-xl font-bold transition-colors group-hover:text-orange">{next.name}</span>
              </span>
              <ArrowRight aria-hidden className="size-5 text-white/50 transition-all group-hover:translate-x-1 group-hover:text-orange" />
            </Link>
          </Reveal>
        )}
      </div>
    </main>
  );
}