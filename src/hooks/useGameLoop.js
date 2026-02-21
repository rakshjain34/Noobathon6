import { useEffect, useRef } from "react";
import { useGameState } from "../context/GameStateContext";
import { getDifficulty } from "../utils/difficulty";
import { ZONES } from "../data/zones";

const TOTAL_ZONES = ZONES.length;
const MISSION_DAMAGE_INTERVAL_MS = 2000;

export function useGameLoop() {
  const state = useGameState();
  const {
    gameStarted,
    gameOver,
    victory,
    difficulty,
    timer,
    energy,
    health,
    activeMission,
    update,
    endMission,
    updateActiveMission,
    addFloatingNumber,
    triggerScreenShake,
    setGameOver,
    persistSave,
  } = state;

  const stateRef = useRef(state);
  stateRef.current = state;
  const lastTickRef = useRef(performance.now());
  const lastDamageRef = useRef(0);

  useEffect(() => {
    if (!gameStarted || gameOver || victory) return;

    const diff = getDifficulty(difficulty);
    let rafId;

    const tick = (now) => {
      rafId = requestAnimationFrame(tick);
      const s = stateRef.current;
      const elapsed = now - lastTickRef.current;

      if (elapsed >= 1000) {
        lastTickRef.current = now;
        const newTimer = Math.max(0, s.timer - 1);
        const drain = diff.energyDrainPerSecond * (elapsed / 1000);
        const newEnergy = Math.max(0, s.energy - drain);
        s.update({
          timer: newTimer,
          energy: newEnergy,
        });

        if (newTimer <= 0 || newEnergy <= 0 || s.health <= 0) {
          s.setGameOver();
          s.persistSave();
          return;
        }
      }

      const mission = s.activeMission;
      if (mission && mission.startedAt) {
        const missionElapsed = (now - mission.startedAt) / 1000;
        const duration = mission.durationSeconds ?? 10;

        if (mission.type === "survive" || mission.type === "collect" || mission.type === "battle") {
          const progressPct = Math.min(100, (missionElapsed / duration) * 100);
          s.updateActiveMission({ progressPct });

          if (now - lastDamageRef.current >= MISSION_DAMAGE_INTERVAL_MS) {
            lastDamageRef.current = now;
            const dmg = Math.floor(
              (diff.missionDamageMin +
                Math.random() * (diff.missionDamageMax - diff.missionDamageMin)) *
                diff.damageMultiplier
            );
            if (dmg > 0) {
              s.update((prev) => ({ health: Math.max(0, prev.health - dmg) }));
              s.addFloatingNumber(`-${dmg} HP`, "hp");
              s.triggerScreenShake();
            }
          }

          if (progressPct >= 100) {
            const rewards = mission.rewards || {};
            s.endMission(true, rewards);
            s.addFloatingNumber(`+${rewards.xp ?? 0} XP`, "xp");
            s.addFloatingNumber(`+${rewards.coins ?? 0} coins`, "xp");
          }
        }
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [gameStarted, gameOver, victory, difficulty]);

  useEffect(() => {
    if (!gameStarted || gameOver || victory) return;
    if (health <= 0 || energy <= 0 || timer <= 0) {
      setGameOver();
      persistSave();
    }
  }, [gameStarted, gameOver, victory, health, energy, timer, setGameOver, persistSave]);
}

export function useVictoryCheck() {
  const { gameStarted, gameOver, victory, completedMissions, setVictory, persistSave } = useGameState();

  useEffect(() => {
    if (!gameStarted || gameOver || victory) return;
    if (completedMissions.length >= TOTAL_ZONES) {
      setVictory();
      persistSave();
    }
  }, [gameStarted, gameOver, victory, completedMissions.length, setVictory, persistSave]);
}
