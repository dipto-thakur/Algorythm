export type Option = { value: string; label: string; hint?: string };
export type Values = Record<string, string | string[]>;

type Base = {
  name: string;
  label: string;
  required?: boolean;
  help?: string;
  /** Copy this common answer into the field when the event step opens. */
  prefill?: "name" | "whatsapp" | "calling";
};

export type Field = Base &
  (
    | { type: "text"; max?: number; autoComplete?: string; placeholder?: string }
    | { type: "textarea"; max?: number; placeholder?: string }
    | { type: "email" }
    | { type: "tel"; autoComplete?: string }
    | { type: "radio"; options: readonly Option[] }
    | { type: "checkbox"; options: readonly Option[] }
  );

export const emptyValues = (fields: readonly Field[]): Values =>
  Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? [] : ""]));

export function displayValue(f: Field, v: string | string[] | undefined): string {
  const label = (x: string) => ("options" in f ? f.options.find((o) => o.value === x)?.label : undefined) ?? x;
  if (Array.isArray(v)) return v.length ? v.map(label).join(", ") : "—";
  return v ? label(v) : "—";
}