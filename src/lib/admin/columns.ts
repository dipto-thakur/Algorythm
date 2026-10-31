import { events } from "@/data/events";
import { eventForms } from "@/data/registration-forms";
import { displayValue, isVisible, type Field } from "@/lib/registration/fields";
import type { AdminRow } from "./types";

export type Tab = string; // "all" or an event slug
export type Col = {
  key: string;
  label: string;
  text: (r: AdminRow) => string;
  sort?: (r: AdminRow) => string | number;
  wrap?: boolean;
};

// Fixed timezone so server and browser render the same text.
const stamp = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});
export const fmtTime = (iso: string) => stamp.format(new Date(iso));
export const eventName = (slug: string) => events.find((e) => e.slug === slug)?.name ?? slug;

export function fieldText(r: AdminRow, slug: string, f: Field): string {
  const d = r.entries[slug];
  if (!d || !isVisible(f, d)) return "";
  const s = displayValue(f, d[f.name] as string | string[] | undefined);
  return s === "—" ? "" : s;
}

const base: Col[] = [
  { key: "name", label: "Name", text: (r) => r.name },
  { key: "college", label: "College", text: (r) => r.college, wrap: true },
  { key: "department", label: "Dept", text: (r) => r.department },
  { key: "semester", label: "Sem", text: (r) => String(r.semester), sort: (r) => r.semester },
  { key: "whatsapp", label: "WhatsApp", text: (r) => r.whatsapp },
];
const registered: Col = { key: "createdAt", label: "Registered", text: (r) => fmtTime(r.createdAt), sort: (r) => r.createdAt };

export function columnsFor(tab: Tab): Col[] {
  if (tab === "all") {
    const joined: Col = {
      key: "events",
      label: "Events",
      wrap: true,
      text: (r) => events.filter((e) => e.slug in r.entries).map((e) => e.name).join(", "),
    };
    return [...base, joined, registered];
  }
  const extra = (eventForms[tab]?.fields ?? []).map<Col>((f) => ({
    key: `${tab}.${f.name}`,
    label: f.label,
    wrap: f.type === "checkbox",
    text: (r) => fieldText(r, tab, f),
  }));
  return [...base, ...extra, registered];
}

export function filterRows(rows: AdminRow[], o: { tab: Tab; q: string; sem: string; dept: string; cols: Col[] }) {
  const q = o.q.trim().toLowerCase();
  return rows.filter((r) => {
    if (o.tab !== "all" && !r.entries[o.tab]) return false;
    if (o.sem && String(r.semester) !== o.sem) return false;
    if (o.dept && r.department.toLowerCase() !== o.dept) return false;
    if (!q) return true;
    return [...o.cols.map((c) => c.text(r)), r.calling, r.email ?? ""].join(" ").toLowerCase().includes(q);
  });
}

export function sortRows(rows: AdminRow[], col: Col | undefined, dir: 1 | -1) {
  if (!col) return rows;
  const val = col.sort ?? col.text;
  return [...rows].sort((a, b) => {
    const x = val(a);
    const y = val(b);
    const c =
      typeof x === "number" && typeof y === "number"
        ? x - y
        : String(x).localeCompare(String(y), undefined, { numeric: true, sensitivity: "base" });
    return c * dir;
  });
}

/** Excel-safe CSV: BOM for UTF-8, quotes escaped, formula-looking cells neutralized. */
export function toCsv(cols: Col[], rows: AdminRow[]) {
  const esc = (s: string) => {
    const v = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  };
  const lines = [cols.map((c) => esc(c.label)).join(","), ...rows.map((r) => cols.map((c) => esc(c.text(r))).join(","))];
  return "\uFEFF" + lines.join("\r\n");
}