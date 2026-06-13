import { NextRequest, NextResponse } from "next/server";
import { loadPredictionsForDate, savePredictionsForDate } from "@/lib/storage";
import { fetchFixturesForDate } from "@/lib/fetcher";
import { generateAllPredictions } from "@/lib/prediction-engine";
import type { Sport, PredictionOutput } from "@/lib/types";

export const runtime   = "nodejs";
export const maxDuration = 30;

const VALID: Sport[] = ["tennis", "table-tennis"];

export async function GET(
  req: NextRequest,
  { params }: { params: { sport: string } }
) {
  const sport = params.sport as Sport;
  if (!VALID.includes(sport)) {
    return NextResponse.json({ error: "Invalid sport" }, { status: 400 });
  }

  // Accept ?date=YYYY-MM-DD, default to today
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  // Only allow today + next 3 days
  const today   = new Date(); today.setHours(0, 0, 0, 0);
  const reqDate = new Date(date); reqDate.setHours(0, 0, 0, 0);
  const diff    = Math.round((reqDate.getTime() - today.getTime()) / 86400000);
  if (diff < 0 || diff > 3) {
    return NextResponse.json({ error: "Date out of range" }, { status: 400 });
  }

  let output = loadPredictionsForDate(sport, date);

  if (!output) {
    try {
      const fixtures    = await fetchFixturesForDate(sport, date);
      const predictions = generateAllPredictions(fixtures);
      output = { generatedAt: new Date().toISOString(), sport, predictions } satisfies PredictionOutput;
      savePredictionsForDate(output, date);
    } catch (err) {
      console.error("[predictions] failed:", err);
      if (!output) {
        return NextResponse.json({ error: "No predictions available" }, { status: 503 });
      }
    }
  }

  return NextResponse.json(output, { headers: { "Cache-Control": "no-store" } });
}
