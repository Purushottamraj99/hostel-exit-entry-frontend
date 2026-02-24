import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE = "http://localhost:5000";

export default function Login() {
  const nav = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [roleHint, setRoleHint] = useState("auto");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const r = await fetch(BASE + "/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password, roleHint })
      });

      const res = await r.json();

      if (!res.success) {
        setMsg(res.message || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ store session
     localStorage.setItem("user", JSON.stringify(res.user));
     localStorage.setItem("studentId", res.user.role === "student" ? res.user.id : "");
     localStorage.setItem("studentName", res.user.role === "student" ? res.user.name : "");
     localStorage.setItem("role", res.user.role);
     

      // ✅ role redirect
      const role = res.user.role;

      if (role === "admin") nav("/admin");
      else if (role === "warden") nav("/warden");
      else if (role === "guard") nav("/guard");
      else nav("/student");

    } catch (e) {
      setMsg("Server not reachable");
    }

    setLoading(false);
  };

  return (
    <div style={wrap}>
      <form style={card} onSubmit={handleLogin}>

        <h2>HOSTEL GATE PASS</h2>
        <p style={sub}>Multi-Role Login</p>

        {/* ROLE SELECT */}
        <select
          value={roleHint}
          onChange={e => setRoleHint(e.target.value)}
          style={input}
        >
          <option value="auto">Auto Detect Role</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
          <option value="warden">Warden</option>
          <option value="guard">Guard</option>
        </select>

        <input
          placeholder="User ID"
          value={id}
          onChange={e => setId(e.target.value)}
          style={input}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={input}
          required
        />

        <button style={btn} disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>

        {msg && <p style={err}>{msg}</p>}

        <p style={hint}>
          Example: ADMIN1 / admin123
        </p>

      </form>
    </div>
  );
}

/* ---- styles ---- */

const wrap = {
  textAlign: "center",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  h2: {
    fontWeight: "bold"
  },
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background:
    "linear-gradient(135deg,#1e3c72,#2a5298)"
};

const card = {
  background: "white",
  padding: 40,
  borderRadius: 18,
  width: 380,
  display: "grid",
  gap: 14,
  boxShadow: "0 25px 60px rgba(0,0,0,0.25)"
};

const sub = {
  margin: 0,
  textAlign: "center",
  color: "#666",
  fontSize: "15px",
};

const input = {
  padding: 13,
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 14
};

const btn = {
  padding: 14,
  borderRadius: 12,
  border: "none",
  background: "#2563eb",
  color: "white",
  fontSize: 16,
  cursor: "pointer"
};

const err = {
  color: "crimson",
  textAlign: "center"
};

const hint = {
  fontSize: 12,
  textAlign: "center",
  color: "#888"
};

