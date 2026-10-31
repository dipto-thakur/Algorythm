import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { isAdmin } from "@/lib/admin/auth";
import { getRegistrations } from "@/lib/admin/data";

export const dynamic = "force-dynamic"; // always live, never cached

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  let initial: Awaited<ReturnType<typeof getRegistrations>> | null = null;
  try {
    initial = await getRegistrations();
  } catch (e) {
    console.error("[admin] initial read failed:", e instanceof Error ? e.message : "unknown");
  }
  return <AdminDashboard initial={initial} />;
}