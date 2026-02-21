import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { loadSave, saveGame } from "../utils/saveSystem";
import { getDifficulty } from "../utils/difficulty";
import { getMissionForZone } from "../utils/missions";

const GameStateContext = createContext(null);

const INITIAL_STATE = (difficulty = "medium") => ({
  health: 100,
  energy: 100,
  coins: 50,
  xp: 0,
  level: 1,
  score: 0,
  timer: getDifficulty(difficulty).timerSeconds,
  difficulty,
  inventory: {},
  activeMission: null,
  completedMissions: [],
  gameStarted: false,
  musicOn: true,
  missionModalZone: null,
  missionConfigForModal: null,
  floatingNumbers: [],
  screenShake: 0,
  gameOver: false,
  victory: false,
});

export function GameStateProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = loadSave();
    if (saved && saved.health > 0 && saved.energy > 0) {
      return {
        ...INITIAL_STATE(saved.difficulty || "medium"),
        ...saved,
        gameStarted: false,
        missionModalZone: null,
        activeMission: null,
        floatingNumbers: [],
        screenShake: 0,
        gameOver: false,
        victory: false,
      };
    }
    return INITIAL_STATE("medium");
  });

  const update = useCallback((patch) => {
    setState((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));
  }, []);

  const startGame = useCallback((difficulty, musicOn) => {
    const diff = getDifficulty(difficulty);
    setState((prev) => ({
      ...prev,
      gameStarted: true,
      difficulty: difficulty || prev.difficulty,
      musicOn: musicOn !== undefined ? musicOn : prev.musicOn,
      health: 100,
      energy: 100,
      timer: diff.timerSeconds,
    }));
  }, []);

  const openMissionModal = useCallback((zone) => {
    if (!zone) return;
    setState((prev) => ({
      ...prev,
      missionModalZone: zone,
      missionConfigForModal: getMissionForZone(zone, prev.difficulty),
    }));
  }, []);

  const closeMissionModal = useCallback(() => {
    setState((prev) => ({ ...prev, missionModalZone: null, missionConfigForModal: null }));
  }, []);

  const startMission = useCallback((zone, missionConfig) => {
    setState((prev) => ({
      ...prev,
      missionModalZone: null,
      activeMission: {
        zoneId: zone.id,
        zoneName: zone.name,
        ...missionConfig,
        startedAt: Date.now(),
      },
    }));
  }, []);

  const endMission = useCallback((success, rewards = {}) => {
    setState((prev) => {
      const completed = prev.activeMission
        ? [...prev.completedMissions, prev.activeMission.zoneId]
        : prev.completedMissions;
      const newXp = prev.xp + (rewards.xp || 0);
      const xpForLevel = prev.level * 100;
      const newLevel = newXp >= xpForLevel ? prev.level + 1 : prev.level;
      return {
        ...prev,
        activeMission: null,
        completedMissions: completed,
        coins: prev.coins + (rewards.coins || 0),
        xp: newXp,
        level: newLevel,
        score: prev.score + (rewards.score || 0),
      };
    });
  }, []);

  const updateActiveMission = useCallback((patch) => {
    setState((prev) => ({
      ...prev,
      activeMission: prev.activeMission ? { ...prev.activeMission, ...patch } : null,
    }));
  }, []);

  const setGameOver = useCallback(() => {
    setState((prev) => ({ ...prev, gameOver: true }));
  }, []);

  const setVictory = useCallback(() => {
    setState((prev) => ({ ...prev, victory: true }));
  }, []);

  const addFloatingNumber = useCallback((text, type = "xp") => {
    const id = Date.now() + Math.random();
    setState((prev) => ({
      ...prev,
      floatingNumbers: [...prev.floatingNumbers, { id, text, type }],
    }));
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        floatingNumbers: prev.floatingNumbers.filter((f) => f.id !== id),
      }));
    }, 1200);
  }, []);

  const triggerScreenShake = useCallback(() => {
    setState((prev) => ({ ...prev, screenShake: prev.screenShake + 1 }));
  }, []);

  const persistSave = useCallback(() => {
    saveGame(state);
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      update,
      startGame,
      openMissionModal,
      closeMissionModal,
      startMission,
      endMission,
      updateActiveMission,
      setGameOver,
      setVictory,
      addFloatingNumber,
      triggerScreenShake,
      persistSave,
    }),
    [
      state,
      update,
      startGame,
      openMissionModal,
      closeMissionModal,
      startMission,
      endMission,
      updateActiveMission,
      setGameOver,
      setVictory,
      addFloatingNumber,
      triggerScreenShake,
      persistSave,
    ]
  );

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameStateContext);
  return ctx;
}
