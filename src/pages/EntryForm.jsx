import { useState } from "react";
import { api } from "../services/api";

export default function EntryForm() {

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {

    const studentId = localStorage.getItem("studentId");

    // 🔥 safety check
    if (!studentId) {
      setMsg("Login expired. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setMsg("");

     const res = await api.entry(studentId);
      console.log("ENTRY RESPONSE:", res);

      if (!res.success) {
        setMsg(res.message || "Entry failed");
        return;
      }

      setMsg("Entry recorded successfully");

    } catch {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entry-page">

      <div className="card entry-card">

        <h2>🏠 Mark Entry</h2>

        <p className="muted">
          Click when you return to hostel
        </p>

        <button
          className="btn entry-btn"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Mark Entry"}
        </button>

        {msg && <p className="entry-msg">{msg}</p>}

      </div>
    </div>
  );
}