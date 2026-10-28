// Control chars, zero-width and bidi-override characters (kept: tab, newline).
const INVISIBLE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]/g;

/** Normalizes, strips invisible chars + HTML tags, and neutralizes spreadsheet-formula prefixes. */
export function cleanText(input: string, multiline = false): string {
  let s = input.normalize("NFKC").replace(INVISIBLE, "").replace(/\r\n?/g, "\n");
  s = multiline ? s.replace(/[^\S\n]+/g, " ").replace(/\n{3,}/g, "\n\n") : s.replace(/\s+/g, " ");
  s = s.replace(/<[^>]*>/g, "").trim();
  return /^[=+\-@]/.test(s) ? `'${s}` : s; // CSV/Excel formula injection when you export
}

/** "+91 98765-43210" -> "9876543210" */
export function normalizePhone(input: string): string {
  const d = input.normalize("NFKC").replace(/[^\d+]/g, "");
  return d.replace(/^\+?91(?=\d{10}$)/, "").replace(/^0(?=\d{10}$)/, "");
}

export const isIndianMobile = (v: string) => /^[6-9]\d{9}$/.test(v);