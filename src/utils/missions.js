import { getDifficulty } from "./difficulty";

const MISSION_TYPES = [
  {
    type: "survive",
    label: "Survive",
    description: "Hold the position for a set time under threat.",
    objective: (c) => `Survive ${c.durationSeconds} seconds`,
    getConfig: (zone, difficulty) => {
      const d = getDifficulty(difficulty);
      const durationSeconds = difficulty === "easy" ? 8 : difficulty === "hard" ? 15 : 12;
      const coins = Math.round(10 * d.rewardMultiplier);
      const xp = Math.round(15 * d.rewardMultiplier);
      return {
        type: "survive",
        durationSeconds,
        progressPct: 0,
        rewards: { coins, xp, score: 25 },
      };
    },
  },
  {
    type: "click",
    label: "Rally",
    description: "Complete actions under pressure.",
    objective: (c) => `Click ${c.targetClicks} times`,
    getConfig: (zone, difficulty) => {
      const d = getDifficulty(difficulty);
      const targetClicks = difficulty === "easy" ? 5 : difficulty === "hard" ? 12 : 8;
      const coins = Math.round(8 * d.rewardMultiplier);
      const xp = Math.round(12 * d.rewardMultiplier);
      return {
        type: "click",
        targetClicks,
        currentClicks: 0,
        progressPct: 0,
        rewards: { coins, xp, score: 20 },
      };
    },
  },
  {
    type: "battle",
    label: "Engagement",
    description: "Random encounter — survive the outcome.",
    objective: () => "Survive random damage",
    getConfig: (zone, difficulty) => {
      const d = getDifficulty(difficulty);
      const durationSeconds = 6;
      const coins = Math.round(15 * d.rewardMultiplier);
      const xp = Math.round(20 * d.rewardMultiplier);
      return {
        type: "battle",
        durationSeconds,
        progressPct: 0,
        rewards: { coins, xp, score: 35 },
      };
    },
  },
  {
    type: "collect",
    label: "Scavenge",
    description: "Simulate resource gathering under time limit.",
    objective: (c) => `Collect within ${c.durationSeconds}s`,
    getConfig: (zone, difficulty) => {
      const d = getDifficulty(difficulty);
      const durationSeconds = difficulty === "easy" ? 10 : difficulty === "hard" ? 6 : 8;
      const coins = Math.round(12 * d.rewardMultiplier);
      const xp = Math.round(18 * d.rewardMultiplier);
      return {
        type: "collect",
        durationSeconds,
        progressPct: 0,
        rewards: { coins, xp, score: 28 },
      };
    },
  },
];

export function getMissionForZone(zone, difficulty) {
  const template = MISSION_TYPES[Math.floor(Math.random() * MISSION_TYPES.length)];
  const config = template.getConfig(zone, difficulty);
  return {
    ...template,
    ...config,
    objectiveText: template.objective(config),
  };
}
