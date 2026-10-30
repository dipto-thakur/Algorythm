//src\components\ui\SectionHeading.tsx
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  title: string;
  color: "orange" | "blue" | "green";
  align?: "left" | "center";
  id?: string;
};

const colors = { orange: "text-orange", blue: "text-blue", green: "text-green" } as const;

export function SectionHeading({ label, title, color, align = "center", id }: Props) {
  const center = align === "center";
  return (
    <div className={center ? "text-center" : "text-left"}>
      <p className="px-5 py-4 text-xs font-medium uppercase tracking-[0.14em] text-muted sm:py-5 sm:text-sm">
        <span aria-hidden className={cn("opacity-70", colors[color])}>[</span>
        {label}
        <span aria-hidden className={cn("opacity-70", colors[color])}>]</span>
      </p>
      <h2
        id={id}
        className={cn(
          "text-balance break-words border-y border-dashed border-line px-5 py-3.5 font-sans font-bold leading-[1.15] tracking-tight sm:py-4",
          "text-[clamp(1.5rem,1.1rem+1.9vw,2.5rem)]",
          colors[color],
        )}
      >
        {title}
      </h2>
    </div>
  );
}