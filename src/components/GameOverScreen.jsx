import { useGameState } from "../context/GameStateContext";

export default function GameOverScreen() {
  const { score, level, coins, persistSave } = useGameState();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-base/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Game over"
    >
      <div className="panel-texture absolute inset-0 pointer-events-none" aria-hidden />
      <div className="relative z-10 text-center">
        <h1 className="font-heading text-4xl font-bold text-red-400/90 mb-2 animate-pulse">
          GAME OVER
        </h1>
        <p className="font-mono text-sm text-secondary mb-6">
          Score: {score} · Level {level} · Coins {coins}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => {
              persistSave();
              handleRetry();
            }}
            className="border border-border bg-card px-6 py-2 font-mono text-xs uppercase text-primary hover:opacity-90"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={handleRetry}
            className="border border-primary bg-primary/10 px-6 py-2 font-mono text-xs uppercase text-primary hover:opacity-90"
          >
            New game
          </button>
        </div>
      </div>
    </div>
  );
}
