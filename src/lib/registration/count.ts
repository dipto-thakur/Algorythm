import "server-only";
import { siteConfig } from "@/config/site";
import { adminDb } from "@/lib/supabase/admin";

let memo: { at: number; value: number | null } | null = null;

/** Live registrations + optional baseline. Briefly memoized so polling can't hammer the database. */
export async function getRegisteredCount(): Promise<number | null> {
  if (memo && Date.now() - memo.at < 10_000) return memo.value;

  const db = adminDb();
  let value: number | null = null;
  if (db) {
    const { count, error } = await db.from("registrations").select("id", { count: "exact", head: true });
    if (error) console.error("[count]", error.code, error.message);
    else if (count !== null) value = count + siteConfig.registration.baseCount;
  }
  memo = { at: Date.now(), value };
  return value;
}