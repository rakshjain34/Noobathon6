export const ZONES = [
  {
    id: "zone-alpha",
    name: "Alpha Sector",
    coordinates: [51.5074, -0.1278],
    infectionTrend: [12, 18, 22, 35, 41, 48, 52],
    resources: { ammo: 45, food: 28, medical: 15 },
    riskLevel: "high",
    visibility: "public",
    lastActivity: "2h ago",
    type: "quarantine",
  },
  {
    id: "zone-bravo",
    name: "Bravo Outpost",
    coordinates: [40.7128, -74.006],
    infectionTrend: [8, 10, 14, 19, 21, 24, 28],
    resources: { ammo: 62, food: 51, medical: 38 },
    riskLevel: "medium",
    visibility: "firefly",
    lastActivity: "05:42",
    type: "hideout",
  },
  {
    id: "zone-charlie",
    name: "Charlie Perimeter",
    coordinates: [35.6762, 139.6503],
    infectionTrend: [25, 32, 38, 45, 58, 65, 72],
    resources: { ammo: 22, food: 18, medical: 12 },
    riskLevel: "critical",
    visibility: "military",
    lastActivity: "18m ago",
    type: "fedra_base",
  },
  {
    id: "zone-delta",
    name: "Delta Sanctuary",
    coordinates: [48.8566, 2.3522],
    infectionTrend: [5, 7, 9, 11, 13, 15, 16],
    resources: { ammo: 78, food: 85, medical: 72 },
    riskLevel: "low",
    visibility: "public",
    lastActivity: "4h ago",
    type: "arcade",
  },
  {
    id: "zone-echo",
    name: "Echo Quarantine",
    coordinates: [-33.8688, 151.2093],
    infectionTrend: [42, 55, 68, 78, 85, 91, 95],
    resources: { ammo: 15, food: 8, medical: 5 },
    riskLevel: "critical",
    visibility: "military",
    lastActivity: "1h ago",
    type: "patrol_route",
  },
  {
    id: "zone-foxtrot",
    name: "Foxtrot Safe House",
    coordinates: [34.0522, -118.2437],
    infectionTrend: [3, 5, 6, 8, 9, 10, 11],
    resources: { ammo: 55, food: 42, medical: 38 },
    riskLevel: "low",
    visibility: "firefly",
    lastActivity: "22:15",
    type: "hideout",
  },
];

export const FACTIONS = [
  { value: "survivor", label: "Survivors" },
  { value: "firefly", label: "Fireflies" },
  { value: "military", label: "Military (FEDRA)" },
];

export const FACTION_ACCENTS = {
  survivor: "#9c8a3c",
  firefly: "#c4742a",
  military: "#4a5d3a",
};

export const LOCATIONS = [
  { value: "alpha", label: "Alpha Sector" },
  { value: "bravo", label: "Bravo Outpost" },
  { value: "charlie", label: "Charlie Perimeter" },
  { value: "delta", label: "Delta Sanctuary" },
  { value: "echo", label: "Echo Quarantine" },
  { value: "global", label: "Global Overview" },
];
