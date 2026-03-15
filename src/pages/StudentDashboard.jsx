import { useEffect, useState } from "react";
import { api } from "../services/api";

import {
  FaUserGraduate,
  FaWalking,
  FaExclamationTriangle,
  FaClock,
  FaChartLine
} from "react-icons/fa";

export default function StudentDashboard() {

  const id = localStorage.getItem("studentId");
  const name = localStorage.getItem("studentName");

  const [risk, setRisk] = useState(null);
  const [today, setToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    load();
  }, [id, load]);

  async function load() {
    try {
      setLoading(true);

      const [r, t] = await Promise.all([
        api.getRisk(id),
        api.todayStats()
      ]);

      setRisk(r);
      setToday(t.todayExits ?? 0);

    } finally {
      setLoading(false);
    }
  }

  if (!id) return <div className="card">No session found</div>;
  if (loading) return <div className="card">Loading...</div>;

  const riskLevel = risk?.riskLevel || "LOW";

  return (
    <div className="student-dashboard">

      {/* HEADER */}
      <div className="card student-header">
        <div>
          <h2>
            <FaUserGraduate /> Welcome, {name}
          </h2>
          <p className="muted">ID: {id}</p>
        </div>

        <button className="btn" onClick={load}>
          Refresh
        </button>
      </div>

      {/* STATS */}
      <div className="student-stats">

        <StatCard
          icon={<FaWalking />}
          title="Today Exits"
          value={today}
        />

        <StatCard
          icon={<FaChartLine />}
          title="Risk Score"
          value={risk?.riskScore ?? 0}
        />

      </div>

      {/* RISK PANEL */}
      <div className="card student-risk">

        <h3>
          <FaExclamationTriangle /> Risk Analysis
        </h3>

        <span className={`risk-badge ${riskLevel.toLowerCase()}`}>
          {riskLevel}
        </span>

        <div className="risk-grid">

          <div>
            <p className="muted">
              <FaClock /> Late Returns
            </p>
            <h2>{risk?.lateReturns ?? 0}</h2>
          </div>

          <div>
            <p className="muted">
              <FaWalking /> Total Exits
            </p>
            <h2>{risk?.totalExits ?? 0}</h2>
          </div>

        </div>

      </div>

    </div>
  );
}

/* ===== COMPONENT ===== */

function StatCard({ icon, title, value }) {
  return (
    <div className="card student-stat-card">
      <p className="muted stat-title">
        {icon} {title}
      </p>
      <h1>{value}</h1>
    </div>
  );
}