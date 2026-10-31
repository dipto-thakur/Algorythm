import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "admin_session";
const TTL = 8 * 60 * 60; // seconds

// The password is part of the signing key, so changing it signs everyone out.
const key = () => `${process.env.ADMIN_SESSION_SECRET ?? ""}:${process.env.ADMIN_PASSWORD ?? ""}`;
const sign = (payload: string) => createHmac("sha256", key()).update(payload).digest("base64url");

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD && (process.env.ADMIN_SESSION_SECRET ?? "").length >= 32;

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD ?? "";
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return expected.length > 0 && timingSafeEqual(a, b);
}

export async function createSession() {
  const exp = String(Math.floor(Date.now() / 1000) + TTL);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: TTL,
  });
}

export async function clearSession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  const [exp, sig] = token?.split(".") ?? [];
  if (!exp || !sig) return false;
  const good = Buffer.from(sign(exp));
  const given = Buffer.from(sig);
  if (good.length !== given.length || !timingSafeEqual(good, given)) return false;
  return Number(exp) > Date.now() / 1000;
}