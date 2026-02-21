import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip);

const MUTED_COLORS = {
  ammo: "#4a443c",
  food: "#524d44",
  medical: "#5a5348",
};

function ResourceChart({ data, accentColor }) {
  const headingColor = accentColor || "#6b6358";

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color || MUTED_COLORS[d.label.toLowerCase()]),
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
      <h3 className="mb-1.5 shrink-0 font-mono text-xs uppercase tracking-wider text-[#6b6358]">
        Resource Allocation
      </h3>
      <div className="min-h-0 flex-1">
        <Doughnut data={chartData} options={options} />
      </div>
      <div
        className="mt-1.5 shrink-0 border-t border-[#2d2a24] pt-1.5 font-mono text-[10px]"
        style={{ color: headingColor }}
      >
        <div className="mb-0.5 text-[9px] uppercase tracking-wider opacity-80">
          Summary
        </div>
        {data.map((d) => (
          <div key={d.label} className="text-[#6b6358]">
            {d.label}: {d.value} units
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResourceChart;
