import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import MapView from "../components/MapView";
import InfectionChart from "../components/InfectionChart";
import ResourceChart from "../components/ResourceChart";
import ResourceScarcityChart from "../components/ResourceScarcityChart";
import ZoneAnalyticsWidget from "../components/ZoneAnalyticsWidget";
import TerritoryAnalytics from "../components/TerritoryAnalytics";
import ResourceInventory from "../components/ResourceInventory";
import GameActions from "../components/GameActions";
import TaskPanel from "../components/TaskPanel";
import { speak } from "../utils/speech";
import { useGameState } from "../context/GameStateContext";
import { ZONES, FACTION_ACCENTS } from "../data/zones";

const TASK_TEMPLATES = [
  { id: "t1", type: "stabilize", text: "Stabilize 2 zones below 40% infection", target: 2, reward: { medkits: 2 } },
  { id: "t2", type: "supply", text: "Supply medical to 3 zones", target: 3, reward: { ammo: 5 } },
  { id: "t3", type: "reinforce", text: "Reinforce 2 zones", target: 2, reward: { medkits: 1 } },
  { id: "t4", type: "turn", text: "Reach turn 5", target: 5, reward: { ammo: 3 } },
  { id: "t5", type: "no_overrun", text: "Keep no zones overrun for 3 turns", target: 3, reward: { medkits: 2 } },
  { id: "t6", type: "ammo", text: "Have at least 20 ammo", target: 20, reward: { medkits: 1 } },
];

