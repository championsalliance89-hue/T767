/**
 * STNL Prediction Engine v7
 *
 * Tennis:       Match Winner (straight win) + Total Games Over/Under
 * Table Tennis: Match Winner (straight win) ONLY
 */

import type { Fixture, Prediction, ConfidenceTier } from "./types";
import { expectedScore, eloConfidenceBoost } from "./elo";
import { formScore, formConfidenceBoost } from "./form";
import { analyseH2H, h2hConfidenceBoost, h2hHighSetProbability } from "./h2h";

function tier(c: number): ConfidenceTier {
  return c >= 90 ? "elite" : c >= 80 ? "high" : c >= 70 ? "medium" : "low";
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function surfaceElo(player: Fixture["player1"], surface?: string): number {
  if (!surface || !player.eloSurface) return player.eloRating;
  return player.eloSurface[surface as keyof typeof player.eloSurface] ?? player.eloRating;
}

// ── Match Winner ──────────────────────────────────────────────────────────────

function predictWinner(fixture: Fixture): Prediction[] {
  const { player1: p1, player2: p2, surface } = fixture;
  const e1  = surfaceElo(p1, surface);
  const e2  = surfaceElo(p2, surface);
  const ep1 = expectedScore(e1, e2);
  const f1  = formScore(p1.recentForm);
  const f2  = formScore(p2.recentForm);
  const h2h = analyseH2H(fixture.headToHead, p1.id);

  const combined = ep1 * 0.55 + f1 * 0.25 + h2h.player1WinRate * 0.20;
  const p1wins   = combined >= 0.5;
  const winner   = p1wins ? p1 : p2;
  const loser    = p1wins ? p2 : p1;
  const prob     = p1wins ? combined : 1 - combined;
  const wf       = p1wins ? f1 : f2;
  const we       = p1wins ? e1 : e2;
  const le       = p1wins ? e2 : e1;

  let conf = clamp(Math.round(50 + (prob - 0.5) * 90), 50, 97);
  conf += eloConfidenceBoost(e1, e2) * (p1wins ? 1 : -1);
  conf += h2hConfidenceBoost(h2h, p1wins);
  conf += formConfidenceBoost(wf);
  conf = clamp(Math.round(conf), 50, 97);
  if (conf < 70) return [];

  const h2hStr = h2h.totalMatches > 0
    ? `H2H: ${p1wins ? h2h.player1Wins : h2h.player2Wins}–${p1wins ? h2h.player2Wins : h2h.player1Wins} in favour.`
    : "No H2H data.";

  return [{
    id: uid(`${fixture.sport}-mw`),
    sport: fixture.sport,
    fixture: {
      id: fixture.id, tournament: fixture.tournament, round: fixture.round,
      player1Name: p1.name, player2Name: p2.name,
      surface: fixture.surface, scheduledAt: fixture.scheduledAt,
    },
    market: "match_winner",
    prediction: `${winner.name} to Win`,
    confidence: conf, tier: tier(conf),
    reasoning: `${winner.name} (Elo ${we}) leads on Elo, form (${Math.round(wf * 100)}%) and H2H. ${h2hStr} Win probability: ${Math.round(prob * 100)}%. ${loser.name} Elo ${le}.`,
    generatedAt: new Date().toISOString(),
  }];
}

// ── Total Games Over/Under (Tennis ONLY) ──────────────────────────────────────

const TENNIS_LINES = [20.5, 22.5, 24.5];

function predictTotalGames(fixture: Fixture): Prediction[] {
  if (fixture.sport !== "tennis") return []; // Table tennis: NO over/under

  const { player1: p1, player2: p2, surface, headToHead } = fixture;
  const e1   = surfaceElo(p1, surface);
  const e2   = surfaceElo(p2, surface);
  const comp = 1 - Math.abs(expectedScore(e1, e2) - 0.5) * 2;
  const f1   = formScore(p1.recentForm);
  const f2   = formScore(p2.recentForm);
  const h2h  = analyseH2H(headToHead, p1.id);
  const hsp  = h2hHighSetProbability(h2h);

  const predicted =
    (p1.avgGamesPerMatch + p2.avgGamesPerMatch) / 2 * 0.45 +
    (h2h.avgGamesPlayed || 21) * 0.30 +
    comp * 26 * 0.25;

  const results: Prediction[] = [];

  for (const line of TENNIS_LINES) {
    const isOver = predicted > line;
    const diff   = Math.abs(predicted - line);
    let conf = 56 + diff * 3.8;
    conf += isOver ? comp * 9 + hsp * 7 : (1 - comp) * 9 + (1 - hsp) * 7;
    conf += formConfidenceBoost((f1 + f2) / 2);
    conf = clamp(Math.round(conf), 50, 97);
    if (conf < 70) continue;

    const label = `${isOver ? "Over" : "Under"} ${line}`;
    results.push({
      id: uid("tennis-tg"),
      sport: "tennis",
      fixture: {
        id: fixture.id, tournament: fixture.tournament, round: fixture.round,
        player1Name: p1.name, player2Name: p2.name,
        surface: fixture.surface, scheduledAt: fixture.scheduledAt,
      },
      market: "total_games",
      prediction: label,
      confidence: conf, tier: tier(conf),
      reasoning: `Predicted ${predicted.toFixed(1)} total games (line ${line}). ${comp > 0.6 ? "Closely matched — longer match expected." : "Elo gap suggests fewer games."} ${p1.name} form ${Math.round(f1 * 100)}% · ${p2.name} form ${Math.round(f2 * 100)}%.`,
      generatedAt: new Date().toISOString(),
    });
  }

  return results;
}

// ── Exports ───────────────────────────────────────────────────────────────────

export function generatePredictions(fixture: Fixture): Prediction[] {
  return [...predictWinner(fixture), ...predictTotalGames(fixture)].filter(p => p.confidence >= 70);
}

export function generateAllPredictions(fixtures: Fixture[]): Prediction[] {
  return fixtures.flatMap(generatePredictions);
}
