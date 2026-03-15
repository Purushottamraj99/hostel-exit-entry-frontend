import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function ExitForm() {

  const studentId = localStorage.getItem("studentId");

  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasPending, setHasPending] = useState(false);

  useEffect(() => {
    if (studentId) {
      checkPending();
    }
  }, [studentId]);

  async function checkPending() {

    try {

      const res = await api.myRequests(studentId);

      const pending = (res.data || []).find(
        x => x.approvalStatus === "PENDING"
      );

      setHasPending(!!pending);

    } catch (e) {
      console.log(e);
    }

  }

  const submit = async () => {

    if (!studentId) {
      setMsg("Student session not found");
      return;
    }

    if (hasPending) {
      setMsg("You already have a pending exit request");
      return;
    }

    if (!reason.trim()) {
      setMsg("Reason required");
      return;
    }

    try {

      setLoading(true);
      setMsg("");

      const res = await api.exit(studentId, reason);

      if (!res.success) {
        setMsg(res.message || "Request failed");
        return;
      }

      setMsg("Exit request sent to warden. Waiting for approval.");

      setReason("");

      checkPending();

    } catch {
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
          disabled={loading || hasPending}
        >
          {loading ? "Submitting..." : "Submit Exit"}
        </button>

        {msg && <p className="exit-msg">{msg}</p>}

      </div>

    </div>
  );
}