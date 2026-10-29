import type { Metadata } from "next";
import QRCode from "qrcode";
import { SmartImage } from "@/components/ui/SmartImage";
import { siteAssets, siteConfig } from "@/config/site";
import { events } from "@/data/events";
import { BadgeCheck } from "lucide-react";

export const metadata: Metadata = {
    title: `Poster | ${siteConfig.name}`,
    robots: { index: false, follow: false },
};

const { college, event, registration, cta, subtext } = siteConfig;

/** QR target: the main page. Needs NEXT_PUBLIC_SITE_URL. */
function qrUrl(): string | null {
    return siteConfig.siteUrl ? new URL("/", siteConfig.siteUrl).toString() : null;
}

const fact = "py-[1.1cqw]";
const factLabel = "text-[1.6cqw] uppercase tracking-[0.14em] text-white/60";
const factValue = "mt-[0.4cqw] font-sans text-[2.7cqw] font-bold leading-tight";

export default async function PosterPage({ searchParams }: { searchParams: Promise<{ w?: string }> }) {
    // Optional exact export width: /poster?w=1080 gives a 1080 x 1350 poster.
    const w = Number((await searchParams).w);
    const fixedWidth = Number.isFinite(w) && w >= 320 && w <= 2160 ? Math.round(w) : null;

    const url = qrUrl();
    const qr = url
        ? await QRCode.toString(url, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark: "#080808", light: "#ffffff" } })
        : null;
    const host = url ? new URL(url).host + new URL(url).pathname.replace(/\/$/, "") : null;

    return (
        <main className="grid min-h-svh place-items-center bg-[#050505] p-3 sm:p-6">
            <article
                aria-label={`${siteConfig.name} poster`}
                style={fixedWidth ? { width: fixedWidth } : undefined}
                className="@container relative aspect-[4/5] w-[min(100%,calc((100svh-3rem)*0.8))] overflow-hidden bg-background"
            >
                {/* background: same layers as the hero */}
                <SmartImage asset={siteAssets.hero} fill priority sizes="100vw" className="object-cover" />
                <div aria-hidden className="absolute inset-0 bg-[rgba(37,177,255,0.88)] mix-blend-soft-light" />
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_36%_at_50%_30%,rgba(0,0,0,0.5),transparent)]" />
                <div aria-hidden className="absolute inset-x-0 top-0 h-[28%] bg-gradient-to-b from-black/70 via-black/35 to-transparent" />

                <div className="relative z-10 flex h-full flex-col justify-between p-[6cqw]">
                    {/* header */}
                    <header className="flex items-center justify-between gap-[3cqw]">
                        <div className="flex min-w-0 items-center gap-[2cqw] rounded-[2.4cqw] bg-black/40 p-[1.2cqw] pr-[2.6cqw] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/[0.1]">
                            <span className="h-[7cqw] shrink-0 rounded-[1.4cqw] bg-white p-[0.7cqw]">
                                <SmartImage asset={siteAssets.collegeLogo} priority className="h-full w-auto" />
                            </span>
                            {college.name && (
                                <div className="min-w-0 leading-tight [text-shadow:0_0.2cqw_1cqw_rgba(0,0,0,0.6)]">
                                    <p className="truncate font-sans text-[2.5cqw] font-bold text-white">{college.name}</p>
                                    {college.address && (
                                        <p className="mt-[0.3cqw] truncate text-[1.7cqw] text-white/85">{college.address}</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="shrink-0 text-[1.8cqw] uppercase tracking-[0.14em] text-white/65">
                            [{String(events.length).padStart(2, "0")} events]
                        </p>
                    </header>

                    {/* title */}
                    <div className="text-center">
                        <h1 className="bg-gradient-to-b from-white via-white to-white/55 bg-clip-text font-display text-[17cqw] leading-none tracking-wide text-transparent drop-shadow-[0_1cqw_4cqw_rgba(0,0,0,0.45)]">
                            {siteConfig.name}
                        </h1>
                        {subtext && (
                            <p className="mx-auto mt-[2.4cqw] max-w-[168cqw] text-balance text-[2cqw] leading-[1.55] text-white/85 drop-shadow-[0_0.2cqw_1.6cqw_rgba(0,0,0,0.6)]">
                                {subtext}
                            </p>
                        )}
                    </div>

                    {/* events */}
                    <ol className="grid border-y border-dashed border-white/30" style={{ gridTemplateColumns: `repeat(${events.length}, minmax(0, 1fr))` }}>
                        {events.map((e, i) => (
                            <li key={e.slug} className="border-l border-dashed border-white/25 px-[1cqw] py-[2.2cqw] text-center first:border-l-0">
                                <p className="text-[1.7cqw] tabular-nums text-orange">{String(i + 1).padStart(2, "0")}</p>
                                <p className="mt-[0.5cqw] font-sans text-[2.35cqw] font-bold leading-tight">{e.name}</p>
                                <p className="mt-[0.4cqw] text-[1.6cqw] uppercase tracking-wide text-white/65">{e.kind}</p>
                            </li>
                        ))}
                    </ol>

                    {/* register: the main visual */}
                    <section
                        aria-label="Register"
                        className="rounded-[3cqw] bg-black/35 p-[1.2cqw] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/[0.09]"
                    >
                        <div className="grid grid-cols-[auto_1fr] gap-[3cqw] rounded-[2.2cqw] bg-white/[0.06] p-[2.4cqw]">
                            <div>
                                <div
                                    role="img"
                                    aria-label="QR code"
                                    className="grid size-[31cqw] place-items-center rounded-[2cqw] bg-white p-[2.6cqw]"
                                >
                                    {qr ? (
                                        <div className="size-full [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: qr }} />
                                    ) : (
                                        <p className="border border-dashed border-black/30 p-[1.4cqw] text-center text-[1.5cqw] leading-snug text-black/60">
                                            QR appears when NEXT_PUBLIC_SITE_URL is set
                                        </p>
                                    )}
                                </div>

                                <p className="mt-[1.4cqw] flex w-full items-center justify-center gap-[1cqw]  py-[1.3cqw] text-[1.5cqw] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                                    <BadgeCheck aria-hidden className="size-[2.4cqw] text-green" />
                                    Registration Fee Zero
                                </p>
                            </div>

                            <div className="flex min-w-0 flex-col justify-between">
                                <div>
                                    <p className="text-[1.7cqw] uppercase tracking-[0.14em] text-white/65">[Scan to register]</p>
                                    <p className="mt-[1cqw] font-sans text-[5.4cqw] font-bold leading-[1.05]">{cta.label}</p>
                                </div>
                                <dl className="divide-y divide-dashed divide-white/25 border-t border-dashed border-white/25">
                                    <div className={fact}>
                                        <dt className={factLabel}>Registration closes</dt>
                                        <dd className={factValue}>{registration.deadlineLabel}</dd>
                                    </div>
                                    <div className={fact}>
                                        <dt className={factLabel}>Event date</dt>
                                        <dd className={factValue}>
                                            {event.dateLabel}
                                            {event.dateStatus === "tentative" && <span className="ml-[1cqw] text-[1.8cqw] font-medium text-orange">tentative</span>}
                                            {event.timeLabel && <span className="block text-[2cqw] font-medium text-white/70">{event.timeLabel}</span>}
                                        </dd>
                                    </div>
                                    <div className={fact}>
                                        <dt className={factLabel}>Venue</dt>
                                        <dd className={factValue}>{event.venue}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </section>
                </div>
            </article>
        </main>
    );
}