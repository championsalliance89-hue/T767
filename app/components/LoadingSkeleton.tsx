export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <div className="h-0.5 shimmer" />
          <div className="p-5 space-y-3">
            {/* Players */}
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-4 rounded shimmer w-3/4" />
                <div className="h-3 rounded shimmer w-1/2" />
              </div>
              <div className="h-7 w-24 rounded-full shimmer ml-4" />
            </div>
            {/* Prediction label */}
            <div className="h-10 rounded-lg shimmer" />
            {/* Bar */}
            <div className="h-1.5 rounded shimmer" />
            {/* Reasoning */}
            <div className="space-y-1.5">
              <div className="h-3 rounded shimmer" />
              <div className="h-3 rounded shimmer w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
