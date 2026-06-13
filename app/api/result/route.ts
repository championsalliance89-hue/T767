/**
 * POST /api/result
 * Body: { sport, predictionId, result: "correct"|"incorrect"|"void" }
 * Allows manual result entry (or future automation).
 */
import { NextRequest, NextResponse } from "next/server";
import { updatePredictionResult } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { sport, predictionId, result } = body;
  if (!sport || !predictionId || !result) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const ok = updatePredictionResult(sport, predictionId, result);
  return NextResponse.json({ success: ok });
}
