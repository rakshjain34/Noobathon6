import { useState } from "react";
import { useGameState } from "../context/GameStateContext";
import { DIFFICULTIES } from "../utils/difficulty";
import InstructionsModal from "./InstructionsModal";

export default function StartScreen() {
  const { startGame, update, musicOn } = useGameState();
  const [difficulty, setDifficulty] = useState("medium");
  const [music, setMusic] = useState(musicOn !== false);
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStart = () => {
    update({ musicOn: music });
    startGame(difficulty, music);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-base/95 px-4 backdrop-blur-sm"
        aria-label="Start screen"
      >
        <div className="panel-texture absolute inset-0 pointer-events-none" aria-hidden />
        <div className="relative z-10 flex max-w-md flex-col items-center gap-8 text-center">
          <h1
            className="font-heading text-4xl font-bold text-primary drop-shadow-lg md:text-5xl"
            style={{ textShadow: "0 0 24px rgba(196, 184, 168, 0.2)" }}
          >
            THE TURNING POINT
          </h1>
          <p className="font-mono text-sm uppercase tracking-wider text-secondary">
            Cordyceps Terminal — Survival
          </p>

          <div className="w-full space-y-4 border border-border bg-card/80 p-6">
            <label className="block font-mono text-xs uppercase tracking-wider text-secondary">
              Difficulty
            </label>
            <div className="flex gap-2">
              {Object.entries(DIFFICULTIES).map(([key, d]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDifficulty(key)}
                  className={`flex-1 border py-2 font-mono text-xs uppercase transition-all ${
                    difficulty === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-secondary hover:border-primary/50"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 font-mono text-xs text-secondary">
              <input
                type="checkbox"
                checked={music}
                onChange={(e) => setMusic(e.target.checked)}
                className="h-3 w-3 border-border bg-card accent-survivor"
              />
              Music / SFX
            </label>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={handleStart}
              className="w-full border-2 border-primary bg-primary/10 py-3 font-mono text-sm font-bold uppercase text-primary transition-all hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(196,184,168,0.15)]"
            >
              Start Game
            </button>
            <button
              type="button"
              onClick={() => setShowInstructions(true)}
              className="w-full border border-border bg-card py-2.5 font-mono text-xs uppercase text-secondary transition-opacity hover:opacity-90"
            >
              Instructions
            </button>
          </div>
        </div>
      </div>
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}
    </>
  );
}
