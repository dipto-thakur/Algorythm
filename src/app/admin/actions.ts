"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { adminConfigured, checkPassword, clearSession, createSession, isAdmin } from "@/lib/admin/auth";
import { getRegistrations } from "@/lib/admin/data";
import type { AdminRow } from "@/lib/admin/types";

export type LoginState = { error?: string };

// Failed-attempt limiter (per server instance): 5 failures per 15 minutes per IP.
const fails = new Map<string, number[]>();
const recent = (ip: string) => (fails.get(ip) ?? []).filter((t) => Date.now() - t < 15 * 60_000);

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!adminConfigured()) return { error: "Admin is not configured on the server." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (recent(ip).length >= 5) return { error: "Too many attempts. Try again in a few minutes." };

  const pw = form.get("password");
  if (typeof pw !== "string" || pw.length > 200 || !checkPassword(pw)) {
    fails.set(ip, [...recent(ip), Date.now()]);
    if (fails.size > 2000) fails.clear();
    await new Promise((r) => setTimeout(r, 500)); // slows guessing
    return { error: "Incorrect password." };
  }

  await createSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await clearSession();
  redirect("/admin/login");
}

export type FetchResult =
  | { ok: true; rows: AdminRow[]; fetchedAt: string }
  | { ok: false; code: "auth" | "server"; message: string };

/** Re-checks the session on every call. The browser never touches the database. */
export async function fetchRegistrations(): Promise<FetchResult> {
  if (!(await isAdmin())) return { ok: false, code: "auth", message: "Session expired. Please sign in again." };
  try {
    return { ok: true, ...(await getRegistrations()) };
  } catch (e) {
    console.error("[admin] read failed:", e instanceof Error ? e.message : "unknown"); // no personal data in logs
    return { ok: false, code: "server", message: "Couldn't load data. Please try again." };
  }
}