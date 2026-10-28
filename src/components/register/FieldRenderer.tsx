"use client";

import { Check } from "lucide-react";
import type { Field } from "@/lib/registration/fields";
import { cn } from "@/lib/utils";

type Props = {
  field: Field;
  id: string;
  value: string | string[];
  error?: string;
  onChange: (v: string | string[]) => void;
  onBlur: () => void;
};

const control =
  "w-full rounded-2xl bg-white/[0.07] px-4 text-base text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] outline-none transition-colors placeholder:text-white/35 focus-visible:bg-white/[0.12] focus-visible:ring-2 focus-visible:ring-white/80 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-orange/80";
const labelCls = "block text-sm font-bold";
const chip =
  "flex min-h-11 items-center gap-2 bg-white/[0.07] px-4 py-2 text-sm font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors hover:bg-white/[0.12] peer-checked:bg-white peer-checked:text-black peer-focus-visible:ring-2 peer-focus-visible:ring-white/80 peer-checked:[&_svg]:opacity-100";

export function FieldRenderer({ field: f, id, value, error, onChange, onBlur }: Props) {
  const described = [f.help && `${id}-h`, error && `${id}-e`].filter(Boolean).join(" ") || undefined;
  const label = (
    <>
      {f.label}
      {f.required && <span aria-hidden className="text-orange"> *</span>}
    </>
  );
  const meta = (
    <>
      {f.help && <p id={`${id}-h`} className="mt-1.5 text-sm leading-5 text-white/60">{f.help}</p>}
      {error && <p id={`${id}-e`} role="alert" className="mt-1.5 text-sm font-medium text-orange">{error}</p>}
    </>
  );

  if (f.type === "radio" || f.type === "checkbox") {
    const multi = f.type === "checkbox";
    const stack = f.options.some((o) => o.hint || o.label.length > 16);
    const selected = (v: string) => (multi ? (value as string[]).includes(v) : value === v);
    const toggle = (v: string) =>
      multi ? onChange(selected(v) ? (value as string[]).filter((x) => x !== v) : [...(value as string[]), v]) : onChange(v);

    return (
      <fieldset id={id} tabIndex={-1} aria-describedby={described} aria-invalid={!!error} className="min-w-0 outline-none">
        <legend className={labelCls}>{label}</legend>
        <div className={cn("mt-2.5", stack ? "grid gap-2" : "flex flex-wrap gap-2")}>
          {f.options.map((o) => (
            <label key={o.value} className="relative block cursor-pointer">
              <input
                type={multi ? "checkbox" : "radio"}
                name={id}
                value={o.value}
                checked={selected(o.value)}
                onChange={() => toggle(o.value)}
                onBlur={onBlur}
                className="peer sr-only"
              />
              <span className={cn(chip, stack ? "justify-between rounded-2xl py-3" : "rounded-full")}>
                <span className="min-w-0">{o.label}</span>
                {o.hint && <span className="text-xs opacity-70">{o.hint}</span>}
                {multi && <Check aria-hidden className="size-4 shrink-0 opacity-0 transition-opacity" />}
              </span>
            </label>
          ))}
        </div>
        {meta}
      </fieldset>
    );
  }

  const common = {
    id,
    value: value as string,
    "aria-invalid": !!error,
    "aria-describedby": described,
    onBlur,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value),
  };

  return (
    <div className="min-w-0">
      <label htmlFor={id} className={labelCls}>{label}</label>
      <div className="mt-2.5">
        {f.type === "textarea" ? (
          <textarea {...common} rows={4} maxLength={f.max ?? 1000} placeholder={f.placeholder} className={cn(control, "min-h-28 resize-y py-3")} />
        ) : (
          <input
            {...common}
            type={f.type === "tel" ? "tel" : f.type === "email" ? "email" : "text"}
            inputMode={f.type === "tel" ? "tel" : f.type === "email" ? "email" : undefined}
            autoComplete={f.type === "text" || f.type === "tel" ? f.autoComplete : f.type === "email" ? "email" : undefined}
            maxLength={f.type === "text" ? (f.max ?? 80) : f.type === "tel" ? 20 : f.type === "email" ? 254 : undefined}
            placeholder={f.type === "text" ? f.placeholder : undefined}
            className={cn(control, "h-12")}
          />
        )}
      </div>
      {meta}
    </div>
  );
}