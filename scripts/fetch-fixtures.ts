/**
 * fetch-fixtures.ts
 * Standalone script to fetch today's fixtures.
 * Run via: npx tsx scripts/fetch-fixtures.ts
 */

import { fetchTodayFixtures } from "../lib/fetcher";

async function main() {
  const sports = ["tennis", "table-tennis"] as const;

  for (const sport of sports) {
    console.log(`\n[fetch-fixtures] Fetching ${sport} fixtures…`);
    const fixtures = await fetchTodayFixtures(sport);
    console.log(`[fetch-fixtures] Found ${fixtures.length} fixture(s) for ${sport}:`);
    fixtures.forEach((f) => {
      console.log(`  • ${f.player1.name} vs ${f.player2.name} — ${f.tournament}`);
    });
  }
}

main().catch(console.error);
