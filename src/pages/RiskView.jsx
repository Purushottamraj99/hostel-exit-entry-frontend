import { useEffect, useState } from "react";
import { api } from "../services/api";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function RiskView() {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const r = await api.outsideList();
    setLogs(r.data || []);
  };

  /* ===== aggregates ===== */

  const byCategory = {};
  let late = 0;

  logs.forEach(x => {
    byCategory[x.reasonCategory] =
      (byCategory[x.reasonCategory] || 0) + 1;

    if (x.lateReturn) late++;
  });

  const catLabels = Object.keys(byCategory);
  const catValues = Object.values(byCategory);

  const barData = {
    labels: catLabels,
    datasets: [{
      label: "Exits by Category",
      data: catValues
    }]
  };

  const doughnutData = {
    labels: ["Late Return", "On Time"],
    datasets: [{
      data: [late, logs.length - late]
    }]
  };

  return (
    <div className="risk-page">

      <h2>📊 Risk Analytics Dashboard</h2>

      {/* TOP STATS */}
      <div className="risk-top">

        <Card title="Outside Now" value={logs.length} />
        <Card title="Late Returns" value={late} />

        <button className="btn risk-refresh" onClick={load}>
          Refresh
        </button>

      </div>

      {/* CHARTS */}
      <div className="risk-chart-grid">

        <div className="card chart-card">
          <h3>Exit Reason Categories</h3>

          {logs.length === 0
            ? <p className="muted">No data</p>
            : <Bar data={barData} />}
        </div>

        <div className="card chart-card">
          <h3>Late Return Ratio</h3>

          {logs.length === 0
            ? <p className="muted">No data</p>
            : <Doughnut data={doughnutData} />}
        </div>

      </div>

    </div>
  );
}

/* ---------- small components ---------- */

function Card({ title, value }) {
  return (
    <div className="card risk-stat">
      <div className="muted">{title}</div>
      <div className="risk-value">{value}</div>
    </div>
  );
}