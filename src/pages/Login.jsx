import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE } from "../services/api";

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
      const r = await fetch(BASE + "/login", {
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

      //  store session
     localStorage.setItem("user", JSON.stringify(res.user));
     localStorage.setItem("studentId", res.user.role === "student" ? res.user.id : "");
     localStorage.setItem("studentName", res.user.role === "student" ? res.user.name : "");
     localStorage.setItem("role", res.user.role);
     

      // role redirect
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
  <div className="login-wrap">
    <form className="login-card" onSubmit={handleLogin}>

      <h2>AGC HOSTEL GATE PASS</h2>
      <p className="login-sub">Multi-Role Login</p>

      <select
        value={roleHint}
        onChange={e => setRoleHint(e.target.value)}
        className="login-input"
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
        className="login-input"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="login-input"
        required
      />

      <button className="login-btn" disabled={loading}>
        {loading ? "Checking..." : "Login"}
      </button>

      {msg && <p className="login-err">{msg}</p>}

      <p className="login-hint">
        Example: ADMIN1 / admin123
      </p>

    </form>
  </div>
  );
}