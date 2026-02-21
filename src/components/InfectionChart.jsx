import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

function InfectionChart({ data, accentColor, latestByZone }) {
  const primaryColor = accentColor || "#6b6358";
  const lastValue = data?.datasets?.[0]?.data?.slice(-1)[0];

  const chartData = {
    labels: data?.labels ?? [],
    datasets: (data?.datasets ?? []).map((ds) => ({
      ...ds,
      borderColor: primaryColor,
      backgroundColor: `${primaryColor}18`,
      fill: true,
      tension: 0.35,
      borderWidth: 1.5,
      pointRadius: 2,
      pointHoverRadius: 3,
      pointBackgroundColor: primaryColor,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 4, right: 4, bottom: 0, left: 0 } },
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
    scales: {
      x: {
        display: true,
        grid: { color: "rgba(45,42,36,0.25)", drawTicks: false },
        ticks: { color: "#5a5348", font: { size: 9 }, maxRotation: 0 },
      },
      y: {
        display: true,
        grid: { color: "rgba(45,42,36,0.25)", drawTicks: false },
        ticks: { color: "#5a5348", font: { size: 9 } },
      },
    },
  };

  const summaryItems = latestByZone?.length
    ? latestByZone
    : lastValue != null
      ? [{ name: "Latest", value: lastValue }]
      : [];

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-1.5 shrink-0 font-mono text-xs uppercase tracking-wider text-[#6b6358]">
        7-Day Infection Trend
      </h3>
      <div className="min-h-0 flex-1">
        <Line data={chartData} options={options} />
      </div>
      {summaryItems.length > 0 && (
        <div className="mt-1.5 shrink-0 border-t border-[#2d2a24] pt-1.5 font-mono text-[10px] text-[#6b6358]">
          {summaryItems.map(({ name, value }) => (
            <div key={name}>
              {name}: {value}%
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default InfectionChart;
