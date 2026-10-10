import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const today = new Date();
const day = today.getDay();

const labels = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
].map((label, index) => {
  const currentDayIndex = (index + 1) % 7;

  return currentDayIndex === day ? `${label} (Hari Ini)` : label;
});
const options = {
  responsive: true,
  scales: {
    x: {
      ticks: {
        color: (context: any) => {
          const label = labels[context.index];

          return label.includes("(Hari Ini)") ? "#4f46e5" : "#64748b";
        },
      },
    },
  },
};

const data = {
  labels,
  datasets: [
    {
      label: "Stock In",
      data: [8031, 5893, 12308, 10223, 9340, 10234, 8123],
      backgroundColor: "rgb(0 108 73)",
    },
    {
      label: "Stock Out",
      data: [7023, 6209, 10231, 6823, 9031, 9312, 6091],
      backgroundColor: "rgb(186 26 26)",
    },
  ],
};

export function BarChart() {
  return <Bar options={options} data={data} />;
}
