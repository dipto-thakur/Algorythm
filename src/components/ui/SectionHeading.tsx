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
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p className="px-5 py-5 text-sm uppercase tracking-wide text-muted">[{label}]</p>
      <h2
        id={id}
        className={cn(
          "border-y border-dashed border-line px-5 py-4 font-sans text-[clamp(1.5rem,3.2vw,2.25rem)] leading-tight",
          colors[color],
        )}
      >
        {title}
      </h2>
    </div>
  );
}
