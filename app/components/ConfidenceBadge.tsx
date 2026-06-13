"use client";

import type { ConfidenceTier } from "@/lib/types";

interface Props {
  confidence: number;
  tier: ConfidenceTier;
  size?: "sm" | "md";
}

const tierConfig: Record<ConfidenceTier, { label: string; color: string; bg: string; border: string }> = {
  elite:  { label: "ELITE",  color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.35)" },
  high:   { label: "HIGH",   color: "#22c55e", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.35)"  },
  medium: { label: "MED",    color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.35)" },
  low:    { label: "LOW",    color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.3)" },
};

export default function ConfidenceBadge({ confidence, tier, size = "md" }: Props) {
  const cfg = tierConfig[tier];
  const isLg = size === "md";

  return (
    <div
      className="flex items-center gap-2 rounded-full px-3"
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        paddingTop: isLg ? "5px" : "3px",
        paddingBottom: isLg ? "5px" : "3px",
      }}
    >
      {/* Dot indicator */}
      <span
        className="rounded-full flex-shrink-0"
        style={{
          width: isLg ? 7 : 5,
          height: isLg ? 7 : 5,
          background: cfg.color,
          boxShadow: `0 0 6px ${cfg.color}`,
        }}
      />
      <span
        className="font-mono font-medium tabular-nums"
        style={{
          color: cfg.color,
          fontSize: isLg ? "14px" : "11px",
          letterSpacing: "0.02em",
        }}
      >
        {confidence}%
      </span>
      <span
        className="font-mono"
        style={{
          color: cfg.color,
          opacity: 0.7,
          fontSize: isLg ? "10px" : "9px",
          letterSpacing: "0.1em",
        }}
      >
        {cfg.label}
      </span>
    </div>
  );
}
