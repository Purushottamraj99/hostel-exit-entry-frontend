import { useEffect, useState } from "react";
import { BASE } from "../services/api";

export default function StaffList() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selected, setSelected] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const r = await fetch(`${BASE}/staff/list`);
      const d = await r.json();

      setData(d || []);
    } finally {
      setLoading(false);
    }
  };

  /* ===== DELETE ===== */
  const deleteStaff = async (id) => {
    const ok = window.confirm("Delete this staff?");
    if (!ok) return;

    await fetch(`${BASE}/staff/${id}`, {
      method: "DELETE"
    });

    load();
  };

  /* ===== EDIT SAVE ===== */
  const saveEdit = async () => {
    await fetch(`${BASE}/student/${editData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData)
    });

    setEditData(null);
    load();
  };

  /* ===== LIVE SEARCH ===== */
  const filtered = data.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    (s.staffId || s.userId || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    s.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="students-page">

      {/* ===== TOP ===== */}
      <div className="students-top">
        <h2>👮 Staff List</h2>

        <input
          className="students-search"
          placeholder="Live search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="students-count">
        Total Staff: <b>{filtered.length}</b>
      </div>

      {/* ===== TABLE ===== */}
      <div className="students-table-wrap">

        <div className="students-thead">
          <div>ID</div>
          <div>Name</div>
          <div>Role</div>
          <div>Mobile</div>
        </div>

        {loading && (
          <div className="students-empty">Loading...</div>
        )}

        {!loading && filtered.map(s => (
          <div key={s._id} className="students-row">

            <div>{s.staffId || s.userId || "-"}</div>
            <div>{s.name || "-"}</div>
            <div>{s.role}</div>
            <div>{s.mobile || "-"}</div>

            <div className="actions">

              <button
                className="view-btn"
                onClick={() => setSelected(s)}
              >
                View
              </button>

              <button
                className="edit-btn"
                onClick={() => setEditData({ ...s })}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteStaff(s._id)}
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* ===== VIEW MODAL ===== */}
      {selected && (
        <div className="modal-bg" onClick={() => setSelected(null)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <h3>Staff Profile</h3>

            <p><b>ID:</b> {selected.staffId || selected.userId}</p>
            <p><b>Name:</b> {selected.name}</p>
            <p><b>Role:</b> {selected.role}</p>
            <p><b>Mobile:</b> {selected.mobile || "-"}</p>
            <p><b>Email:</b> {selected.email || "-"}</p>

            <button
              className="close-btn"
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editData && (
        <div className="modal-bg" onClick={() => setEditData(null)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <h3>Edit Staff</h3>

            <input
              value={editData.name || ""}
              onChange={e =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <input
              value={editData.mobile || ""}
              onChange={e =>
                setEditData({ ...editData, mobile: e.target.value })
              }
            />

            <input
              value={editData.role || ""}
              onChange={e =>
                setEditData({ ...editData, role: e.target.value })
              }
            />

            <button className="save-btn" onClick={saveEdit}>
              Save Changes
            </button>

          </div>
        </div>
      )}

    </div>
  );
}