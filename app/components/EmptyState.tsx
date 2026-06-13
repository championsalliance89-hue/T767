interface Props {
  sport: string;
  filter: number;
}

export default function EmptyState({ sport, filter }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 rounded-xl"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <span className="text-5xl mb-4">{sport === "tennis" ? "🎾" : "🏓"}</span>
      <h3
        className="font-display tracking-wider text-xl mb-2"
        style={{ color: "var(--text-secondary)" }}
      >
        No Predictions
      </h3>
      <p className="text-sm text-center max-w-xs" style={{ color: "var(--text-muted)" }}>
        No {sport} predictions with {filter}%+ confidence today.
        Try lowering the confidence filter or check back after 06:00 UTC.
      </p>
    </div>
  );
}
