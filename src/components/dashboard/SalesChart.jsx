import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useSettings } from "../../contexts/SettingsContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesChart = ({ data }) => {
  const { settings } = useSettings();
  const isDarkMode = settings?.darkMode;

  // Sort data by date
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Extract labels (dates) and values
  const labels = sortedData.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  });

  const values = sortedData.map((item) => parseFloat(item.total || 0));

  // Use memo to avoid unnecessary recalculations
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Penjualan",
          data: values,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.3,
        },
      ],
    }),
    [labels, values]
  );

  // Configure options with dark mode support
  const options = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: isDarkMode ? "#e5e7eb" : "#374151",
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDarkMode
            ? "rgba(30, 41, 59, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
          titleColor: isDarkMode ? "#e5e7eb" : "#111827",
          bodyColor: isDarkMode ? "#e5e7eb" : "#374151",
          borderColor: isDarkMode ? "#4b5563" : "#e5e7eb",
          borderWidth: 1,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: isDarkMode
              ? "rgba(75, 85, 99, 0.3)"
              : "rgba(209, 213, 219, 0.5)",
          },
          ticks: {
            color: isDarkMode ? "#e5e7eb" : "#374151",
          },
        },
        x: {
          grid: {
            color: isDarkMode
              ? "rgba(75, 85, 99, 0.3)"
              : "rgba(209, 213, 219, 0.5)",
          },
          ticks: {
            color: isDarkMode ? "#e5e7eb" : "#374151",
          },
        },
      },
    }),
    [isDarkMode]
  );

  return <Line data={chartData} options={options} />;
};

export default SalesChart;
