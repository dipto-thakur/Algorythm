import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const ad = {
  name: "Sourccit",
  shortDescription: "Discover & Share study materials",
  longDescription: "Discover, save, and share academic resources, all in one place.",
  href: "https://sourccit.vercel.app/",
  icon: "/assets/sourccit-icon.png",
} as const;

export function AdRow() {
  return (
    <aside aria-label="Advertisement" className="border-y border-dashed border-line px-2.5 sm:px-6 lg:px-[84px]">
      <div className="mx-auto max-w-[90rem]">
        <a
          href={ad.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="group flex min-h-14 items-center gap-2.5 py-2 transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.03] sm:min-h-[4.5rem] sm:gap-4 sm:px-7 sm:py-3"
        >
          <Image
            src={ad.icon}
            alt=""
            width={44}
            height={44}
            className="size-10 shrink-0 rounded-xl object-cover ring-1 ring-white/15 sm:size-11"
          />

          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5">
              <span className="truncate font-sans text-base font-bold text-white/90 transition-colors group-hover:text-white sm:text-lg">
                {ad.name}
              </span>
              <span className="shrink-0 rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/65">
                Ad
              </span>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
              />
            </span>

            {/* phones: short text that may wrap to 2 lines. sm and up: the long text on one line */}
            <span className="mt-0.5 line-clamp-2 block text-xs leading-[1.15rem] text-white/65 sm:hidden">{ad.shortDescription}</span>
            <span className="mt-0.5 hidden truncate text-sm leading-5 text-white/65 sm:block">{ad.longDescription}</span>
          </span>
        </a>
      </div>
    </aside>
  );
}