import "server-only";
import { adminDb } from "@/lib/supabase/admin";
import type { AdminRow } from "./types";

type Raw = {
  id: string;
  name: string;
  email: string | null;
  college: string;
  department: string;
  semester: number;
  calling_no: string;
  whatsapp_no: string;
  query: string | null;
  created_at: string;
  event_entries: { event_slug: string; data: Record<string, unknown> }[];
};

const PAGE = 1000; // Supabase returns at most 1000 rows per request, so we page
const MAX_PAGES = 10;

export async function getRegistrations() {
  const db = adminDb();
  if (!db) throw new Error("Supabase env missing");

  const rows: AdminRow[] = [];
  for (let p = 0; p < MAX_PAGES; p++) {
    const { data, error } = await db
      .from("registrations")
      .select("id,name,email,college,department,semester,calling_no,whatsapp_no,query,created_at,event_entries(event_slug,data)")
      .order("created_at", { ascending: false })
      .order("id")
      .range(p * PAGE, p * PAGE + PAGE - 1);
    if (error) throw new Error(error.message);

    const batch = (data ?? []) as unknown as Raw[];
    for (const r of batch) {
      rows.push({
        id: r.id,
        name: r.name,
        email: r.email,
        college: r.college,
        department: r.department,
        semester: r.semester,
        calling: r.calling_no,
        whatsapp: r.whatsapp_no,
        query: r.query,
        createdAt: r.created_at,
        entries: Object.fromEntries(r.event_entries.map((e) => [e.event_slug, e.data])),
      });
    }
    if (batch.length < PAGE) break;
  }
  return { rows, fetchedAt: new Date().toISOString() };
}