const SAVE_KEY = "turningpoint_survival_save";

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveGame(state) {
  try {
    const toSave = {
      health: state.health,
      energy: state.energy,
      coins: state.coins,
      xp: state.xp,
      level: state.level,
      score: state.score,
      completedMissions: state.completedMissions || [],
      difficulty: state.difficulty,
      timestamp: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.warn("Save failed", e);
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
}
