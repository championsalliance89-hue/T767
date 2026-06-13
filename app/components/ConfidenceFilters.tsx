"use client";

export type ConfidenceFilter = 90 | 80 | 70;

interface Props {
  active: ConfidenceFilter;
  onChange: (val: ConfidenceFilter) => void;
  counts: Record<ConfidenceFilter, number>;
}

const filters: { value: ConfidenceFilter; label: string }[] = [
  { value: 90, label: "90%+ Elite" },
  { value: 80, label: "80%+ High"  },
  { value: 70, label: "70%+ All"   },
];

export default function ConfidenceFilters({ active, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(({ value, label }) => {
        const isActive = active === value;
        return (
          <button key={value} onClick={() => onChange(value)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all duration-200"
            style={{
              background: isActive ? "rgba(234,126,45,0.12)" : "var(--bg-card)",
              border: isActive ? "1px solid rgba(234,126,45,0.5)" : "1px solid var(--border)",
              color: isActive ? "#ea7e2d" : "var(--text-secondary)",
              boxShadow: isActive ? "0 0 12px rgba(234,126,45,0.08)" : "none",
            }}
          >
            {label}
            <span className="px-1.5 py-0.5 rounded text-xs" style={{
              background: isActive ? "rgba(234,126,45,0.18)" : "var(--bg-raised)",
              color: isActive ? "#ea7e2d" : "var(--text-muted)",
            }}>
              {counts[value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
