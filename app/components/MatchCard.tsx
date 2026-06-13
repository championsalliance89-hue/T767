"use client";
import type { Prediction } from "@/lib/types";

interface Props { winner: Prediction; totals: Prediction[]; index: number; }

const SC: Record<string, string> = {
  clay:"#e07c40", grass:"#4ade80", hard:"#60a5fa", indoor:"#a78bfa"
};

function tierColor(t: string) {
  return t === "elite" ? "#f59e0b" : t === "high" ? "#22c55e" : "#3b82f6";
}

function tierBorder(t: string) {
  return t === "elite" ? "rgba(245,158,11,0.25)"
       : t === "high"  ? "rgba(34,197,94,0.2)"
       :                 "rgba(59,130,246,0.18)";
}

function ResultBadge({ result }: { result?: string }) {
  if (!result || result === "pending") return null;
  const cfg = {
    correct:   { c:"#22c55e", label:"✓ Correct"   },
    incorrect: { c:"#ef4444", label:"✗ Incorrect" },
    void:      { c:"#6b7280", label:"– Void"      },
  }[result as "correct"|"incorrect"|"void"];
  if (!cfg) return null;
  return (
    <span style={{ fontSize:11, padding:"2px 8px", borderRadius:999, fontFamily:"monospace",
      background:`${cfg.c}20`, color:cfg.c, border:`1px solid ${cfg.c}40` }}>
      {cfg.label}
    </span>
  );
}

export default function MatchCard({ winner, index }: Props) {
  const { fixture } = winner;
  const surf = fixture.surface ? SC[fixture.surface] : null;
  const wc   = tierColor(winner.tier);
  const wb   = tierBorder(winner.tier);

  return (
    <article className="card-reveal rounded-xl overflow-hidden"
      style={{ animationDelay:`${index * 55}ms`, background:"var(--bg-card)", border:`1px solid ${wb}` }}>

      {/* Top accent line */}
      <div className="h-0.5" style={{ background:`linear-gradient(90deg,${wc},transparent)` }} />

      <div className="p-4">
        {/* Match header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display tracking-wide leading-none mb-1 truncate"
              style={{ fontSize:"clamp(13px,2.5vw,16px)", color:"var(--text-primary)" }}>
              {fixture.player1Name}
              <span style={{ color:"var(--text-muted)", margin:"0 5px", fontSize:11 }}>vs</span>
              {fixture.player2Name}
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono truncate"
                style={{ fontSize:11, color:"var(--text-secondary)", maxWidth:150 }}>
                {fixture.tournament}
              </span>
              {fixture.round && (
                <span className="font-mono"
                  style={{ fontSize:10, padding:"1px 5px", borderRadius:4,
                    background:"var(--bg-raised)", color:"var(--text-muted)", border:"1px solid var(--border)" }}>
                  {fixture.round}
                </span>
              )}
              {surf && (
                <span className="font-mono"
                  style={{ fontSize:10, padding:"1px 5px", borderRadius:4,
                    background:`${surf}18`, color:surf, border:`1px solid ${surf}35` }}>
                  {fixture.surface}
                </span>
              )}
            </div>
          </div>
          <span className="font-mono flex-shrink-0" style={{ fontSize:11, color:"var(--text-muted)" }}>
            {new Date(fixture.scheduledAt).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
          </span>
        </div>

        {/* Prediction pill */}
        <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 mb-2"
          style={{ background:"var(--bg-raised)", border:`1px solid ${wc}30` }}>
          <span style={{ color:wc, fontSize:16 }}>🏆</span>
          <span className="font-display tracking-wider flex-1"
            style={{ color:wc, fontSize:"clamp(12px,2vw,15px)" }}>
            {winner.prediction}
          </span>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="font-mono"
              style={{ fontSize:11, padding:"2px 8px", borderRadius:6,
                background:`${wc}18`, color:wc, border:`1px solid ${wc}30` }}>
              {winner.confidence}% {winner.tier.toUpperCase()}
            </span>
            <ResultBadge result={winner.result} />
          </div>
        </div>

        {/* Confidence bar */}
        <div className="h-1.5 rounded-full mb-3 overflow-hidden"
          style={{ background:"var(--bg-raised)" }}>
          <div className="h-full rounded-full confidence-bar"
            style={{
              "--bar-width": `${winner.confidence}%`,
              background: `linear-gradient(90deg,${wc},${wc}70)`,
            } as React.CSSProperties} />
        </div>

        {/* Reasoning */}
        <p style={{ fontSize:11, lineHeight:1.6, color:"var(--text-muted)" }}>
          {winner.reasoning}
        </p>
      </div>
    </article>
  );
}
