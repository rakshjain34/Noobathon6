const TOTAL_ZONES = 6;

function TerritoryAnalytics({ military, fireflies, infected }) {
  const militaryPct = Math.round((military / TOTAL_ZONES) * 100);
  const firefliesPct = Math.round((fireflies / TOTAL_ZONES) * 100);
  const infectedPct = Math.round((infected / TOTAL_ZONES) * 100);

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-2 shrink-0 font-mono text-xs uppercase tracking-wider text-[#6b6358]">
        Live Territory Analytics
      </h3>
      <div className="min-h-0 flex-1 space-y-3">
        <div className="flex items-center justify-between border-b border-[#2d2a24] pb-1.5 font-mono text-[11px]">
          <span className="text-secondary">Military (FEDRA)</span>
          <span className="font-medium text-primary">{militaryPct}%</span>
        </div>
        <div className="flex items-center justify-between border-b border-[#2d2a24] pb-1.5 font-mono text-[11px]">
          <span className="text-secondary">Fireflies</span>
          <span className="font-medium text-primary">{firefliesPct}%</span>
        </div>
        <div className="flex items-center justify-between border-b border-[#2d2a24] pb-1.5 font-mono text-[11px]">
          <span className="text-secondary">Overrun (Infected)</span>
          <span className="font-medium text-primary">{infectedPct}%</span>
        </div>
      </div>
    </div>
  );
}

export default TerritoryAnalytics;
