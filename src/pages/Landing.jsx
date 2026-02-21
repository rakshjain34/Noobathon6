import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FACTIONS, LOCATIONS } from "../data/zones";

const STAGES = [
  { name: "Runner", desc: "Early stage. Host still mobile." },
  { name: "Stalker", desc: "Vision degraded. Hearing acute." },
  { name: "Clicker", desc: "Echolocation. Lethal." },
  { name: "Bloater", desc: "Final stage. Armored. Extreme threat." },
];

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
      <div className="relative flex h-full flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <h1 className="font-heading text-4xl tracking-tight text-primary sm:text-5xl md:text-6xl">
            THE CORDYCEPS ARCHIVE
          </h1>
          <p className="mt-6 font-mono text-sm leading-relaxed text-secondary sm:text-base">
            Cordyceps Brain Infection (CBI) has reshaped the world. This terminal
            aggregates data from surviving outposts. Use it to track infection
            spread, resource distribution, and faction operations. Access is
            restricted by clearance level.
          </p>

          <div className="mt-10 border-l-2 border-border pl-4">
            <p className="font-mono text-xs uppercase tracking-wider text-secondary">
              Infection progression
            </p>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm text-primary">
              {STAGES.map((s, i) => (
                <span key={s.name}>
                  {s.name}
                  {i < STAGES.length - 1 && (
                    <span className="mx-1 text-border">→</span>
                  )}
                </span>
              ))}
            </div>
            <p className="mt-2 font-mono text-xs text-secondary">
              Runner → Stalker → Clicker → Bloater
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
