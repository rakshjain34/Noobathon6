import { useGameState } from "../context/GameStateContext";

export default function MissionModal() {
  const {
    missionModalZone,
    missionConfigForModal,
    closeMissionModal,
    startMission,
    completedMissions,
  } = useGameState();

  if (!missionModalZone) return null;

  const alreadyDone = completedMissions.includes(missionModalZone.id);
  const mission = missionConfigForModal || { description: "", objectiveText: "", rewards: {} };

  const handleStart = () => {
    startMission(missionModalZone, {
      type: mission.type,
      durationSeconds: mission.durationSeconds,
      targetClicks: mission.targetClicks,
      currentClicks: mission.currentClicks ?? 0,
      progressPct: 0,
      rewards: mission.rewards || {},
    });
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-base/80 p-4 backdrop-blur-sm"
      onClick={closeMissionModal}
      onKeyDown={(e) => e.key === "Escape" && closeMissionModal()}
      role="dialog"
      aria-modal="true"
      aria-label="Zone mission"
    >
      <div
        className="w-full max-w-md border-2 border-border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-heading text-lg font-bold text-primary border-b border-border pb-2 mb-3">
          {missionModalZone.name}
        </h2>
        <p className="font-mono text-xs text-secondary mb-2">{mission.description}</p>
        <p className="font-mono text-xs text-primary mb-2">
          <span className="text-secondary">Objective: </span>
          {mission.objectiveText}
        </p>
        <p className="font-mono text-[10px] text-secondary mb-4">
          Reward: {mission.rewards?.coins ?? 0} coins, {mission.rewards?.xp ?? 0} XP
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={closeMissionModal}
            className="flex-1 border border-border bg-card py-2 font-mono text-xs uppercase text-secondary hover:opacity-90"
          >
            Cancel
          </button>
          {!alreadyDone && (
            <button
              type="button"
              onClick={handleStart}
              className="flex-1 border-2 border-primary bg-primary/10 py-2 font-mono text-xs uppercase text-primary hover:bg-primary/20"
            >
              Start mission
            </button>
          )}
          {alreadyDone && (
            <span className="flex-1 py-2 font-mono text-xs uppercase text-secondary text-center">
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
