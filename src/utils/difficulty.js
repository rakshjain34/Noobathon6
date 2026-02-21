export const DIFFICULTIES = {
  easy: {
    label: "Easy",
    energyDrainPerSecond: 0.02,
    damageMultiplier: 0.5,
    rewardMultiplier: 1.5,
    timerSeconds: 600,
    missionDamageMin: 2,
    missionDamageMax: 6,
  },
  medium: {
    label: "Medium",
    energyDrainPerSecond: 0.05,
    damageMultiplier: 1,
    rewardMultiplier: 1,
    timerSeconds: 420,
    missionDamageMin: 4,
    missionDamageMax: 12,
  },
  hard: {
    label: "Hard",
    energyDrainPerSecond: 0.1,
    damageMultiplier: 1.5,
    rewardMultiplier: 0.7,
    timerSeconds: 300,
    missionDamageMin: 8,
    missionDamageMax: 20,
  },
};

export function getDifficulty(key) {
  return DIFFICULTIES[key] || DIFFICULTIES.medium;
}
