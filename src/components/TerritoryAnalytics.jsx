const TOTAL_ZONES = 6;

function TerritoryAnalytics({ military, fireflies, infected, listenMode, onSpeak }) {
  const militaryPct = Math.round((military / TOTAL_ZONES) * 100);
  const firefliesPct = Math.round((fireflies / TOTAL_ZONES) * 100);
  const infectedPct = Math.round((infected / TOTAL_ZONES) * 100);

  const rows = [
    { label: "Military (FEDRA)", value: militaryPct },
    { label: "Fireflies", value: firefliesPct },
    { label: "Overrun (Infected)", value: infectedPct },
  ];

  return (
    <div className="flex h-full flex-col">
      <h3
        className={`mb-2 shrink-0 font-mono text-xs uppercase tracking-wider text-[#6b6358] ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
        role={listenMode ? "button" : undefined}
        tabIndex={listenMode ? 0 : undefined}
        onClick={() => listenMode && onSpeak?.("Live territory analytics.")}
        onKeyDown={(e) => listenMode && onSpeak && (e.key === "Enter" || e.key === " ") && onSpeak("Live territory analytics.")}
      >
        Live Territory Analytics
      </h3>
      <div className="min-h-0 flex-1 space-y-3">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className={`flex items-center justify-between border-b border-[#2d2a24] pb-1.5 font-mono text-[11px] ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
            role={listenMode ? "button" : undefined}
            tabIndex={listenMode ? 0 : undefined}
            onClick={() => listenMode && onSpeak?.(`${label}: ${value} percent.`)}
            onKeyDown={(e) => listenMode && onSpeak && (e.key === "Enter" || e.key === " ") && onSpeak(`${label}: ${value} percent.`)}
          >
            <span className="text-secondary">{label}</span>
            <span className="font-medium text-primary">{value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TerritoryAnalytics;
