"use client";
//src\components\register\ReviewStep.tsx
import { Pencil } from "lucide-react";
import { memo } from "react";
import { commonFields, eventForms } from "@/data/registration-forms";
import { events } from "@/data/events";
import { displayValue, isVisible, type Field, type Values } from "@/lib/registration/fields";

type Props = {
  common: Values;
  entries: Record<string, Values>;
  slugs: string[];
  onEdit: (step: "details" | "events") => void;
};

const names = new Map(events.map((e) => [e.slug, e.name]));

const Section = memo(function Section({
  index,
  title,
  fields,
  values,
  onEdit,
}: {
  index: number;
  title: string;
  fields: Field[];
  values: Values;
  onEdit: () => void;
}) {
  const id = `review-${index}`;
  const visible = fields.filter((f) => isVisible(f, values));

  return (
    <section
      aria-labelledby={id}
      className="rounded-3xl bg-white/[0.05] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] sm:p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 id={id} className="min-w-0 break-words font-sans text-lg font-bold">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="-mr-2 inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-bold text-blue transition-colors hover:bg-white/[0.08] focus-visible:bg-white/[0.08] active:bg-white/[0.12]"
        >
          <Pencil aria-hidden className="size-3.5" />
          Edit
        </button>
      </div>

      <dl className="mt-1 divide-y divide-white/10">
        {visible.map((f) => {
          const text = String(displayValue(f, values[f.name]) ?? "").trim();
          return (
            <div key={f.name} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-6">
              <dt className="text-sm text-white/60 sm:w-52 sm:shrink-0">{f.label}</dt>
              <dd className="min-w-0 whitespace-pre-line break-words text-sm font-medium">
                {text || <span className="font-normal text-white/40">Not provided</span>}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
});

export function ReviewStep({ common, entries, slugs, onEdit }: Props) {
  return (
    <div className="grid gap-4">
      <p className="px-1 text-sm leading-6 text-white/70 sm:hidden">One last look before you submit.</p>
      <Section index={0} title="About you" fields={commonFields} values={common} onEdit={() => onEdit("details")} />
      {slugs.map((s, i) => (
        <Section
          key={s}
          index={i + 1}
          title={names.get(s) ?? s}
          fields={eventForms[s]?.fields ?? []}
          values={entries[s] ?? {}}
          onEdit={() => onEdit("events")}
        />
      ))}
    </div>
  );
}