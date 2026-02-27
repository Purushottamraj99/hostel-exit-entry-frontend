import { useState } from "react";
import { BASE } from "../services/api";
import { QRCodeCanvas } from "qrcode.react";

export default function AddStudent() {

  const [form, setForm] = useState({
    name: "",
    room: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [toast, setToast] = useState("");
  const [errors, setErrors] = useState({});

  const onChange = (k, v) =>
    setForm({ ...form, [k]: v });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const copy = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(label + " copied");
  };

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name required";
    if (!form.room.trim()) e.room = "Room required";

    if (form.phone && !/^\d{10}$/.test(form.phone))
      e.phone = "Phone must be 10 digits";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const r = await fetch(
        `${BASE}/student/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const res = await r.json();

      if (!res.success) {
        showToast(res.message || "Failed");
        return;
      }

      setCreated({
        ...res.login,
        name: form.name,
        room: form.room,
        phone: form.phone
      });

      setForm({
        name: "",
        room: "",
        phone: ""
      });

      showToast("Student created successfully");

    } catch {
      showToast("Server error");
    } finally {
      setLoading(false);
    }
  };

  const printCard = () => {
    window.print();
  };

  return (
    <div className="add-wrap">

      {/* ===== FORM ===== */}
      <form className="card add-card" onSubmit={submit}>
        <h2>➕ Add New Student</h2>

        <Field label="Full Name"
          value={form.name}
          onChange={v => onChange("name", v)}
          error={errors.name}
        />

        <Field label="Room Number"
          value={form.room}
          onChange={v => onChange("room", v)}
          error={errors.room}
        />

        <Field label="Phone"
          value={form.phone}
          onChange={v => onChange("phone", v)}
          error={errors.phone}
        />

        <button className="btn add-btn">
          {loading ? "Creating..." : "Create Student"}
        </button>
      </form>

      {/* ===== STUDENT ID CARD ===== */}
      {created && (
        <div className="id-card">

  <div className="id-header">
    HOSTEL STUDENT ID CARD
  </div>

  <div className="id-body">

  {/* <div className="avatar">
    {created.name
      .split(" ")
      .map(x=>x[0])
      .join("")
      .slice(0,2)
      .toUpperCase()}
  </div> */}

  <div className="info-grid">

    <div className="info-label">Name</div>
    <div className="info-value">{created.name}</div>
    <div></div>

    <div className="info-label">Room</div>
    <div className="info-value">{created.room}</div>
    <div></div>

    <div className="info-label">Phone</div>
    <div className="info-value">{created.phone || "-"}</div>
    <div></div>
     
     <div className="info-label">ID</div>
    <div className="info-value">{created.studentId}</div>
    <button className="copy-btn"
      onClick={()=>copy(created.studentId,"ID")}>
      Copy
    </button>

    <div className="info-label">Password</div>
    <div className="info-value">{created.password}</div>
    <button className="copy-btn"
      onClick={()=>copy(created.password,"Password")}>
      Copy
    </button>
  </div>

  <div className="qr-wrap">
    <QRCodeCanvas
      value={`ID:${created.studentId} PASS:${created.password}`}
      size={110}
    />
  </div>

  <button className="print-btn" onClick={printCard}>
    🖨 Print ID Card
  </button>

</div>
</div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ---------- small components ---------- */

function Field({ label, value, onChange, error }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        className={`input ${error ? "input-error" : ""}`}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
}