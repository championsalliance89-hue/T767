"use client";

import { useEffect, useState } from "react";
import type { HistoryStore, HistoryEntry } from "@/lib/types";

export default function HistoryPanel() {
  const [store, setStore]     = useState<HistoryStore | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((d: HistoryStore) => { setStore(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map((i) => (
        <div key={i} className="h-16 rounded-xl shimmer" style={{ background: "var(--bg-card)" }} />
      ))}
    </div>
  );

  if (!store || store.entries.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <span className="text-4xl mb-4">📊</span>
      <h3 className="font-display tracking-wider text-lg mb-2" style={{ color: "var(--text-secondary)" }}>No History Yet</h3>
      <p className="text-sm text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
        Prediction history will appear here after results are recorded. Check back after matches complete.
      </p>
    </div>
  );

  const { overall } = store;
  const accuracyColor = overall.accuracy >= 60 ? "#22c55e" : overall.accuracy >= 45 ? "#f59e0b" : "#ef4444";

  return (
    <div className="space-y-5">
      {/* Overall stats */}
      <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <h3 className="font-display tracking-wider text-sm mb-4" style={{ color: "var(--text-muted)" }}>OVERALL PERFORMANCE</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Predictions", value: overall.total, color: "var(--blue-bright)" },
            { label: "Correct",           value: overall.correct,   color: "#22c55e" },
            { label: "Incorrect",         value: overall.incorrect, color: "#ef4444" },
            { label: "Accuracy",          value: `${overall.accuracy}%`, color: accuracyColor },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col gap-1 p-3 rounded-lg" style={{ background: "var(--bg-raised)" }}>
              <span className="font-mono font-medium" style={{ color, fontSize: "22px", lineHeight: 1 }}>{value}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
            </div>
          ))}
        </div>
        {/* Accuracy bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs mb-1.5" style={{ color: "var(--text-muted)" }}>
            <span>Accuracy rate</span><span style={{ color: accuracyColor }}>{overall.accuracy}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-raised)" }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${overall.accuracy}%`, background: `linear-gradient(90deg,${accuracyColor},${accuracyColor}80)` }} />
          </div>
        </div>
      </div>

      {/* Day-by-day entries */}
      <div className="space-y-3">
        {store.entries.map((entry) => {
          const key = `${entry.date}-${entry.sport}`;
          const isOpen = expanded === key;
          const acc = entry.stats.accuracy;
          const accColor = acc >= 60 ? "#22c55e" : acc >= 45 ? "#f59e0b" : "#ef4444";

          return (
            <div key={key} className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              {/* Row header */}
              <button
                className="w-full flex items-center justify-between px-4 py-3 gap-3"
                onClick={() => setExpanded(isOpen ? null : key)}
                style={{ textAlign: "left" }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: "18px" }}>{entry.sport === "tennis" ? "🎾" : "🏓"}</span>
                  <div>
                    <div className="font-mono text-sm" style={{ color: "var(--text-primary)" }}>
                      {new Date(entry.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {entry.sport === "tennis" ? "Tennis" : "Table Tennis"} · {entry.stats.total} predictions
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Mini stats */}
                  <div className="hidden sm:flex items-center gap-3 font-mono text-xs">
                    <span style={{ color: "#22c55e" }}>✓ {entry.stats.correct}</span>
                    <span style={{ color: "#ef4444" }}>✗ {entry.stats.incorrect}</span>
                    {entry.stats.pending > 0 && <span style={{ color: "#f59e0b" }}>⏳ {entry.stats.pending}</span>}
                  </div>
                  <span className="font-mono text-sm font-medium px-2 py-1 rounded" style={{ background: `${accColor}15`, color: accColor, border: `1px solid ${accColor}25` }}>
                    {acc > 0 ? `${acc}%` : "Pending"}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* Expanded predictions */}
              {isOpen && (
                <div className="border-t" style={{ borderColor: "var(--border)" }}>
                  {entry.predictions.map((pred) => {
                    const rColor = pred.result === "correct" ? "#22c55e" : pred.result === "incorrect" ? "#ef4444" : pred.result === "void" ? "#6b7280" : "#f59e0b";
                    const rIcon  = pred.result === "correct" ? "✓" : pred.result === "incorrect" ? "✗" : pred.result === "void" ? "–" : "⏳";
                    return (
                      <div key={pred.id} className="flex items-center justify-between px-4 py-3 gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                            {pred.fixture.player1Name} vs {pred.fixture.player2Name}
                          </div>
                          <div className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                            {pred.prediction}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{pred.confidence}%</span>
                          <span className="font-mono text-xs px-2 py-0.5 rounded-full" style={{ background: `${rColor}15`, color: rColor, border: `1px solid ${rColor}25` }}>
                            {rIcon} {pred.result ?? "pending"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
