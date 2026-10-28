"use client";

import { commonFields, eventForms } from "@/data/registration-forms";
import { events } from "@/data/events";
import { displayValue, type Field, type Values } from "@/lib/registration/fields";

type Props = {
  common: Values;
  entries: Record<string, Values>;
  slugs: string[];
  onEdit: (step: "details" | "events") => void;
};

function Section({ title, fields, values, onEdit }: { title: string; fields: Field[]; values: Values; onEdit: () => void }) {
  return (
    <section className="rounded-3xl bg-white/[0.05] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-sans text-lg font-bold">{title}</h3>
        <button type="button" onClick={onEdit} className="min-h-11 rounded-full px-4 text-sm font-bold text-blue transition-colors hover:bg-white/[0.08]">
          Edit
        </button>
      </div>
      <dl className="mt-1 divide-y divide-white/10">
        {fields.map((f) => (
          <div key={f.name} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:gap-6">
            <dt className="text-sm text-white/60 sm:w-52 sm:shrink-0">{f.label}</dt>
            <dd className="min-w-0 whitespace-pre-line break-words text-sm font-medium">{displayValue(f, values[f.name])}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ReviewStep({ common, entries, slugs, onEdit }: Props) {
  return (
    <div className="grid gap-4">
      <Section title="About you" fields={commonFields} values={common} onEdit={() => onEdit("details")} />
      {slugs.map((s) => (
        <Section
          key={s}
          title={events.find((e) => e.slug === s)?.name ?? s}
          fields={eventForms[s]?.fields ?? []}
          values={entries[s] ?? {}}
          onEdit={() => onEdit("events")}
        />
      ))}
    </div>
  );
}