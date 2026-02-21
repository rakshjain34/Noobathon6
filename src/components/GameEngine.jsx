import { useEffect, useState } from "react";
import { useGameState } from "../context/GameStateContext";
import { useGameLoop, useVictoryCheck } from "../hooks/useGameLoop";
import StartScreen from "./StartScreen";
import GameHUD from "./GameHUD";
import MissionModal from "./MissionModal";
import MissionRunner from "./MissionRunner";
import GameOverScreen from "./GameOverScreen";
import VictoryScreen from "./VictoryScreen";
import FloatingNumber from "./FloatingNumber";

export default function GameEngine({ children }) {
  const {
    gameStarted,
    gameOver,
    victory,
    floatingNumbers,
    screenShake,
  } = useGameState();
  const [shaking, setShaking] = useState(false);

  useGameLoop();
  useVictoryCheck();

  useEffect(() => {
    if (screenShake > 0) {
      setShaking(true);
      const t = setTimeout(() => setShaking(false), 300);
      return () => clearTimeout(t);
    }
  }, [screenShake]);

  return (
    <>
      {!gameStarted && <StartScreen />}
      {gameStarted && (
        <>
          <div className={`relative h-full w-full ${shaking ? "game-screen-shake" : ""}`}>
            {children}
          </div>
          <GameHUD />
          <MissionModal />
          <MissionRunner />
          {floatingNumbers.map((f, i) => (
            <FloatingNumber key={f.id} text={f.text} type={f.type} index={i} />
          ))}
        </>
      )}
      {gameOver && <GameOverScreen />}
      {victory && <VictoryScreen />}
    </>
  );
}
