import { useNavigate } from "react-router-dom";

const RISK_LABELS = { low: "Low", medium: "Medium", high: "Critical", critical: "Critical" };

function StatusBar({ label, value, level, showRiskLabel }) {
  const levelColor =
    level === "critical" || level === "high"
      ? "bg-[#7a6348]"
      : level === "medium"
        ? "bg-[#6b5f48]"
        : "bg-[#4d4a40]";
  const riskLabel = showRiskLabel ? RISK_LABELS[level] || level : null;
  return (
    <div className="font-mono">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-secondary">{label}</p>
        {riskLabel && (
          <span className="text-[10px] uppercase tracking-wider text-secondary">{riskLabel}</span>
        )}
      </div>
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
    localStorage.removeItem("turningPoint_calibrated");
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
        {config.objective && (
          <div className="border-l-2 border-border pl-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-secondary">
              Objective
            </p>
            <p className="mt-0.5 font-mono text-xs text-primary">
              {config.objective}
            </p>
          </div>
        )}
        <StatusBar
          label="Health Status"
          value={config.healthStatus}
          level={config.healthLevel}
        />
        <StatusBar
          label="Infection Risk"
          value={config.infectionRisk}
          level={config.infectionLevel}
          showRiskLabel
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
