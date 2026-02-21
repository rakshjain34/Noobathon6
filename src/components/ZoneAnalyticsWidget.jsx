function ZoneAnalyticsWidget({ zones, selectedZoneId, onZoneChange, listenMode, onSpeakZone }) {
  if (!zones?.length) return null;

  const handleChange = (e) => {
    const id = e.target.value;
    onZoneChange(id);
    if (listenMode && onSpeakZone && id) {
      const zone = zones.find((z) => z.id === id);
      if (zone) onSpeakZone(zone);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        className={`font-mono text-xs uppercase tracking-wider text-[#6b6358] ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
        role={listenMode ? "button" : undefined}
        tabIndex={listenMode ? 0 : undefined}
        onClick={() => listenMode && onSpeakZone && onSpeakZone(zones.find((z) => z.id === selectedZoneId) || zones[0])}
        onKeyDown={(e) => listenMode && onSpeakZone && (e.key === "Enter" || e.key === " ") && onSpeakZone(zones.find((z) => z.id === selectedZoneId) || zones[0])}
      >
        Zone Analytics
      </label>
      <select
        value={selectedZoneId || (zones[0]?.id ?? "")}
        onChange={handleChange}
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
