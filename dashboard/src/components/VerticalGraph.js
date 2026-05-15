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
          color: "#cbd5e1",
          font: {
            size: 13,
            weight: "500",
          },
        },
      },
      title: {
        display: true,
        text: "Portfolio Price Comparison",
        color: "#f8fafc",
        font: {
          size: 16,
          weight: "bold",
        },
        padding: {
          top: 5,
          bottom: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
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
          color: "#94a3b8",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        height: "220px",
        margin: "0 auto 15px auto",
        padding: "15px",
        background: "rgba(30, 41, 59, 0.4)",
        backdropFilter: "blur(18px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      }}
    >
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default VerticalGraph;