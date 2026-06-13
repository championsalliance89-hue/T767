/**
 * generate-predictions.ts
 * Standalone script — runs the full prediction pipeline.
 * Run via: npx tsx scripts/generate-predictions.ts
 */

import { fetchTodayFixtures } from "../lib/fetcher";
import { generateAllPredictions } from "../lib/prediction-engine";
import { savePredictions } from "../lib/storage";
import type { Sport, PredictionOutput } from "../lib/types";

async function runForSport(sport: Sport) {
  console.log(`\n[generate-predictions] ── ${sport.toUpperCase()} ──`);

  // 1. Fetch fixtures
  const fixtures = await fetchTodayFixtures(sport);
  console.log(`  Fixtures fetched: ${fixtures.length}`);

  if (fixtures.length === 0) {
    console.log("  No fixtures today. Skipping.");
    return;
  }

  // 2. Run prediction engine
  const predictions = generateAllPredictions(fixtures);
  console.log(`  Predictions generated: ${predictions.length}`);

  // 3. Log breakdown
  const elite = predictions.filter((p) => p.tier === "elite").length;
  const high = predictions.filter((p) => p.tier === "high").length;
  const medium = predictions.filter((p) => p.tier === "medium").length;
  console.log(`  Elite (90%+): ${elite}  High (80–89%): ${high}  Medium (70–79%): ${medium}`);

  // 4. Save output
  const output: PredictionOutput = {
    generatedAt: new Date().toISOString(),
    sport,
    predictions,
  };

  savePredictions(output);
}

async function main() {
  console.log("=== Tennis Prediction Engine ===");
  console.log(`Date: ${new Date().toISOString()}`);

  await runForSport("tennis");
  await runForSport("table-tennis");

  console.log("\n[generate-predictions] Done.");
}

main().catch(console.error);
