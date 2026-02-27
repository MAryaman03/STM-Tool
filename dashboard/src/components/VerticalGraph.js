import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VerticalGraph = ({ data }) => {

  // 🔒 Defensive validation
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data.labels) || data.labels.length === 0) {
      return null;
    }

    return {
      labels: data.labels,
      datasets: data.datasets.map(dataset => ({
        ...dataset,
        borderRadius: 8,
        barThickness: 30,
      })),
    };
  }, [data]);

  if (!chartData) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        No graph data available
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutCubic",
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#030303",
          font: {
            size: 13,
            weight: "600",
          },
        },
      },
      title: {
        display: true,
        text: "Portfolio Price Comparison",
        color: "#111",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 25,
        },
      },
      tooltip: {
        backgroundColor: "#111",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        borderColor: "#333",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#000000",
          font: {
            weight: "500",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#000000",
        },
        grid: {
          color: "rgb(0, 0, 0)",
        },
      },
    },
  };

  return (
  <div
  style={{
    width: "100%",
    maxWidth: "900px",
    height: "350px",
    margin: "40px auto",
    padding: "25px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    borderRadius: "20px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
  }}
>
  <Bar options={options} data={data} />
</div>
  );
};

export default VerticalGraph;