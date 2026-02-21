import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FACTIONS, LOCATIONS } from "../data/zones";

const STAGES = [
  { name: "Runner", desc: "Early stage. Host still mobile." },
  { name: "Stalker", desc: "Vision degraded. Hearing acute." },
  { name: "Clicker", desc: "Echolocation. Lethal." },
  { name: "Bloater", desc: "Final stage. Armored. Extreme threat." },
];

const VACCINE_STATUS = {
  phase: "Phase 2",
  stage: "Clinical Trials",
  progress: 34,
  lastUpdate: "72h ago",
};

function Landing() {
  const [faction, setFaction] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleAccess = () => {
    if (!faction) return;
    localStorage.setItem("turningPoint_role", faction);
    if (location) localStorage.setItem("turningPoint_location", location);
    navigate("/boot");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-base">
      <div className="grain-overlay absolute inset-0" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#141210]/90" aria-hidden />
      <div className="relative flex h-full flex-col items-center justify-center overflow-y-auto px-6 py-12">
        <div className="w-full max-w-2xl">
          <h1 className="font-heading text-4xl tracking-tight text-primary sm:text-5xl md:text-6xl">
            THE CORDYCEPS ARCHIVE
          </h1>
          <p className="mt-6 font-mono text-sm leading-relaxed text-secondary sm:text-base">
            Cordyceps Brain Infection (CBI) is a fungal pathogen that invades the
            central nervous system. Transmission occurs through airborne spores
            and direct contact. The fungus progressively colonizes neural tissue,
            altering host behaviour across distinct stages. This terminal aggregates
            data from surviving outposts—infection spread, resource distribution,
            and faction operations. Access restricted by clearance level.
          </p>

          <div className="mt-10 border-l-2 border-border pl-4">
            <p className="font-mono text-xs uppercase tracking-wider text-secondary">
              Infection progression
            </p>
            <div className="mt-2 flex flex-wrap gap-x-1 gap-y-2 sm:gap-x-2">
              {STAGES.map((s, i) => (
                <div
                  key={s.name}
                  className="flex flex-1 min-w-0 flex-col border border-border bg-card/50 px-2 py-1.5 sm:px-3"
                >
                  <span className="font-mono text-xs font-medium text-primary">{s.name}</span>
                  <span className="font-mono text-[10px] text-secondary">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 border-l-2 border-border pl-4">
            <p className="font-mono text-xs uppercase tracking-wider text-secondary">
              Vaccine preparation
            </p>
            <p className="mt-1 font-mono text-xs text-primary">
              {VACCINE_STATUS.phase} — {VACCINE_STATUS.stage}
            </p>
            <div className="mt-2 h-1 w-full overflow-hidden border border-border bg-card">
              <div
                className="h-full bg-military transition-all duration-500"
                style={{ width: `${VACCINE_STATUS.progress}%` }}
              />
            </div>
            <p className="mt-1 font-mono text-[10px] text-secondary">
              {VACCINE_STATUS.progress}% · Last update: {VACCINE_STATUS.lastUpdate}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="faction"
                className="mb-1 block font-mono text-xs uppercase tracking-wider text-secondary"
              >
                Faction
              </label>
              <select
                id="faction"
                value={faction}
                onChange={(e) => setFaction(e.target.value)}
                className="w-full border border-border bg-card px-4 py-2.5 font-mono text-sm text-primary focus:border-border focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary/15"
              >
                <option value="">— Select clearance —</option>
                {FACTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="location"
                className="mb-1 block font-mono text-xs uppercase tracking-wider text-secondary"
              >
                Location
              </label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border border-border bg-card px-4 py-2.5 font-mono text-sm text-primary focus:border-border focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary/15"
              >
                <option value="">— Select sector —</option>
                {LOCATIONS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAccess}
            disabled={!faction}
            className="mt-8 block w-full border border-border bg-card px-6 py-3 font-mono text-sm uppercase tracking-wider text-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Access Terminal
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
