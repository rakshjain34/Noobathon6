const INVENTORY_ITEMS = [
  { key: "medkits", label: "Medkits" },
  { key: "ammo", label: "Ammo" },
  { key: "rags", label: "Rags" },
  { key: "alcohol", label: "Alcohol" },
  { key: "tradingCards", label: "Trading Cards" },
];

function ResourceInventory({ inventory, listenMode, onSpeak }) {
  return (
    <div className="flex h-full flex-col">
      <h3
        className={`mb-2 shrink-0 font-mono text-xs uppercase tracking-wider text-[#6b6358] ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
        role={listenMode ? "button" : undefined}
        tabIndex={listenMode ? 0 : undefined}
        onClick={() => listenMode && onSpeak?.("Resource inventory.")}
        onKeyDown={(e) => listenMode && onSpeak && (e.key === "Enter" || e.key === " ") && onSpeak("Resource inventory.")}
      >
        Resource Inventory
      </h3>
      <div className="min-h-0 flex-1 space-y-2">
        {INVENTORY_ITEMS.map(({ key, label }) => {
          const value = inventory[key] ?? 0;
          return (
            <div
              key={key}
              className={`flex items-center justify-between border-b border-[#2d2a24] pb-1.5 font-mono text-[11px] ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
              role={listenMode ? "button" : undefined}
              tabIndex={listenMode ? 0 : undefined}
              onClick={() => listenMode && onSpeak?.(`${label}: ${value}.`)}
              onKeyDown={(e) => listenMode && onSpeak && (e.key === "Enter" || e.key === " ") && onSpeak(`${label}: ${value}.`)}
            >
              <span className="text-secondary">{label}</span>
              <span className="font-medium text-primary">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ResourceInventory;
