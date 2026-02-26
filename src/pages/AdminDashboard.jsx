import { useEffect, useState } from "react";
import { BASE } from "../services/api";

import {
  FaWalking,
  FaUserClock,
  FaCheckCircle
} from "react-icons/fa";

export default function AdminDashboard() {
  const [today, setToday] = useState(0);
  const [outside, setOutside] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();

    
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const t = await api.todayStats();
      const o = await api.outsideList();

      setToday(t.todayExits || 0);
      setOutside(o.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="pro-loading">Loading Dashboard...</div>;

  return (
    <div className="pro-dashboard">

      <h2 className="pro-title">Admin Control Center</h2>

      <div className="pro-grid">

        {/* stats */}
        <Stat
          icon={<FaWalking />}
          title="Today Exits"
          value={today}
        />

        <Stat
          icon={<FaUserClock />}
          title="Students Outside"
          value={outside.length}
        />

        <Stat
          icon={<FaCheckCircle />}
          title="System Status"
          value="ACTIVE"
        />

      </div>

      {/* ===== QUICK ACTION ===== */}
      <div className="pro-actions">
        <a href="/add-student">Add Student</a>
        <a href="/risk">Risk View</a>
        <a href="/outside">Outside List</a>
      </div>

      {/* ===== MINI ANALYTICS BAR ===== */}
      <div className="pro-chart">
        <div style={{ width: `${Math.min(today * 10, 100)}%` }} />
      </div>

      {/* ===== TABLE ===== */}
      <div className="pro-table">
        <div className="pro-head">
          <div>Name</div>
          <div>Room</div>
          <div>Reason</div>
          <div>Exit</div>
        </div>

        {outside.slice(0, 6).map(x => (
          <div key={x._id} className="pro-row">
            <div>{x.name}</div>
            <div>{x.room}</div>
            <div>{x.reason}</div>
            <div>{new Date(x.exitTime).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div className="pro-card">
      <div className="pro-card-title">{title}</div>
      <div className="pro-card-value">{value}</div>
    </div>
  );
}