
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const ad = {
  name: "Sourccit",
  shortDescription: "Find-save-share study materials.",
  longDescription: "Discover, save, and share academic resources, all in one place.",
  href: "https://sourccit.vercel.app/",
  icon: "/assets/sourccit-icon.png",
} as const;

export function AdRow() {
  return (
    <aside
      aria-label="Advertisement"
      className="border-t border-dashed border-line px-3 sm:px-6 lg:px-[84px]"
    >
      <div className="mx-auto max-w-[90rem]">
        <a
          href={ad.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="group flex min-h-12 items-center gap-3 px-4 py-2.5 text-white/50 transition-colors hover:bg-white/[0.03] hover:text-white/80 focus-visible:bg-white/[0.03] focus-visible:text-white/80 sm:px-7"
        >
          <span className="shrink-0 rounded bg-white/[0.06] px-1.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40">
            Ad
          </span>

          <span aria-hidden className="h-5 w-px shrink-0 bg-white/10" />

          <Image
            src={ad.icon}
            alt=""
            width={32}
            height={32}
            className="size-8 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
          />

          <span className="min-w-0 flex-1 truncate leading-5">
            <span className="font-sans text-base font-semibold text-white/75 transition-colors group-hover:text-white sm:text-lg">
              {ad.name}
            </span>

            <span className="ml-2 text-xs text-white/40 sm:hidden">
              · {ad.shortDescription}
            </span>

            <span className="ml-2 hidden text-sm text-white/40 sm:inline">
              · {ad.longDescription}
            </span>
          </span>

          <ArrowUpRight
            aria-hidden
            className="size-4 shrink-0 text-white/35 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80"
          />
        </a>
      </div>
    </aside>
  );
}
