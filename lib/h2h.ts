import type { HeadToHead } from "./types";

export interface H2HAnalysis {
  totalMatches: number;
  player1Wins: number;
  player2Wins: number;
  player1WinRate: number;
  avgSetsPlayed: number;
  avgGamesPlayed: number;
  highSetRatioMatches: number;
  lowSetRatioMatches: number;
}

export function analyseH2H(
  h2h: HeadToHead,
  player1Id: string,
  highSetThreshold = 3
): H2HAnalysis {
  const matches = h2h.matches;

  if (matches.length === 0) {
    return {
      totalMatches: 0,
      player1Wins: 0,
      player2Wins: 0,
      player1WinRate: 0.5,
      avgSetsPlayed: 3,
      avgGamesPlayed: 21,
      highSetRatioMatches: 0,
      lowSetRatioMatches: 0,
    };
  }

  const player1Wins = matches.filter((m) => m.winnerId === player1Id).length;
  const player2Wins = matches.length - player1Wins;
  const totalSets  = matches.reduce((sum, m) => sum + m.setsPlayed, 0);
  const totalGames = matches.reduce((sum, m) => sum + (m.totalGames ?? m.setsPlayed * 6.5), 0);

  return {
    totalMatches: matches.length,
    player1Wins,
    player2Wins,
    player1WinRate: player1Wins / matches.length,
    avgSetsPlayed: totalSets / matches.length,
    avgGamesPlayed: totalGames / matches.length,
    highSetRatioMatches: matches.filter((m) => m.setsPlayed >= highSetThreshold).length,
    lowSetRatioMatches:  matches.filter((m) => m.setsPlayed < highSetThreshold).length,
  };
}

export function h2hConfidenceBoost(
  analysis: H2HAnalysis,
  player1IsHigher: boolean
): number {
  if (analysis.totalMatches === 0) return 0;
  const dominance = player1IsHigher ? analysis.player1WinRate : 1 - analysis.player1WinRate;
  const sampleWeight = Math.min(1, analysis.totalMatches / 5);
  return Math.round((dominance - 0.5) * 20 * sampleWeight);
}

export function h2hHighSetProbability(analysis: H2HAnalysis): number {
  if (analysis.totalMatches === 0) return 0.5;
  return analysis.highSetRatioMatches / analysis.totalMatches;
}
