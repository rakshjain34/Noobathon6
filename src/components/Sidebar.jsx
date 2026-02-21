import { useNavigate } from "react-router-dom";

function StatusBar({ label, value, level }) {
  const levelColor =
    level === "critical"
      ? "bg-[#7a6348]"
      : level === "high"
        ? "bg-[#6b5f48]"
        : level === "medium"
          ? "bg-[#4d4a40]"
          : "bg-border";
  return (
    <div className="font-mono">
      <p className="text-xs uppercase tracking-wider text-secondary">{label}</p>
      <div className="mt-1 h-1.5 w-full overflow-hidden border border-border bg-card">
        <div
          className={`h-full transition-all duration-300 ${levelColor}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function Sidebar({ config, accentColor, listenMode, onListenModeChange }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("turningPoint_role");
    localStorage.removeItem("turningPoint_location");
    navigate("/");
  };

  return (
    <aside
      className={`relative flex w-56 shrink-0 flex-col overflow-hidden border-r border-border bg-card transition-[filter] duration-300 md:w-64 ${
        listenMode ? "contrast-[1.08]" : ""
      }`}
      style={{ borderLeft: `3px solid ${accentColor}` }}
    >
      <div className="panel-texture absolute inset-0" aria-hidden />
      <div className="border-b border-border p-4">
        <h2 className="font-heading text-lg font-semibold text-primary">
          {config.factionName}
        </h2>
      </div>
      <div className="flex-1 space-y-4 border-b border-border p-4">
        <p className="font-mono text-xs leading-relaxed text-secondary">
          {config.sidebarNote}
        </p>
        <StatusBar
          label="Health Status"
          value={config.healthStatus}
          level={config.healthLevel}
        />
        <StatusBar
          label="Infection Risk"
          value={config.infectionRisk}
          level={config.infectionLevel}
        />
      </div>
      <div className="space-y-2 border-b border-border p-4">
        <label className="flex cursor-pointer items-center gap-2 font-mono text-xs text-secondary">
          <input
            type="checkbox"
            checked={listenMode}
            onChange={(e) => onListenModeChange(e.target.checked)}
            className="h-3 w-3 border-border bg-card accent-survivor"
          />
          Listen Mode
        </label>
      </div>
      <div className="p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full py-2 font-mono text-xs text-secondary transition-colors hover:text-primary"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
