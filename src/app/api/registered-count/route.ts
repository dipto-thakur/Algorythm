import { NextResponse } from "next/server";
import { getRegisteredCount } from "@/lib/registration/count";

export async function GET() {
  const count = await getRegisteredCount();
  return NextResponse.json(
    { count },
    { headers: { "Cache-Control": "public, s-maxage=15, stale-while-revalidate=30" } },
  );
}