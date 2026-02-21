function GameActions({
  selectedZone,
  inventory,
  onSupplyMedical,
  onReinforce,
  onNextTurn,
  turn,
  canSupply,
  canReinforce,
  stabilizedCount = 0,
  overrunCount = 0,
  currentTarget,
  listenMode,
  onSpeak,
}) {
  const objectiveText = `Objective: Stabilize 2 zones below 40%. ${stabilizedCount} of 2. Overrun: ${overrunCount} of 4.`;

  return (
    <div className="flex flex-col gap-3 border border-border bg-card p-4">
      <div
        className={`flex items-center justify-between border-b border-border pb-2 font-mono text-xs ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
        role={listenMode ? "button" : undefined}
        tabIndex={listenMode ? 0 : undefined}
        onClick={() => listenMode && onSpeak?.(`Turn ${turn}.`)}
        onKeyDown={(e) => listenMode && onSpeak && (e.key === "Enter" || e.key === " ") && onSpeak(`Turn ${turn}.`)}
      >
        <span className="text-secondary">Turn</span>
        <span className="font-medium text-primary">{turn}</span>
      </div>
      {currentTarget && (
        <p
          className={`font-mono text-[11px] text-primary ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
          role={listenMode ? "button" : undefined}
          tabIndex={listenMode ? 0 : undefined}
          onClick={() => listenMode && onSpeak?.(`Current target: ${currentTarget.text}. ${currentTarget.current} of ${currentTarget.target}.`)}
          onKeyDown={(e) => listenMode && onSpeak && (e.key === "Enter" || e.key === " ") && onSpeak(`Current target: ${currentTarget.text}. ${currentTarget.current} of ${currentTarget.target}.`)}
        >
          Target: {currentTarget.text} ({currentTarget.current}/{currentTarget.target})
        </p>
      )}
      <p
        className={`font-mono text-[11px] text-secondary ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
        role={listenMode ? "button" : undefined}
        tabIndex={listenMode ? 0 : undefined}
        onClick={() => listenMode && onSpeak?.(objectiveText)}
        onKeyDown={(e) => listenMode && onSpeak && (e.key === "Enter" || e.key === " ") && onSpeak(objectiveText)}
      >
        Objective: Stabilize 2 zones &lt;40% ({stabilizedCount}/2). Overrun: {overrunCount}/4.
      </p>
      <div className="space-y-2">
        <button
          type="button"
          onClick={(e) => {
            if (listenMode && onSpeak) onSpeak(`Supply medical. Cost: 1 medkit. Target zone: ${selectedZone?.name ?? "none"}.`);
            onSupplyMedical?.();
          }}
          disabled={!selectedZone || !canSupply}
          className="w-full border border-border bg-card py-2 font-mono text-xs uppercase text-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Supply Medical (1 medkit) → {selectedZone?.name ?? "—"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            if (listenMode && onSpeak) onSpeak(`Reinforce. Cost: 5 ammo. Target zone: ${selectedZone?.name ?? "none"}.`);
            onReinforce?.();
          }}
          disabled={!selectedZone || !canReinforce}
          className="w-full border border-border bg-card py-2 font-mono text-xs uppercase text-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reinforce (5 ammo) → {selectedZone?.name ?? "—"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            if (listenMode && onSpeak) onSpeak("Next turn. Advance time and run infection tick.");
            onNextTurn?.();
          }}
          className="mt-2 w-full border border-border bg-card py-2.5 font-mono text-xs uppercase text-primary transition-opacity hover:opacity-90"
        >
          Next Turn
        </button>
      </div>
    </div>
  );
}

export default GameActions;
