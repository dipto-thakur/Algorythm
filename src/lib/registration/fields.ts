export type Option = { value: string; label: string; hint?: string };
export type Values = Record<string, string | string[]>;

type Base = {
  name: string;
  label: string;
  required?: boolean;
  help?: string;
  /** Copy this common answer into the field when the event step opens. */
  prefill?: "name" | "whatsapp" | "calling";
  /** Only show (and validate/store) this field when another field equals this value (or includes it, for checkboxes). */
  showIf?: { field: string; equals: string };
};

export type Field = Base &
  (
    | { type: "text"; max?: number; autoComplete?: string; placeholder?: string }
    | { type: "textarea"; max?: number; placeholder?: string }
    | { type: "email" }
    | { type: "tel"; autoComplete?: string }
    | { type: "radio"; options: readonly Option[]; layout?: "chips" | "stack" }
    | { type: "checkbox"; options: readonly Option[]; layout?: "chips" | "stack" }
  );

export const emptyValues = (fields: readonly Field[]): Values =>
  Object.fromEntries(fields.map((f) => [f.name, f.type === "checkbox" ? [] : ""]));

export function isVisible(f: Field, values: Record<string, unknown>): boolean {
  if (!f.showIf) return true;
  const cur = values[f.showIf.field];
  return Array.isArray(cur) ? cur.includes(f.showIf.equals) : cur === f.showIf.equals;
}

export function displayValue(f: Field, v: string | string[] | undefined): string {
  const label = (x: string) => ("options" in f ? f.options.find((o) => o.value === x)?.label : undefined) ?? x;
  if (Array.isArray(v)) return v.length ? v.map(label).join(", ") : "—";
  return v ? label(v) : "—";
}