"use client";

import type { Sport } from "@/lib/types";

interface Props {
  active: Sport;
  onChange: (s: Sport) => void;
  counts: Record<Sport, number>;
}

export default function SportTabs({ active, onChange, counts }: Props) {
  const tabs = [
    { value: "tennis"       as Sport, icon: "🎾", label: "Tennis"       },
    { value: "table-tennis" as Sport, icon: "🏓", label: "Table Tennis" },
  ];
  return (
    <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      {tabs.map(({ value, icon, label }) => {
        const isActive = active === value;
        return (
          <button key={value} onClick={() => onChange(value)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-body font-medium text-sm transition-all duration-200 flex-1 justify-center"
            style={{
              background: isActive ? "rgba(234,126,45,0.1)" : "transparent",
              color:      isActive ? "var(--text-primary)"  : "var(--text-muted)",
              border:     isActive ? "1px solid rgba(234,126,45,0.3)" : "1px solid transparent",
            }}
          >
            <span>{icon}</span><span>{label}</span>
            {counts[value] > 0 && (
              <span className="font-mono text-xs px-1.5 py-0.5 rounded-full" style={{
                background: isActive ? "rgba(234,126,45,0.18)" : "var(--bg-raised)",
                color:      isActive ? "#ea7e2d" : "var(--text-muted)",
              }}>
                {counts[value]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
