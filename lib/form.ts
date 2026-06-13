import type { MatchResult } from "./types";

/**
 * Recent Form Engine
 * Analyses the last N matches to derive a form score.
 */

/**
 * Calculate a form score for a player based on recent results.
 * More recent matches are weighted higher.
 * Returns a value between 0 and 1.
 */
export function formScore(results: MatchResult[], n = 5): number {
  const recent = results.slice(-n);
  if (recent.length === 0) return 0.5; // neutral if no data

  let weightedSum = 0;
  let totalWeight = 0;

  recent.forEach((match, index) => {
    const weight = index + 1; // more recent = higher index = higher weight
    weightedSum += (match.won ? 1 : 0) * weight;
    totalWeight += weight;
  });

  return totalWeight > 0 ? weightedSum / totalWeight : 0.5;
}

/**
 * Average sets played per match from recent form.
 */
export function avgSetsFromForm(results: MatchResult[], n = 5): number {
  const recent = results.slice(-n);
  if (recent.length === 0) return 3;
  const total = recent.reduce((sum, m) => sum + m.setsPlayed, 0);
  return total / recent.length;
}

/**
 * Win rate over recent matches (0–1).
 */
export function winRate(results: MatchResult[], n = 5): number {
  const recent = results.slice(-n);
  if (recent.length === 0) return 0.5;
  const wins = recent.filter((m) => m.won).length;
  return wins / recent.length;
}

/**
 * Form confidence boost: high form = up to +10 confidence points.
 */
export function formConfidenceBoost(score: number): number {
  // score > 0.7 earns a boost; < 0.3 loses points
  if (score >= 0.7) return Math.round((score - 0.5) * 20); // 0–10
  if (score <= 0.3) return Math.round((score - 0.5) * 20); // -4 to 0
  return 0;
}
