import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import MapView from "../components/MapView";
import InfectionChart from "../components/InfectionChart";
import ResourceChart from "../components/ResourceChart";
import ResourceScarcityChart from "../components/ResourceScarcityChart";
import ZoneAnalyticsWidget from "../components/ZoneAnalyticsWidget";
import TerritoryAnalytics from "../components/TerritoryAnalytics";
import ResourceInventory from "../components/ResourceInventory";
import { ZONES, FACTION_ACCENTS } from "../data/zones";

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

function Dashboard() {
  const [listenMode, setListenMode] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [zones, setZones] = useState(() =>
    ZONES.map((z) => ({ ...z, infectionTrend: [...z.infectionTrend] }))
  );
  const role = localStorage.getItem("turningPoint_role") || "survivor";
  const config = FACTION_CONFIG[role] || FACTION_CONFIG.survivor;
  const accentColor = FACTION_ACCENTS[role] || FACTION_ACCENTS.survivor;

  useEffect(() => {
    const id = setInterval(() => {
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
    }, 8000);
    return () => clearInterval(id);
  }, []);

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

  const resourceData = useMemo(() => {
    const totals = filteredZones.reduce(
      (acc, z) => ({
        ammo: acc.ammo + z.resources.ammo,
        food: acc.food + z.resources.food,
        medical: acc.medical + z.resources.medical,
      }),
      { ammo: 0, food: 0, medical: 0 }
    );
    return [
      { label: "Ammo", value: totals.ammo, color: "#4a443c" },
      { label: "Food", value: totals.food, color: "#524d44" },
      { label: "Medical", value: totals.medical, color: "#5a5348" },
    ];
  }, [filteredZones]);

  const territoryData = useMemo(() => {
    const military = zones.filter((z) => z.visibility === "military").length;
    const fireflies = zones.filter((z) => z.visibility === "firefly").length;
    const infected = zones.filter((z) => {
      const last = z.infectionTrend?.slice(-1)[0] ?? 0;
      return last >= 70;
    }).length;
    return { military, fireflies, infected };
  }, [zones]);

  const inventoryData = useMemo(() => {
    const totals = zones.reduce(
      (acc, z) => ({
        ammo: acc.ammo + Math.floor(z.resources.ammo / 5),
        medical: acc.medical + Math.floor(z.resources.medical / 10),
      }),
      { ammo: 0, medical: 0 }
    );
    return {
      medkits: Math.max(0, totals.medical) + (role === "military" ? 4 : role === "firefly" ? 2 : 3),
      ammo: Math.max(0, totals.ammo) + (role === "military" ? 18 : role === "firefly" ? 12 : 8),
      rags: role === "military" ? 8 : role === "firefly" ? 6 : 5,
      alcohol: role === "military" ? 4 : role === "firefly" ? 3 : 2,
      tradingCards: role === "military" ? 6 : role === "firefly" ? 14 : 9,
    };
  }, [zones, role]);

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
      />
      <main
        className={`absolute right-0 bottom-0 left-56 flex flex-col overflow-hidden md:left-64 ${
          listenMode ? "contrast-[1.08]" : ""
        }`}
        style={{ top: 0 }}
      >
        <div className="flex h-14 shrink-0 items-center px-4 md:px-6">
          <h1
            className="font-heading pl-4 text-xl font-bold text-primary md:text-2xl"
            style={{ borderLeft: `4px solid ${accentColor}` }}
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
              />
            </div>
            <div className="relative flex flex-col gap-3 overflow-hidden border border-border bg-card p-4 lg:col-span-2">
              <div className="panel-texture absolute inset-0" aria-hidden />
              <ZoneAnalyticsWidget
                zones={filteredZones}
                selectedZoneId={selectedZoneId || filteredZones[0]?.id}
                onZoneChange={setSelectedZoneId}
              />
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="flex h-52 flex-col">
                  <InfectionChart
                    data={infectionData}
                    accentColor={accentColor}
                    latestByZone={latestByZone}
                    title="Infection Forecast"
                  />
                </div>
                <div className="flex h-52 flex-col">
                  <ResourceScarcityChart zone={selectedZone} />
                </div>
              </div>
            </div>
            <div className="relative flex h-60 flex-col overflow-hidden border border-border bg-card p-4">
              <div className="panel-texture absolute inset-0" aria-hidden />
              <ResourceChart data={resourceData} accentColor={accentColor} />
            </div>
            <div className="relative flex h-60 flex-col overflow-hidden border border-border bg-card p-4">
              <div className="panel-texture absolute inset-0" aria-hidden />
              <TerritoryAnalytics
                military={territoryData.military}
                fireflies={territoryData.fireflies}
                infected={territoryData.infected}
              />
            </div>
            <div className="relative flex h-60 flex-col overflow-hidden border border-border bg-card p-4">
              <div className="panel-texture absolute inset-0" aria-hidden />
              <ResourceInventory inventory={inventoryData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
