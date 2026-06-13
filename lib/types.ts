// ─── Sport Types ─────────────────────────────────────────────────────────────

export type Sport = "tennis" | "table-tennis";

export type TennisSurface = "hard" | "clay" | "grass" | "indoor";

// ─── Player & Match Data ──────────────────────────────────────────────────────

export interface PlayerStats {
  id: string;
  name: string;
  eloRating: number;
  eloSurface?: Record<TennisSurface, number>;
  recentForm: MatchResult[];
  setsWon: number;
  setsLost: number;
  totalMatches: number;
  avgSetsPerMatch: number;
  // Total games stats (for Total Games O/U market)
  avgGamesPerMatch: number;   // e.g. 22.4 games per match (tennis: games in sets)
  gamesWonPct: number;        // 0–1, % of games won
}

export interface MatchResult {
  opponentId: string;
  won: boolean;
  setsPlayed: number;
  setsWon: number;
  setsLost: number;
  totalGames: number;         // total games played in the match
  surface?: TennisSurface;
  date: string;
}

export interface HeadToHead {
  player1Id: string;
  player2Id: string;
  matches: H2HMatch[];
}

export interface H2HMatch {
  winnerId: string;
  setsPlayed: number;
  totalGames: number;
  date: string;
  surface?: TennisSurface;
}

export interface Fixture {
  id: string;
  sport: Sport;
  tournament: string;
  round?: string;
  player1: PlayerStats;
  player2: PlayerStats;
  surface?: TennisSurface;
  scheduledAt: string;
  headToHead: HeadToHead;
}

// ─── Prediction Types ─────────────────────────────────────────────────────────

export type PredictionMarket = "total_games" | "match_winner";

export type ConfidenceTier = "elite" | "high" | "medium" | "low";

export interface Prediction {
  id: string;
  sport: Sport;
  fixture: {
    id: string;
    tournament: string;
    round?: string;
    player1Name: string;
    player2Name: string;
    surface?: TennisSurface;
    scheduledAt: string;
  };
  market: PredictionMarket;
  prediction: string;
  confidence: number;
  tier: ConfidenceTier;
  reasoning: string;
  generatedAt: string;
  result?: PredictionResult;  // filled in after match
}

export type PredictionResult = "correct" | "incorrect" | "void" | "pending";

export interface PredictionOutput {
  generatedAt: string;
  sport: Sport;
  predictions: Prediction[];
}

// ─── History Types ────────────────────────────────────────────────────────────

export interface HistoryEntry {
  date: string;          // "2025-06-04"
  sport: Sport;
  predictions: Prediction[];
  stats: {
    total: number;
    correct: number;
    incorrect: number;
    pending: number;
    accuracy: number;  // 0–100
  };
}

export interface HistoryStore {
  entries: HistoryEntry[];
  overall: {
    total: number;
    correct: number;
    incorrect: number;
    accuracy: number;
  };
}
