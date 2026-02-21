function ZoneAnalyticsWidget({ zones, selectedZoneId, onZoneChange }) {
  if (!zones?.length) return null;

  return (
    <div className="flex flex-col gap-2">
      <label className="font-mono text-xs uppercase tracking-wider text-[#6b6358]">
        Zone Analytics
      </label>
      <select
        value={selectedZoneId || (zones[0]?.id ?? "")}
        onChange={(e) => onZoneChange(e.target.value)}
        className="w-full border border-border bg-card px-3 py-2 font-mono text-sm text-primary focus:border-border focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary/15"
      >
        <option value="">— Select zone —</option>
        {zones.map((z) => (
          <option key={z.id} value={z.id}>
            {z.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ZoneAnalyticsWidget;
