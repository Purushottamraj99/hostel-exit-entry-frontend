import { useEffect, useState } from "react";
import { api, BASE} from "../services/api";

export default function OutsideList() {

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

const load = async () => {
  try {
    setLoading(true);

    const r = await api.outsideList();
  
     setRows(Array.isArray(r.data) ? r.data : []);

  } catch (e) {
    console.log(e);
    alert("Load failed");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="outside-page">

      <div className="outside-top">
        <h2>🚶 Currently Outside Students</h2>

        <button className="btn refresh-btn" onClick={load}>
          Refresh
        </button>
      </div>

      <div className="outside-count card">
        Total Outside: <b>{rows.length}</b>
      </div>

      <div className="outside-table card">

        <div className="outside-head">
          <div>Name</div>
          <div>Room</div>
          <div>Reason</div>
          <div>Category</div>
          <div>Exit Time</div>
          <div>Pass</div>
        </div>

        {loading && (
          <div className="outside-empty">
            Loading data...
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div className="outside-empty">
            No students outside
          </div>
        )}

        {!loading && Array.isArray(rows) && rows.map(x => (
          <div key={x._id} className="outside-row">

            <div>{x.name}</div>
            <div>{x.room}</div>
            <div className="reason">{x.reason}</div>

            <div>
              <span className="badge" style={badge(x.reasonCategory)}>
                {x.reasonCategory}
              </span>
            </div>

            <div>{fmt(x.exitTime)}</div>

            <div>
              <a
                className="pdf-btn"
                href={`${BASE}/api/pass/${x._id}`}
                target="_blank"
                rel="noreferrer"
              >
                PDF
              </a>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
}

/* helpers */

function fmt(t) {
  if (!t) return "-";

  const d = new Date(t);
  if (isNaN(d.getTime())) return "-";

  return d.toLocaleString("en-IN");
}

function badge(type) {
  const map = {
    MEDICAL: "#dc2626",
    ACADEMIC: "#2563eb",
    HOME: "#7c3aed",
    PERSONAL: "#059669",
    EMERGENCY: "#b91c1c",
    OTHER: "#6b7280"
  };

  return { background: map[type] || "#6b7280" };
}