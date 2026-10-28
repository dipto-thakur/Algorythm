"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { siteConfig } from "@/config/site";
import { validateRegistration } from "@/lib/registration/schema";
import { adminDb } from "@/lib/supabase/admin";

export type SubmitResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; code: "closed" | "rate" | "invalid" | "duplicate" | "server"; message: string; fieldErrors?: Record<string, string> };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Best-effort per-instance limiter. For hard limits across serverless instances, use Upstash/Vercel KV.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 6;
}

const fail = (code: Extract<SubmitResult, { ok: false }>["code"], message: string, fieldErrors?: Record<string, string>): SubmitResult => ({
  ok: false,
  code,
  message,
  fieldErrors,
});

export async function submitRegistration(raw: unknown): Promise<SubmitResult> {
  if (Date.now() > new Date(siteConfig.registration.deadlineISO).getTime()) {
    return fail("closed", "Registrations are closed.");
  }

  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  if (typeof body.hp === "string" && body.hp !== "") return { ok: true, duplicate: false }; // honeypot: bots get a silent "success"

  const id = typeof body.submissionId === "string" && UUID.test(body.submissionId) ? body.submissionId : null;
  if (!id) return fail("invalid", "Something went wrong with the form. Please refresh and try again.");

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return fail("rate", "Too many attempts. Please wait a few minutes and try again.");

  const v = validateRegistration({ common: body.common, entries: body.entries });
  if (!v.ok) return fail("invalid", "Please fix the highlighted fields.", v.errors);

  const db = adminDb();
  if (!db) {
    console.error("[register] Supabase env missing");
    return fail("server", "Registration is temporarily unavailable. Please use the helpline below.");
  }

  const { error } = await db.rpc("submit_registration", { p_submission: id, p_common: v.common, p_entries: v.entries });
  if (error) {
    if (error.code === "23505") {
      return fail("duplicate", "This WhatsApp number is already registered. To change anything, contact the helpline.");
    }
    console.error("[register] rpc failed", error.code, error.message); // never leaked to the client
    return fail("server", "We couldn't save your registration. Your answers are safe on this device, so please try again.");
  }
  revalidatePath("/"); // home page picks up the new count on the next visit
  return { ok: true, duplicate: false };
}