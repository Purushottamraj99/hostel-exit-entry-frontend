import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function WardenDashboard() {

  const [requests, setRequests] = useState([]);
  const [today, setToday] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const o = await api.exitRequests();   // 🔹 pending requests
      const t = await api.todayStats();

      setRequests(o.data || []);
      setToday(t.todayExits || 0);

    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      await api.approveExit(id);
      load();
    } catch (e) {
      console.log(e);
    }
  };

  const reject = async (id) => {
    try {
      await api.rejectExit(id);
      load();
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) return <div>Loading warden dashboard...</div>;

  return (
    <div>

      <h2 style={{ marginBottom: 20 }}>Warden Dashboard</h2>

      {/* ===== TOP CARDS ===== */}
      <div style={grid}>
        <Card title="Pending Exit Requests" value={requests.length} color="#dc2626" />
        <Card title="Today Exits" value={today} color="#2563eb" />
      </div>

      {/* ===== ACTION BAR ===== */}
      <div style={bar}>
        <button style={btn} onClick={load}>Refresh Data</button>
        <a href="/risk" style={btnLink}>Risk Analysis</a>
      </div>

      {/* ===== REQUEST LIST ===== */}
      <h3>Pending Exit Requests</h3>

      <div style={table}>
        <div style={thead}>
          <div>Name</div>
          <div>Room</div>
          <div>Reason</div>
          <div>Category</div>
          <div>Time</div>
          <div>Action</div>
        </div>

        {requests.map(x => (
          <div key={x._id} style={row}>

            <div>{x.name}</div>
            <div>{x.room}</div>
            <div>{x.reason}</div>

            <div>
              <span style={tag(x.reasonCategory)}>
                {x.reasonCategory}
              </span>
            </div>

            <div>
              {new Date(x.createdAt || x.exitTime).toLocaleTimeString()}
            </div>

            <div style={{ display: "flex", gap: "6px" }}>

              <button
                style={{ ...btn, background:"#059669" }}
                onClick={() => approve(x._id)}
              >
                Approve
              </button>

              <button
                style={{ ...btn, background:"#dc2626" }}
                onClick={() => reject(x._id)}
              >
                Reject
              </button>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div style={{ ...card, borderLeft: `8px solid ${color}` }}>
      <div style={{ fontSize: 13, opacity: 0.7 }}>{title}</div>
      <div style={{ fontSize: 30, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

/* ===== styles ===== */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
  gap: 20
};

const card = {
  background: "white",
  padding: 22,
  borderRadius: 14,
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
};

const bar = {
  display: "flex",
  gap: 12,
  margin: "20px 0"
};

const btn = {
  padding: "10px 16px",
  borderRadius: 10,
  border: 0,
  background: "#0f172a",
  color: "white",
  cursor: "pointer"
};

const btnLink = {
  ...btn,
  textDecoration: "none",
  display: "inline-block"
};

const table = {
  background: "white",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)"
};

const thead = {
  display: "grid",
  gridTemplateColumns: "1.3fr .7fr 2fr 1fr 1fr .8fr",
  background: "#0f172a",
  color: "white",
  padding: 12,
  fontWeight: 600
};

const row = {
  display: "grid",
  gridTemplateColumns: "1.3fr .7fr 2fr 1fr 1fr .8fr",
  padding: 12,
  borderTop: "1px solid #e5e7eb",
  fontSize: 14
};

function tag(type) {
  const map = {
    MEDICAL: "#dc2626",
    ACADEMIC: "#2563eb",
    HOME: "#7c3aed",
    PERSONAL: "#059669",
    EMERGENCY: "#b91c1c",
    OTHER: "#6b7280"
  };

  return {
    padding: "4px 8px",
    borderRadius: 8,
    color: "white",
    fontSize: 12,
    background: map[type] || "#6b7280"
  };
}