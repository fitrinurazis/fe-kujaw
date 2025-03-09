import { Bar } from "react-chartjs-2";
import { useMemo } from "react";
import PropTypes from "prop-types";
import { useSettings } from "../../contexts/SettingsContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const IncomeExpenseChart = ({ data }) => {
  const { settings } = useSettings();
  const isDarkMode = settings?.darkMode;

  // Create a date object from month and year
  const getDateFromMonthYear = (month, year) => {
    // Month is 0-indexed in JavaScript Date (0 = January, 11 = December)
    return new Date(year, month - 1, 1);
  };

  // Sort data by date (year and month)
  const sortedData = [...data].sort((a, b) => {
    const dateA = getDateFromMonthYear(a.month, a.year);
    const dateB = getDateFromMonthYear(b.month, b.year);
    return dateA - dateB;
  });

  // Group data by month-year for aggregating totals
  const groupedData = {};

  sortedData.forEach((item) => {
    const key = `${item.year}-${item.month}`;
    if (!groupedData[key]) {
      groupedData[key] = {
        pemasukan: 0,
        pengeluaran: 0,
        month: item.month,
        year: item.year,
      };
    }

    if (item.type === "pemasukan") {
      groupedData[key].pemasukan += parseFloat(item.total || 0);
    } else if (item.type === "pengeluaran") {
      groupedData[key].pengeluaran += parseFloat(item.total || 0);
    }
  });

  // Convert the grouped data back to arrays for the chart
  const timeKeys = Object.keys(groupedData).sort();
  const uniqueLabels = timeKeys.map((key) => {
    const { month, year } = groupedData[key];
    const date = getDateFromMonthYear(month, year);
    return date.toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });
  });

  const incomeValues = timeKeys.map((key) => groupedData[key].pemasukan);
  const expenseValues = timeKeys.map((key) => groupedData[key].pengeluaran);

  const chartData = useMemo(
    () => ({
      labels: uniqueLabels,
      datasets: [
        {
          label: "Pendapatan",
          data: incomeValues,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
        },
        {
          label: "Pengeluaran",
          data: expenseValues,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 1,
        },
      ],
    }),
    [uniqueLabels, incomeValues, expenseValues]
  );

  // Options with dark mode support
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

  return <Bar data={chartData} options={options} />;
};
IncomeExpenseChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
      type: PropTypes.oneOf(["pemasukan", "pengeluaran"]).isRequired,
      total: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
    })
  ).isRequired,
};

export default IncomeExpenseChart;
