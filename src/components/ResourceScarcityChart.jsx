import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

const MUTED_COLORS = {
  ammo: "#4a443c",
  food: "#524d44",
  medical: "#5a5348",
};

function ResourceScarcityChart({ zone, listenMode, onSpeak }) {
  if (!zone?.resources) {
    return (
      <div className="flex h-full flex-col items-center justify-center font-mono text-xs text-secondary">
        No zone selected
      </div>
    );
  }

  const { ammo, food, medical } = zone.resources;
  const total = ammo + food + medical || 1;
  const data = [
    { label: "Ammo", value: Math.round((ammo / total) * 100), color: MUTED_COLORS.ammo },
    { label: "Food", value: Math.round((food / total) * 100), color: MUTED_COLORS.food },
    { label: "Medical", value: Math.round((medical / total) * 100), color: MUTED_COLORS.medical },
  ];

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color),
        borderColor: "#1a1816",
        borderWidth: 2,
        hoverOffset: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 0 },
    cutout: "62%",
    onClick: (event, elements) => {
      if (!listenMode || !onSpeak || elements.length === 0) return;
      const idx = elements[0].index;
      const d = data[idx];
      if (d) onSpeak(`Resource scarcity ${zone.name}. ${d.label}: ${d.value} percent.`);
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#25221e",
        titleColor: "#a89d90",
        bodyColor: "#6b6358",
        borderColor: "#2d2a24",
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="flex h-full flex-col">
      <h3
        className={`mb-1.5 shrink-0 font-mono text-xs uppercase tracking-wider text-[#6b6358] ${listenMode ? "cursor-pointer hover:opacity-90" : ""}`}
        role={listenMode ? "button" : undefined}
        tabIndex={listenMode ? 0 : undefined}
        onClick={() => listenMode && onSpeak?.(`Resource scarcity for ${zone.name}.`)}
        onKeyDown={(e) => listenMode && onSpeak && (e.key === "Enter" || e.key === " ") && onSpeak(`Resource scarcity for ${zone.name}.`)}
      >
        Resource Scarcity — {zone.name}
      </h3>
      <div className="min-h-0 flex-1">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="mt-1.5 shrink-0 border-t border-[#2d2a24] pt-1.5 font-mono text-[10px] text-[#6b6358]">
        {data.map((d) => (
          <div
            key={d.label}
            role={listenMode ? "button" : undefined}
            tabIndex={listenMode ? 0 : undefined}
            className={listenMode ? "cursor-pointer hover:opacity-90" : ""}
            onClick={() => listenMode && onSpeak?.(`${d.label}: ${d.value} percent.`)}
            onKeyDown={(e) => listenMode && onSpeak && (e.key === "Enter" || e.key === " ") && onSpeak(`${d.label}: ${d.value} percent.`)}
          >
            {d.label}: {d.value}%
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourceScarcityChart;
