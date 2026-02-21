import { useGameState } from "../context/GameStateContext";

export default function MissionRunner() {
  const { activeMission, updateActiveMission, endMission } = useGameState();

  if (!activeMission || activeMission.type !== "click") return null;

  const { targetClicks, currentClicks = 0, rewards = {} } = activeMission;
  const next = currentClicks + 1;
  const done = next >= targetClicks;

  const handleClick = () => {
    if (done) {
      endMission(true, rewards);
      return;
    }
    updateActiveMission({ currentClicks: next, progressPct: (next / targetClicks) * 100 });
  };

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-base/70 backdrop-blur-sm pointer-events-none">
      <div className="pointer-events-auto border-2 border-border bg-card px-8 py-6 text-center">
        <p className="font-mono text-xs text-secondary mb-2">
          Rally — {activeMission.zoneName}
        </p>
        <p className="font-mono text-sm text-primary mb-4">
          Clicks: {currentClicks} / {targetClicks}
        </p>
        <button
          type="button"
          onClick={handleClick}
          className="border-2 border-primary bg-primary/10 px-6 py-3 font-mono text-sm uppercase text-primary hover:bg-primary/20 transition-opacity"
        >
          {done ? "Complete" : "Click"}
        </button>
      </div>
    </div>
  );
}
