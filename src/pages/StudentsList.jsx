import { useEffect, useState } from "react";
import { BASE } from "../services/api";

export default function StudentsList() {

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

      const r = await fetch(`${BASE}/api/student/list`);
      const d = await r.json();

      setData(d || []);
    } finally {
      setLoading(false);
    }
  };

  /* ===== DELETE ===== */
  const deleteStudent = async (id) => {
    const ok = window.confirm("Delete this student?");
    if (!ok) return;

    await fetch(`${BASE}/api/student/${id}`, {
      method: "DELETE"
    });

    load();
  };

  /* ===== EDIT SAVE ===== */
  const saveEdit = async () => {
    await fetch(`${BASE}/api/student/${editData.studentId}`, {
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
    s.studentId?.toLowerCase().includes(search.toLowerCase()) ||
    s.room?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="students-page">

      {/* ===== TOP ===== */}
      <div className="students-top">
        <h2>🎓 Students List</h2>

        <input
          className="students-search"
          placeholder="Live search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="students-count">
        Total Students: <b>{filtered.length}</b>
      </div>

      {/* ===== TABLE ===== */}
      <div className="students-table-wrap">

        <div className="students-thead">
          <div>ID</div>
          <div>Name</div>
          <div>Room</div>
          <div>Phone</div>
          {/* <div>Actions</div> */}
        </div>

        {loading && (
          <div className="students-empty">Loading...</div>
        )}

        {!loading && filtered.map(s => (
          <div key={s.studentId} className="students-row">

            <div>{s.studentId}</div>
            <div>{s.name}</div>
            <div>{s.room}</div>
            <div>{s.phone || "-"}</div>

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
                onClick={() => deleteStudent(s.studentId)}
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
            <h3>Student Profile</h3>

            <p><b>ID:</b> {selected.studentId}</p>
            <p><b>Name:</b> {selected.name}</p>
            <p><b>Room:</b> {selected.room}</p>
            <p><b>Phone:</b> {selected.phone}</p>

            <button className="close-btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editData && (
        <div className="modal-bg" onClick={() => setEditData(null)}>
          <div className="modal card" onClick={e => e.stopPropagation()}>
            <h3>Edit Student</h3>

            <input
              value={editData.name}
              onChange={e =>
                setEditData({ ...editData, name: e.target.value })
              }
            />

            <input
              value={editData.room}
              onChange={e =>
                setEditData({ ...editData, room: e.target.value })
              }
            />

            <input
              value={editData.phone}
              onChange={e =>
                setEditData({ ...editData, phone: e.target.value })
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