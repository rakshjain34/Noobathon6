import { useGameState } from "../context/GameStateContext";

function Bar({ value, max, label, colorClass, accent }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex justify-between font-mono text-[10px] uppercase text-secondary">
        <span>{label}</span>
        <span className="text-primary">{Math.round(value)} / {max}</span>
      </div>
      <div className="h-1.5 w-24 overflow-hidden border border-border bg-card">
        <div
          className={`h-full transition-all duration-300 ${colorClass}`}
          style={{
            width: `${pct}%`,
            boxShadow: accent ? `0 0 8px ${accent}` : undefined,
          }}
        />
      </div>
    </div>
  );
}

export default function GameHUD() {
  const {
    health,
    energy,
    xp,
    level,
    coins,
    timer,
    activeMission,
    difficulty,
  } = useGameState();

  const xpForNextLevel = level * 100;
  const xpPct = xpForNextLevel > 0 ? Math.min(100, (xp % xpForNextLevel) / xpForNextLevel * 100) : 0;

  const formatTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex flex-col justify-between">
      <div className="flex justify-between p-4">
        <div className="flex gap-4 border border-border bg-card/90 px-4 py-3 backdrop-blur-sm">
          <Bar
            value={health}
            max={100}
            label="Health"
            colorClass="bg-red-900/80"
            accent="rgba(139, 58, 58, 0.6)"
          />
          <Bar
            value={energy}
            max={100}
            label="Energy"
            colorClass="bg-amber-900/80"
            accent="rgba(196, 116, 42, 0.4)"
          />
          <div className="flex flex-col gap-0.5">
            <div className="font-mono text-[10px] uppercase text-secondary">XP</div>
            <div className="h-1.5 w-24 overflow-hidden border border-border bg-card">
              <div
                className="h-full bg-[#4a5d3a] transition-all duration-300"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <span className="font-mono text-[9px] text-secondary">Lv.{level}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 border border-border bg-card/90 px-4 py-3 backdrop-blur-sm font-mono text-xs">
          <div className="flex items-center gap-2 text-primary">
            <span className="text-secondary">Coins</span>
            <span className="font-bold">{coins}</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <span className="text-secondary">Level</span>
            <span className="font-bold">{level}</span>
          </div>
          <div
            className={`font-bold tabular-nums ${
              timer <= 60 ? "text-red-400" : "text-primary"
            }`}
          >
            {formatTimer(timer)}
          </div>
        </div>
      </div>

      {activeMission && (
        <div className="border-t border-border bg-card/90 px-4 py-2 backdrop-blur-sm">
          <div className="font-mono text-[10px] uppercase text-secondary mb-1">
            Active: {activeMission.zoneName}
          </div>
          <div className="h-1 w-full overflow-hidden bg-card border border-border">
            <div
              className="h-full bg-primary/60 transition-all duration-200"
              style={{
                width: `${activeMission.progressPct ?? 0}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
