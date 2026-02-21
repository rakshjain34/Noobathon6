import { useGameState } from "../context/GameStateContext";

export default function VictoryScreen() {
  const { score, level, coins, persistSave } = useGameState();

  const handleClose = () => {
    persistSave();
    window.location.reload();
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-base/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Victory"
    >
      <div className="panel-texture absolute inset-0 pointer-events-none" aria-hidden />
      <div className="relative z-10 text-center">
        <h1
          className="font-heading text-4xl font-bold text-primary mb-2"
          style={{ textShadow: "0 0 24px rgba(74, 93, 58, 0.6)" }}
        >
          VICTORY
        </h1>
        <p className="font-mono text-sm text-secondary mb-2">All zone missions complete.</p>
        <p className="font-mono text-xs text-secondary mb-6">
          Score: {score} · Level {level} · Coins {coins}
        </p>
        <button
          type="button"
          onClick={handleClose}
          className="border-2 border-primary bg-primary/10 px-6 py-2 font-mono text-xs uppercase text-primary hover:bg-primary/20"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
