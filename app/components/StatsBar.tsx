"use client";

import type { Prediction } from "@/lib/types";

interface Props {
  predictions: Prediction[];
  generatedAt: string;
}

export default function StatsBar({ predictions, generatedAt }: Props) {
  const elite  = predictions.filter((p) => p.tier === "elite").length;
  const high   = predictions.filter((p) => p.tier === "high").length;
  const medium = predictions.filter((p) => p.tier === "medium").length;
  const total  = predictions.length;

  const avgConf = total > 0
    ? Math.round(predictions.reduce((s, p) => s + p.confidence, 0) / total)
    : 0;

  const stats = [
    { label: "Total",        value: total,    color: "var(--blue-bright)" },
    { label: "Elite 90%+",   value: elite,    color: "#f59e0b"            },
    { label: "High 80%+",    value: high,     color: "#22c55e"            },
    { label: "Medium 70%+",  value: medium,   color: "#3b82f6"            },
    { label: "Avg Confidence", value: `${avgConf}%`, color: "var(--text-primary)" },
  ];

  return (
    <div
      className="rounded-xl p-4 flex flex-wrap gap-6 items-center justify-between"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <div className="flex flex-wrap gap-6">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="flex flex-col gap-0.5">
            <span
              className="font-mono font-medium tabular-nums"
              style={{ color, fontSize: "20px", lineHeight: 1 }}
            >
              {value}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-end gap-0.5">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          Generated
        </span>
        <span className="font-mono text-xs" style={{ color: "var(--text-secondary)" }}>
          {new Date(generatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          {" · "}
          {new Date(generatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}
