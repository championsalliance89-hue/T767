"use client";

import { useState, useEffect, useCallback } from "react";
import type { Prediction, PredictionOutput, Sport } from "@/lib/types";
import MatchCard from "./MatchCard";
import ConfidenceFilters, { type ConfidenceFilter } from "./ConfidenceFilters";
import SportTabs from "./SportTabs";
import StatsBar from "./StatsBar";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
import HistoryPanel from "./HistoryPanel";

type MainTab = "predictions" | "history";

interface MatchGroup {
  fixtureId:     string;
  winner:        Prediction;
  totals:        Prediction[];
  maxConfidence: number;
}

function groupByMatch(predictions: Prediction[]): MatchGroup[] {
  const map = new Map<string, MatchGroup>();
  for (const p of predictions) {
    const key = p.fixture.id;
    if (!map.has(key)) {
      map.set(key, { fixtureId: key, winner: p, totals: [], maxConfidence: 0 });
    }
    const g = map.get(key)!;
    if (p.market === "match_winner") g.winner = p;
    else g.totals.push(p);
    g.maxConfidence = Math.max(g.maxConfidence, p.confidence);
  }
  return Array.from(map.values()).sort((a, b) => b.maxConfidence - a.maxConfidence);
}

function getTodayAndNext3(): string[] {
  return Array.from({ length: 3 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

function dayLabel(dateStr: string): string {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d     = new Date(dateStr); d.setHours(0, 0, 0, 0);
  const diff  = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return "Day 3";
}

export default function Dashboard() {
  const [mainTab,       setMainTab]       = useState<MainTab>("predictions");
  const [activeSport,   setActiveSport]   = useState<Sport>("tennis");
  const [activeDate,    setActiveDate]    = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [confidenceMin, setConfMin]       = useState<ConfidenceFilter>(70);
  const [cache,         setCache]         = useState<Record<string, PredictionOutput>>({});
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState<string | undefined>();

  const cacheKey = `${activeSport}||${activeDate}`;

  const load = useCallback(async (sport: Sport, date: string) => {
    const key = `${sport}||${date}`;
    if (cache[key]) return;
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch(`/api/predictions/${sport}?date=${date}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PredictionOutput = await res.json();
      setCache(prev => ({ ...prev, [key]: data }));
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [cache]);

  useEffect(() => { load(activeSport, activeDate); }, [activeSport, activeDate]);

  const current      = cache[cacheKey];
  const allPreds     = current?.predictions ?? [];
  const filtered     = allPreds.filter(p => p.confidence >= confidenceMin);
  const matchGroups  = groupByMatch(filtered);
  const dates        = getTodayAndNext3();

  const sportCounts: Record<Sport, number> = {
    tennis:         cache[`tennis||${activeDate}`]?.predictions.length       ?? 0,
    "table-tennis": cache[`table-tennis||${activeDate}`]?.predictions.length ?? 0,
  };

  const confCounts: Record<ConfidenceFilter, number> = {
    90: allPreds.filter(p => p.confidence >= 90).length,
    80: allPreds.filter(p => p.confidence >= 80).length,
    70: allPreds.filter(p => p.confidence >= 70).length,
  };

  return (
    <div className="min-h-screen relative z-10">

      {/* Header */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 py-3"
        style={{ background:"rgba(5,10,20,0.93)", backdropFilter:"blur(18px)",
          WebkitBackdropFilter:"blur(18px)", borderBottom:"1px solid var(--border)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0"
              style={{ width:38, height:38, background:"linear-gradient(135deg,#ea7e2d,#1a3a6b)",
                border:"1px solid rgba(234,126,45,0.4)" }}>
              <span className="font-display text-white" style={{ fontSize:"16px", letterSpacing:"0.05em" }}>ST</span>
            </div>
            <div>
              <div style={{ fontSize:"clamp(11px,2vw,14px)" }}>
                <span className="font-display tracking-widest" style={{ color:"#ea7e2d" }}>SAHARA</span>
                <span className="font-display tracking-widest" style={{ color:"var(--text-primary)", marginLeft:"5px" }}>TECHNOLOGIES</span>
              </div>
              <div className="font-mono" style={{ fontSize:"9px", color:"var(--text-muted)", letterSpacing:"0.12em" }}>
                NIGERIA LIMITED · SPORTS ANALYTICS
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg"
            style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
            {(["predictions","history"] as MainTab[]).map(tab => (
              <button key={tab} onClick={() => setMainTab(tab)}
                className="px-3 py-1.5 rounded-md font-mono text-xs transition-all"
                style={{
                  background: mainTab===tab ? "rgba(234,126,45,0.12)" : "transparent",
                  color:      mainTab===tab ? "#ea7e2d" : "var(--text-muted)",
                  border:     mainTab===tab ? "1px solid rgba(234,126,45,0.3)" : "1px solid transparent",
                }}>
                {tab === "predictions" ? "📊 Predictions" : "📋 History"}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs"
            style={{ background:"var(--bg-card)", border:"1px solid var(--border)", color:"var(--text-secondary)" }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background:"#22c55e", boxShadow:"0 0 6px #22c55e" }} />
            {new Date().toLocaleDateString("en-US", { weekday:"short", month:"short", day:"numeric" })}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        <div>
          <h2 className="font-display tracking-wider mb-1"
            style={{ fontSize:"clamp(20px,4vw,32px)", color:"var(--text-primary)" }}>
            {mainTab === "predictions" ? "TODAY'S PREDICTIONS" : "PREDICTION HISTORY"}
          </h2>
          <p className="text-sm" style={{ color:"var(--text-muted)" }}>
            {mainTab === "predictions"
              ? "Straight win predictions for Tennis and Table Tennis — updated daily"
              : "Historical predictions with accuracy tracking"}
          </p>
        </div>

        {mainTab === "predictions" && (
          <>
            {/* Sport tabs */}
            <SportTabs active={activeSport} onChange={setActiveSport} counts={sportCounts} />

            {/* Day tabs */}
            <div className="flex gap-1 p-1 rounded-xl"
              style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
              {dates.map((dateStr) => {
                const isActive = activeDate === dateStr;
                return (
                  <button key={dateStr} onClick={() => setActiveDate(dateStr)}
                    className="flex-1 flex flex-col items-center py-2 px-2 rounded-lg transition-all"
                    style={{
                      background: isActive ? "rgba(234,126,45,0.12)" : "transparent",
                      border:     isActive ? "1px solid rgba(234,126,45,0.3)" : "1px solid transparent",
                    }}>
                    <span className="font-display tracking-wider text-sm"
                      style={{ color: isActive ? "#ea7e2d" : "var(--text-muted)" }}>
                      {dayLabel(dateStr)}
                    </span>
                    <span className="font-mono" style={{ fontSize:"10px",
                      color: isActive ? "rgba(234,126,45,0.7)" : "var(--text-muted)" }}>
                      {new Date(dateStr).toLocaleDateString([], { month:"short", day:"numeric" })}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stats */}
            {current && <StatsBar predictions={allPreds} generatedAt={current.generatedAt} />}

            {/* Confidence */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-sm font-mono" style={{ color:"var(--text-muted)" }}>CONFIDENCE:</span>
              <ConfidenceFilters active={confidenceMin} onChange={setConfMin} counts={confCounts} />
            </div>

            {/* Content */}
            {loading && <LoadingSkeleton />}

            {error && !loading && (
              <div className="rounded-xl p-6 text-center"
                style={{ background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-sm mb-3" style={{ color:"#ef4444" }}>Failed to load predictions.</p>
                <button
                  onClick={() => { setCache(p => { const n={...p}; delete n[cacheKey]; return n; }); load(activeSport, activeDate); }}
                  className="px-4 py-2 rounded-lg text-sm font-mono"
                  style={{ background:"rgba(239,68,68,0.1)", color:"#ef4444", border:"1px solid rgba(239,68,68,0.3)" }}>
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && matchGroups.length === 0 && (
              <EmptyState sport={activeSport} filter={confidenceMin} />
            )}

            {!loading && !error && matchGroups.length > 0 && (
              <>
                <p className="text-xs font-mono" style={{ color:"var(--text-muted)" }}>
                  {matchGroups.length} matches · sorted by confidence
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {matchGroups.map((g, i) => (
                    <MatchCard key={g.fixtureId} winner={g.winner} totals={g.totals} index={i} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {mainTab === "history" && <HistoryPanel />}

        <div className="rounded-xl p-4 text-center"
          style={{ background:"var(--bg-card)", border:"1px solid var(--border)" }}>
          <p className="text-xs leading-relaxed" style={{ color:"var(--text-muted)" }}>
            Sahara Technologies Nigeria Limited · STNL Sports Analytics.
            Predictions use real 2026 ATP/WTA match data, Elo ratings, form and H2H.
            For informational purposes only. Confidence ≥ 70% shown.
          </p>
        </div>
      </main>
    </div>
  );
}
