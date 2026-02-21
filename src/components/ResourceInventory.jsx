const INVENTORY_ITEMS = [
  { key: "medkits", label: "Medkits" },
  { key: "ammo", label: "Ammo" },
  { key: "rags", label: "Rags" },
  { key: "alcohol", label: "Alcohol" },
  { key: "tradingCards", label: "Trading Cards" },
];

function ResourceInventory({ inventory }) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-2 shrink-0 font-mono text-xs uppercase tracking-wider text-[#6b6358]">
        Resource Inventory
      </h3>
      <div className="min-h-0 flex-1 space-y-2">
        {INVENTORY_ITEMS.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center justify-between border-b border-[#2d2a24] pb-1.5 font-mono text-[11px]"
          >
            <span className="text-secondary">{label}</span>
            <span className="font-medium text-primary">{inventory[key] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourceInventory;
