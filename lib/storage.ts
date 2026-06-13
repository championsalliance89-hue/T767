import fs   from "fs";
import path from "path";
import type { PredictionOutput, HistoryStore, HistoryEntry, Prediction } from "./types";

const isVercel = process.env.VERCEL === "1";
const runtimeDir = () => isVercel ? "/tmp/outputs" : path.join(process.cwd(), "outputs");
const ensure = (d: string) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };

// ── Date-keyed (primary) ──────────────────────────────────────────────────────

export function savePredictionsForDate(output: PredictionOutput, date: string): void {
  const dir = runtimeDir(); ensure(dir);
  fs.writeFileSync(path.join(dir, `${output.sport}-${date}.json`), JSON.stringify(output, null, 2), "utf-8");
  if (date === new Date().toISOString().split("T")[0]) archiveToHistory(output);
}

export function loadPredictionsForDate(sport: string, date: string): PredictionOutput | null {
  const fp = path.join(runtimeDir(), `${sport}-${date}.json`);
  if (!fs.existsSync(fp)) return null;
  try { return JSON.parse(fs.readFileSync(fp, "utf-8")); } catch { return null; }
}

// ── Backward-compat (today only) ─────────────────────────────────────────────

export function savePredictions(output: PredictionOutput): void {
  savePredictionsForDate(output, new Date().toISOString().split("T")[0]);
}

export function loadPredictions(sport: string): PredictionOutput | null {
  return loadPredictionsForDate(sport, new Date().toISOString().split("T")[0]);
}

// ── History ───────────────────────────────────────────────────────────────────

export function loadHistory(): HistoryStore {
  const fp = path.join(runtimeDir(), "history.json");
  if (fs.existsSync(fp)) try { return JSON.parse(fs.readFileSync(fp, "utf-8")); } catch {}
  return { entries: [], overall: { total: 0, correct: 0, incorrect: 0, accuracy: 0 } };
}

export function saveHistory(store: HistoryStore): void {
  const dir = runtimeDir(); ensure(dir);
  fs.writeFileSync(path.join(dir, "history.json"), JSON.stringify(store, null, 2), "utf-8");
}

function archiveToHistory(output: PredictionOutput): void {
  const date  = new Date(output.generatedAt).toISOString().split("T")[0];
  const store = loadHistory();
  const idx   = store.entries.findIndex(e => e.date === date && e.sport === output.sport);
  const stats = calcStats(output.predictions);
  const entry: HistoryEntry = { date, sport: output.sport, predictions: output.predictions, stats };
  if (idx >= 0) store.entries[idx] = entry; else store.entries.unshift(entry);
  store.entries = store.entries.slice(0, 120);
  store.overall = calcOverall(store.entries);
  saveHistory(store);
}

function calcStats(p: Prediction[]) {
  const t = p.length, c = p.filter(x => x.result === "correct").length,
    i = p.filter(x => x.result === "incorrect").length,
    pe = p.filter(x => !x.result || x.result === "pending").length, s = c + i;
  return { total: t, correct: c, incorrect: i, pending: pe, accuracy: s > 0 ? Math.round(c / s * 100) : 0 };
}

function calcOverall(entries: HistoryEntry[]) {
  const t = entries.reduce((s, e) => s + e.stats.total, 0),
    c = entries.reduce((s, e) => s + e.stats.correct, 0),
    i = entries.reduce((s, e) => s + e.stats.incorrect, 0), s = c + i;
  return { total: t, correct: c, incorrect: i, accuracy: s > 0 ? Math.round(c / s * 100) : 0 };
}

export function updatePredictionResult(
  sport: string, predictionId: string, result: "correct" | "incorrect" | "void"
): boolean {
  const date = new Date().toISOString().split("T")[0];
  const output = loadPredictionsForDate(sport, date);
  if (!output) return false;
  const pred = output.predictions.find(p => p.id === predictionId);
  if (!pred) return false;
  pred.result = result;
  savePredictionsForDate(output, date);
  return true;
}
