/**
 * Elo Rating Engine
 * Calculates win probability and updates ratings after a match.
 */

const K_FACTOR = 32; // standard K-factor for sports Elo

/**
 * Expected win probability for player A against player B.
 * Returns a value between 0 and 1.
 */
export function expectedScore(eloA: number, eloB: number): number {
  return 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
}

/**
 * Update Elo ratings after a match.
 * @returns [newEloA, newEloB]
 */
export function updateElo(
  eloA: number,
  eloB: number,
  scoreA: 1 | 0 | 0.5 // 1 = A won, 0 = B won, 0.5 = draw
): [number, number] {
  const expected = expectedScore(eloA, eloB);
  const newEloA = eloA + K_FACTOR * (scoreA - expected);
  const newEloB = eloB + K_FACTOR * (1 - scoreA - (1 - expected));
  return [Math.round(newEloA), Math.round(newEloB)];
}

/**
 * Calculate Elo-based win probability as a percentage (0–100).
 */
export function eloWinProbability(eloA: number, eloB: number): number {
  return Math.round(expectedScore(eloA, eloB) * 100);
}

/**
 * Normalise an Elo advantage into a confidence boost.
 * Returns a value between 0 and 15 (percentage points bonus).
 */
export function eloConfidenceBoost(eloA: number, eloB: number): number {
  const diff = Math.abs(eloA - eloB);
  // cap boost at 400 Elo difference = 15 pts
  return Math.min(15, Math.round((diff / 400) * 15));
}
