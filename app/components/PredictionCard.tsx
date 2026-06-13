"use client";

import type { Prediction } from "@/lib/types";
import ConfidenceBadge from "./ConfidenceBadge";

interface Props { prediction: Prediction; index: number; }

const surfaceColors: Record<string, { color: string; label: string }> = {
  clay:   { color: "#e07c40", label: "Clay"   },
  grass:  { color: "#4ade80", label: "Grass"  },
  hard:   { color: "#60a5fa", label: "Hard"   },
  indoor: { color: "#a78bfa", label: "Indoor" },
};

const marketConfig = {
  total_games:  { icon: "⟷", tag: "TOTAL",  label: "Total Games" },
  match_winner: { icon: "🏆", tag: "WINNER", label: "Match Winner" },
};

const resultConfig = {
  correct:   { color: "#22c55e", icon: "✓", label: "Correct"   },
  incorrect: { color: "#ef4444", icon: "✗", label: "Incorrect" },
  void:      { color: "#6b7280", icon: "–", label: "Void"      },
  pending:   { color: "#f59e0b", icon: "⏳", label: "Pending"  },
};

export default function PredictionCard({ prediction, index }: Props) {
  const { fixture, market, prediction: label, confidence, tier, reasoning, result } = prediction;
  const surface = fixture.surface ? surfaceColors[fixture.surface] : null;
  const mCfg = marketConfig[market];
  const rCfg = result ? resultConfig[result] : null;

  const tierColor =
    tier === "elite" ? "#f59e0b" :
    tier === "high"  ? "#22c55e" : "#3b82f6";
  const tierBorder =
    tier === "elite" ? "rgba(245,158,11,0.25)" :
    tier === "high"  ? "rgba(34,197,94,0.2)"   : "rgba(59,130,246,0.15)";

  return (
    <article
      className="card-reveal rounded-xl overflow-hidden"
      style={{ animationDelay: `${index * 55}ms`, background: "var(--bg-card)", border: `1px solid ${tierBorder}` }}
    >
      <div className="h-0.5" style={{ background: `linear-gradient(90deg,${tierColor},transparent)` }} />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display tracking-wide leading-none mb-1 truncate" style={{ fontSize: "clamp(14px,2.5vw,17px)", color: "var(--text-primary)" }}>
              {fixture.player1Name}
              <span style={{ color: "var(--text-muted)", margin: "0 5px", fontFamily: "var(--font-body)", fontSize: "11px" }}>vs</span>
              {fixture.player2Name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs truncate" style={{ color: "var(--text-secondary)", maxWidth: "150px" }}>{fixture.tournament}</span>
              {fixture.round && (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--bg-raised)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>{fixture.round}</span>
              )}
              {surface && (
                <span className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ background: `${surface.color}15`, color: surface.color, border: `1px solid ${surface.color}30` }}>{surface.label}</span>
              )}
            </div>
          </div>
          <ConfidenceBadge confidence={confidence} tier={tier} />
        </div>

        {/* Prediction */}
        <div className="flex items-center gap-2.5 rounded-lg px-4 py-3 mb-3" style={{ background: "var(--bg-raised)", border: "1px solid var(--border)" }}>
          <span style={{ color: tierColor, fontSize: "15px" }}>{mCfg.icon}</span>
          <span className="font-display tracking-wider flex-1" style={{ color: tierColor, fontSize: "clamp(13px,2vw,15px)" }}>{label}</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: `${tierColor}15`, color: tierColor, border: `1px solid ${tierColor}25` }}>{mCfg.tag}</span>
        </div>

        {/* Confidence bar */}
        <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: "var(--bg-raised)" }}>
          <div className="h-full rounded-full confidence-bar" style={{ "--bar-width": `${confidence}%`, background: `linear-gradient(90deg,${tierColor},${tierColor}80)` } as React.CSSProperties} />
        </div>

        {/* Reasoning */}
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{reasoning}</p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
          <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
            {new Date(fixture.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {rCfg ? (
            <span className="font-mono text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: `${rCfg.color}15`, color: rCfg.color, border: `1px solid ${rCfg.color}30` }}>
              {rCfg.icon} {rCfg.label}
            </span>
          ) : (
            <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
              {new Date(fixture.scheduledAt).toLocaleDateString([], { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
