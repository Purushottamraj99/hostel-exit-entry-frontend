import { useState } from "react";
import { api } from "../services/api";

export default function ExitForm() {

  const studentId = localStorage.getItem("studentId");

  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {

    if (!studentId) {
      setMsg("Student session not found");
      return;
    }

    if (!reason.trim()) {
      setMsg("Reason required");
      return;
    }

    try {

      setLoading(true);
      setMsg("");

      const res = await api.exitRequest(studentId, reason);

      if (!res.success) {
        setMsg(res.message || "Request failed");
        return;
      }

      setMsg("Exit request sent to warden. Waiting for approval.");

      setReason("");

    } catch (e) {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="exit-page">

      <div className="card exit-card">

        <h2>🚪 Mark Exit</h2>

        <p className="muted">
          Enter reason before leaving hostel
        </p>

        <textarea
          className="input exit-text"
          placeholder="Example: Market / Medical / Library..."
          value={reason}
          onChange={e => setReason(e.target.value)}
        />

        <button
          className="btn exit-btn"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Exit"}
        </button>

        {msg && <p className="exit-msg">{msg}</p>}

      </div>

    </div>
  );
}