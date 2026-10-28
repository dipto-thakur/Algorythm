import { z } from "zod";
import { commonFields, eventForms } from "@/data/registration-forms";
import { isVisible, type Field, type Values } from "./fields";
import { cleanText, isIndianMobile, normalizePhone } from "./sanitize";

const req = (l: string) => `${l} is required`;

export function fieldSchema(f: Field, required = !!f.required): z.ZodType {
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

export type Errors = Record<string, string>;

/** Validates + cleans a list of fields. Hidden (showIf) fields are skipped and dropped from the output. */
export function parseFields(fields: readonly Field[], input: unknown, prefix = "") {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const data: Record<string, unknown> = {};
  const errors: Errors = {};
  for (const f of fields) {
    if (!isVisible(f, src)) continue;
    const r = fieldSchema(f).safeParse(src[f.name]);
    if (r.success) data[f.name] = r.data;
    else errors[prefix + f.name] = r.error.issues[0]?.message ?? "Invalid value";
  }
  return { data, errors };
}

/** Client helper. */
export const validateFields = (fields: readonly Field[], values: Values, prefix = ""): Errors =>
  parseFields(fields, values, prefix).errors;

/** Server-side authority. Each selected event is validated against its own field list. */
export function validateRegistration(raw: { common: unknown; entries: unknown }) {
  const common = parseFields(commonFields, raw.common);
  const errors: Errors = { ...common.errors };
  const entries: Record<string, Record<string, unknown>> = {};

  if (!Object.keys(errors).length) {
    const given = (raw.entries && typeof raw.entries === "object" ? raw.entries : {}) as Record<string, unknown>;
    for (const slug of common.data.events as string[]) {
      const form = eventForms[slug];
      if (!form) {
        errors.events = "Unknown event";
        continue;
      }
      const r = parseFields(form.fields, given[slug], `${slug}.`);
      Object.assign(errors, r.errors);
      entries[slug] = r.data;
    }
  }

  if (Object.keys(errors).length) return { ok: false as const, errors };
  return { ok: true as const, common: common.data, entries };
}