function pickRandomTasks(n = 3) {
  const shuffled = [...TASK_TEMPLATES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map((t) => ({
    ...t,
    current: 0,
    completed: false,
    rewardApplied: false,
  }));
}

function initialInventory(role) {
  return {
    medkits: role === "military" ? 5 : role === "firefly" ? 3 : 4,
    ammo: role === "military" ? 24 : role === "firefly" ? 16 : 12,
    rags: role === "military" ? 8 : role === "firefly" ? 6 : 5,
    alcohol: role === "military" ? 4 : role === "firefly" ? 3 : 2,
    tradingCards: role === "military" ? 6 : role === "firefly" ? 14 : 9,
  };
}

const FACTION_CONFIG = {
  survivor: {
    accent: "survivor",
    factionName: "Survivors",
    headerTitle: "Survivor Command Center",
    sidebarNote: "Hold the line. Every day we survive is a victory.",
    objective: "Locate the nearest safe Arcade Point.",
    healthStatus: 72,
    healthLevel: "medium",
    infectionRisk: 34,
    infectionLevel: "medium",
  },
  firefly: {
    accent: "firefly",
    factionName: "Fireflies",
    headerTitle: "Firefly Tactical Hub",
    sidebarNote: "Look for the light. We endure.",
    objective: "Connect rebel zones and liberate territories.",
    healthStatus: 58,
    healthLevel: "high",
    infectionRisk: 52,
    infectionLevel: "high",
  },
  military: {
    accent: "military",
    factionName: "Military (FEDRA)",
    headerTitle: "Military Operations Center",
    sidebarNote: "Restore order. Protect the remaining population.",
    objective: "Patrol routes between FEDRA outposts and maintain order.",
    healthStatus: 85,
    healthLevel: "low",
    infectionRisk: 22,
    infectionLevel: "low",
  },
};

function getTaskCurrent(task, state) {
  const { type } = task;
  if (type === "stabilize") return state.stabilizedCount;
  if (type === "supply") return state.supplyMedicalCount;
  if (type === "reinforce") return state.reinforceCount;
  if (type === "turn") return state.turn;
  if (type === "no_overrun") return state.consecutiveTurnsNoOverrun;
  if (type === "ammo") return state.inventory.ammo;
  return 0;
}

function Dashboard() {
  const [listenMode, setListenMode] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [turn, setTurn] = useState(1);
  const [zones, setZones] = useState(() =>
    ZONES.map((z) => ({ ...z, infectionTrend: [...z.infectionTrend] }))
  );
  const role = localStorage.getItem("turningPoint_role") || "survivor";
  const [inventory, setInventory] = useState(() => initialInventory(role));
  const [tasks, setTasks] = useState(pickRandomTasks);
  const [supplyMedicalCount, setSupplyMedicalCount] = useState(0);
  const [reinforceCount, setReinforceCount] = useState(0);
  const [consecutiveTurnsNoOverrun, setConsecutiveTurnsNoOverrun] = useState(0);
  const config = FACTION_CONFIG[role] || FACTION_CONFIG.survivor;
  const accentColor = FACTION_ACCENTS[role] || FACTION_ACCENTS.survivor;
  const gameState = useGameState();

  const runSimulationTick = () => {
    setZones((prev) =>
      prev.map((zone) => {
        const isHighRisk = zone.riskLevel === "high" || zone.riskLevel === "critical";
        if (!isHighRisk) return zone;
        const trend = [...zone.infectionTrend];
        const last = trend[trend.length - 1];
        const increase = Math.floor(Math.random() * 4) + 1;
        const next = Math.min(100, last + increase);
        trend.push(next);
        trend.shift();
        return { ...zone, infectionTrend: trend };
      })
    );
  };

  const handleNextTurn = () => {
    const nextTurn = turn + 1;
    runSimulationTick();
    setTurn(nextTurn);
    setInventory((inv) => ({
      ...inv,
      medkits: Math.min(inv.medkits + (nextTurn % 3 === 0 ? 1 : 0), 99),
      ammo: Math.min(inv.ammo + (nextTurn % 2 === 0 ? 2 : 0), 99),
    }));
  };

  const handleSupplyMedical = () => {
    if (!selectedZoneId || inventory.medkits < 1) return;
    setSupplyMedicalCount((c) => c + 1);
    setInventory((inv) => ({ ...inv, medkits: inv.medkits - 1 }));
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== selectedZoneId) return z;
        const trend = [...z.infectionTrend];
        const last = trend[trend.length - 1];
        trend[trend.length - 1] = Math.max(0, last - 10);
        return { ...z, infectionTrend: trend };
      })
    );
  };

  const handleReinforce = () => {
    if (!selectedZoneId || inventory.ammo < 5) return;
    setReinforceCount((c) => c + 1);
    setInventory((inv) => ({ ...inv, ammo: inv.ammo - 5 }));
    setZones((prev) =>
      prev.map((z) => {
        if (z.id !== selectedZoneId) return z;
        const trend = [...z.infectionTrend];
        const last = trend[trend.length - 1];
        trend[trend.length - 1] = Math.max(0, last - 5);
        return { ...z, infectionTrend: trend };
      })
    );
  };

  const filteredZones = useMemo(() => {
    if (role === "survivor") {
      return zones.filter((z) => z.visibility === "public");
    }
    if (role === "firefly") {
      return zones.filter((z) => z.visibility === "firefly" || z.visibility === "public");
    }
    if (role === "military") {
      return zones.filter((z) => z.visibility === "military" || z.visibility === "public");
    }
    return zones;
  }, [role, zones]);

  useEffect(() => {
    if (filteredZones.length > 0 && !selectedZoneId) {
      setSelectedZoneId(filteredZones[0].id);
    } else if (filteredZones.length > 0 && !filteredZones.some((z) => z.id === selectedZoneId)) {
      setSelectedZoneId(filteredZones[0].id);
    }
  }, [filteredZones, selectedZoneId]);

  const selectedZone = useMemo(
    () => filteredZones.find((z) => z.id === selectedZoneId) || filteredZones[0],
    [filteredZones, selectedZoneId]
  );

  const infectionData = useMemo(() => {
    const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
    if (filteredZones.length === 0) {
      return { labels, datasets: [] };
    }
    const zone = selectedZone;
    const trend = zone ? zone.infectionTrend : null;
    const data = trend
      ? trend
      : labels.map((_, i) => {
          const sum = filteredZones.reduce((s, z) => s + z.infectionTrend[i], 0);
          return Math.round(sum / filteredZones.length);
        });
    return {
      labels,
      datasets: [
        {
          label: zone ? `${zone.name} Infection %` : "Infection %",
          data,
          borderColor: accentColor,
          backgroundColor: "transparent",
          tension: 0.35,
          borderWidth: 1,
          pointRadius: 2,
        },
      ],
    };
  }, [filteredZones, selectedZone, accentColor]);

  const latestByZone = useMemo(
    () =>
      selectedZone
        ? [
            {
              name: selectedZone.name.replace(/\s+(Sector|Outpost|Perimeter|Sanctuary|Quarantine|Safe House)$/, ""),
              value: selectedZone.infectionTrend?.slice(-1)[0] ?? 0,
            },
          ]
        : filteredZones.map((z) => ({
            name: z.name.replace(/\s+(Sector|Outpost|Perimeter|Sanctuary|Quarantine|Safe House)$/, ""),
            value: z.infectionTrend?.slice(-1)[0] ?? 0,
          })),
    [filteredZones, selectedZone]
  );

  const resourceData = useMemo(() => [
    { label: "Ammo", value: inventory.ammo, color: "#4a443c" },
    { label: "Medkits", value: inventory.medkits, color: "#5a5348" },
    { label: "Rags", value: inventory.rags, color: "#524d44" },
    { label: "Alcohol", value: inventory.alcohol, color: "#6b5f4f" },
    { label: "Cards", value: inventory.tradingCards, color: "#5a5348" },
  ], [inventory]);

  const territoryData = useMemo(() => {
    const military = zones.filter((z) => z.visibility === "military").length;
    const fireflies = zones.filter((z) => z.visibility === "firefly").length;
    const infected = zones.filter((z) => {
      const last = z.infectionTrend?.slice(-1)[0] ?? 0;
      return last >= 70;
    }).length;
    return { military, fireflies, infected };
  }, [zones]);

  const stabilizedCount = useMemo(
    () => filteredZones.filter((z) => (z.infectionTrend?.slice(-1)[0] ?? 0) < 40).length,
    [filteredZones, zones]
  );
  const overrunCount = useMemo(
    () => zones.filter((z) => (z.infectionTrend?.slice(-1)[0] ?? 0) >= 70).length,
    [zones]
  );

  const prevTurnRef = useRef(turn);
  useEffect(() => {
    if (turn > prevTurnRef.current) {
      prevTurnRef.current = turn;
      const overrun = zones.filter((z) => (z.infectionTrend?.slice(-1)[0] ?? 0) >= 70).length;
      if (overrun === 0) setConsecutiveTurnsNoOverrun((c) => c + 1);
      else setConsecutiveTurnsNoOverrun(0);
    }
  }, [turn, zones]);

  const gameProgress = useMemo(
    () => ({
      stabilizedCount,
      supplyMedicalCount,
      reinforceCount,
      turn,
      consecutiveTurnsNoOverrun,
      inventory,
    }),
    [stabilizedCount, supplyMedicalCount, reinforceCount, turn, consecutiveTurnsNoOverrun, inventory]
  );

  const tasksWithProgress = useMemo(
    () =>
      tasks.map((t) => ({
        ...t,
        current: getTaskCurrent(t, gameProgress),
      })),
    [tasks, gameProgress]
  );

  useEffect(() => {
    const toComplete = tasksWithProgress.filter(
      (t) => !t.completed && t.current >= t.target
    );
    if (toComplete.length === 0) return;
    setTasks((prev) =>
      prev.map((t) =>
        toComplete.some((c) => c.id === t.id) ? { ...t, completed: true } : t
      )
    );
    setInventory((inv) => {
      const next = { ...inv };
      toComplete.forEach((t) => {
        if (t.reward) {
          next.medkits = Math.min(99, next.medkits + (t.reward.medkits || 0));
          next.ammo = Math.min(99, next.ammo + (t.reward.ammo || 0));
        }
      });
      return next;
    });
  }, [tasksWithProgress, tasks]);

  const allTasksComplete = tasks.every((t) => t.completed);
  const refilledRoundRef = useRef(false);
  useEffect(() => {
    if (!allTasksComplete) {
      refilledRoundRef.current = false;
      return;
    }
    if (refilledRoundRef.current) return;
    refilledRoundRef.current = true;
    setTasks(pickRandomTasks());
  }, [allTasksComplete]);

  const currentTarget = useMemo(
    () => tasksWithProgress.find((t) => !t.completed),
    [tasksWithProgress]
  );

  const speakZone = useCallback((zone) => {
    if (!zone) return;
    const infection = zone.infectionTrend?.slice(-1)[0] ?? 0;
    const risk =
      infection >= 70 ? "Overrun" : infection >= 40 ? "Critical" : "Stable";
    const text = `${zone.name}. ${risk}. Infection ${infection} percent.`;
    speak(text);
  }, []);

  return (
    <div
      className={`relative flex h-screen w-full overflow-hidden bg-base theme-${role}`}
      data-theme={role}
    >
      <Sidebar
        config={config}
        accentColor={accentColor}
        listenMode={listenMode}
        onListenModeChange={setListenMode}
        onSpeakSection={(text) => speak(text)}
      />
      <main
        className={`absolute right-0 bottom-0 left-56 flex flex-col overflow-hidden md:left-64 ${
          listenMode ? "contrast-[1.08]" : ""
        }`}
        style={{ top: 0 }}
      >
        <div className="flex h-14 shrink-0 items-center px-4 md:px-6">
          <h1
            className={`font-heading pl-4 text-xl font-bold text-primary md:text-2xl ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
            style={{ borderLeft: `4px solid ${accentColor}` }}
            role={listenMode ? "button" : undefined}
            tabIndex={listenMode ? 0 : undefined}
            onClick={() => listenMode && speak(config.headerTitle)}
            onKeyDown={(e) => listenMode && (e.key === "Enter" || e.key === " ") && speak(config.headerTitle)}
          >
            {config.headerTitle}
          </h1>
        </div>
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-4 pb-4 md:p-6 md:pt-4">
          <div className="grid w-full grid-cols-1 gap-4 pb-4 lg:grid-cols-2">
            <div className="relative h-80 overflow-hidden border border-border bg-card lg:col-span-2">
              <div className="panel-texture absolute inset-0" aria-hidden />
              <MapView
                zones={filteredZones}
                allZones={zones}
                role={role}
                listenMode={listenMode}
                onSpeakZone={speakZone}
                onZoneMissionClick={gameState?.openMissionModal}
              />
            </div>
            <div className="relative flex flex-col gap-3 overflow-hidden border border-border bg-card p-4 lg:col-span-2">
              <div className="panel-texture absolute inset-0" aria-hidden />
              <ZoneAnalyticsWidget
                zones={filteredZones}
                selectedZoneId={selectedZoneId || filteredZones[0]?.id}
                onZoneChange={setSelectedZoneId}
                listenMode={listenMode}
                onSpeakZone={speakZone}
              />
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex h-52 flex-col">
                  <InfectionChart
                    data={infectionData}
                    accentColor={accentColor}
                    latestByZone={latestByZone}
                    title="Infection Forecast"
                    listenMode={listenMode}
                    onSpeak={(text) => speak(text)}
                  />
                </div>
                <div className="flex h-52 flex-col">
                  <ResourceScarcityChart
                    zone={selectedZone}
                    listenMode={listenMode}
                    onSpeak={(text) => speak(text)}
                  />
                </div>
              </div>
            </div>
            <div className="relative flex h-60 flex-col overflow-hidden border border-border bg-card p-4">
              <div className="panel-texture absolute inset-0" aria-hidden />
              <ResourceChart
                data={resourceData}
                accentColor={accentColor}
                listenMode={listenMode}
                onSpeak={(text) => speak(text)}
              />
            </div>
            <div className="relative flex h-60 flex-col overflow-hidden border border-border bg-card p-4">
              <div className="panel-texture absolute inset-0" aria-hidden />
              <TerritoryAnalytics
                military={territoryData.military}
                fireflies={territoryData.fireflies}
                infected={territoryData.infected}
                listenMode={listenMode}
                onSpeak={(text) => speak(text)}
              />
            </div>
            <div className="relative flex h-60 flex-col overflow-hidden border border-border bg-card p-4">
              <div className="panel-texture absolute inset-0" aria-hidden />
              <ResourceInventory
                inventory={inventory}
                listenMode={listenMode}
                onSpeak={(text) => speak(text)}
              />
            </div>
            <div className="relative flex flex-col overflow-hidden border border-border bg-card p-4">
              <div className="panel-texture absolute inset-0" aria-hidden />
              <TaskPanel
                tasks={tasksWithProgress}
                accentColor={accentColor}
                currentTarget={currentTarget}
                listenMode={listenMode}
                onSpeak={(text) => speak(text)}
              />
            </div>
            <div className="relative flex flex-col overflow-hidden border border-border bg-card p-4">
              <div className="panel-texture absolute inset-0" aria-hidden />
              <GameActions
                selectedZone={selectedZone}
                inventory={inventory}
                onSupplyMedical={handleSupplyMedical}
                onReinforce={handleReinforce}
                onNextTurn={handleNextTurn}
                turn={turn}
                canSupply={inventory.medkits >= 1}
                canReinforce={inventory.ammo >= 5}
                stabilizedCount={stabilizedCount}
                overrunCount={overrunCount}
                currentTarget={currentTarget}
                listenMode={listenMode}
                onSpeak={(text) => speak(text)}
              />
            </div>
          </div>
          {(stabilizedCount >= 2 || overrunCount >= 4) && (
            <div
              className="mt-4 border border-border bg-card p-4 font-mono text-sm"
              style={{ borderLeftWidth: 4, borderLeftColor: overrunCount >= 4 ? "#8b3a3a" : "#4a5d3a" }}
            >
              {overrunCount >= 4
                ? "Critical: Too many zones overrun. Focus on containing infection."
                : "Objective met: 2+ zones stabilized below 40% infection."}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
