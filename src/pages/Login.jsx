import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {

  const nav = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [roleHint, setRoleHint] = useState("auto");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

  try {

    setLoading(true);

    const res = await api.login(id, password, roleHint);

    if (!res.success) {
      setMsg(res.message || "Login failed");
      return;
    }

    // SAVE SESSION
    const user = {
      ...res.user,
      role: (res.user?.role || "").toLowerCase(),
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("role", user.role);

    // ⭐ IMPORTANT FIX (ensure student id/name are always stored for student users)
    if (user.role === "student") {
      localStorage.setItem("studentId", user.id);
      localStorage.setItem("studentName", user.name);
    } else {
      localStorage.removeItem("studentId");
      localStorage.removeItem("studentName");
    }

    const role = user.role;

    if (role === "admin") nav("/admin");
    else if (role === "warden") nav("/warden");
    else if (role === "guard") nav("/guard");
    else nav("/student");

  } catch (err) {

    console.error(err);
    setMsg("Server not reachable");

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="login-wrap">

      <form className="login-card" onSubmit={handleLogin}>

        <h2>AGC HOSTEL GATE PASS</h2>
        <p className="sub">Multi-Role Login</p>

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
          className="login-input"
          placeholder="User ID"
          value={id}
          onChange={e => setId(e.target.value)}
          required
        />

        {/* PASSWORD WITH ICON */}

        <div className="pass-wrap">

          <input
            className="login-input"
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <span
            className="eye"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <FaEyeSlash /> : <FaEye />}
          </span>

        </div>

        <button className="login-btn" disabled={loading}>
          {loading ? "Checking..." : "Login"}
        </button>

        {msg && <p className="err">{msg}</p>}

        <p className="hint">
          Example: ADMIN1 / admin123
        </p>

      </form>

    </div>
  );
}