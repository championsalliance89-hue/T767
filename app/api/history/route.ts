import { NextResponse } from "next/server";
import { loadHistory } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  const history = loadHistory();
  return NextResponse.json(history, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
