import { z } from "zod";
import { commonFields, eventForms } from "@/data/registration-forms";
import type { Field, Values } from "./fields";
import { cleanText, isIndianMobile, normalizePhone } from "./sanitize";

const req = (l: string) => `${l} is required`;

export function fieldSchema(f: Field): z.ZodType {
  const required = !!f.required;
  switch (f.type) {
    case "text":
    case "textarea": {
      const max = f.max ?? (f.type === "textarea" ? 1000 : 80);
      return z
        .string()
        .optional()
        .transform((v) => cleanText(v ?? "", f.type === "textarea"))
        .pipe(
          z
            .string()
            .max(max, `${f.label} is too long (max ${max} characters)`)
            .refine((v) => !required || v.length > 0, req(f.label)),
        );
    }
    case "email":
      return z
        .string()
        .optional()
        .transform((v) => cleanText(v ?? "").toLowerCase())
        .pipe(z.string().max(254).refine((v) => (!required && v === "") || z.email().safeParse(v).success, "Enter a valid email"));
    case "tel":
      return z
        .string()
        .optional()
        .transform((v) => normalizePhone(v ?? ""))
        .pipe(z.string().refine((v) => (!required && v === "") || isIndianMobile(v), "Enter a valid 10-digit mobile number"));
    case "radio": {
      const vals = f.options.map((o) => o.value) as [string, ...string[]];
      const e = z.enum(vals, { error: `Please choose ${f.label.toLowerCase()}` });
      return required ? e : e.or(z.literal("")).optional().transform((v) => v ?? "");
    }
    case "checkbox": {
      const vals = f.options.map((o) => o.value) as [string, ...string[]];
      const a = z
        .array(z.enum(vals), { error: "Pick at least one" })
        .max(vals.length)
        .transform((v) => [...new Set(v)]);
      return required ? a.refine((v) => v.length > 0, "Pick at least one") : a.optional().transform((v) => v ?? []);
    }
  }
}

export const buildSchema = (fields: readonly Field[]) =>
  z.object(Object.fromEntries(fields.map((f) => [f.name, fieldSchema(f)])));

const commonSchema = buildSchema(commonFields);
const eventSchemas = Object.fromEntries(Object.entries(eventForms).map(([slug, f]) => [slug, buildSchema(f.fields)]));

export type Errors = Record<string, string>;

/** Client helper: first error message per field name (with optional key prefix). */
export function validateFields(fields: readonly Field[], values: Values, prefix = ""): Errors {
  const out: Errors = {};
  for (const f of fields) {
    const r = fieldSchema(f).safeParse(values[f.name]);
    if (!r.success) out[prefix + f.name] = r.error.issues[0]?.message ?? "Invalid value";
  }
  return out;
}

const collect = (err: z.ZodError, prefix: string, into: Errors) => {
  for (const i of err.issues) into[prefix + String(i.path[0] ?? "")] ??= i.message;
};

/** Server-side authority. Unknown keys are dropped; each selected event is validated against its own schema. */
export function validateRegistration(raw: { common: unknown; entries: unknown }) {
  const errors: Errors = {};
  const c = commonSchema.safeParse(raw.common);
  if (!c.success) collect(c.error, "", errors);

  const entries: Record<string, Record<string, unknown>> = {};
  if (c.success) {
    const given = (raw.entries && typeof raw.entries === "object" ? raw.entries : {}) as Record<string, unknown>;
    for (const slug of c.data.events as string[]) {
      const schema = eventSchemas[slug];
      if (!schema) {
        errors.events = "Unknown event";
        continue;
      }
      const r = schema.safeParse(given[slug] ?? {});
      if (r.success) entries[slug] = r.data as Record<string, unknown>;
      else collect(r.error, `${slug}.`, errors);
    }
  }

  if (!c.success || Object.keys(errors).length) return { ok: false as const, errors };
  return { ok: true as const, common: c.data as Record<string, unknown>, entries };
}