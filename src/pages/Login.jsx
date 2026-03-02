import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE } from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {

  const nav = useNavigate();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [roleHint, setRoleHint] = useState("auto");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await api.login(data);

    if (res.success) {
      navigate("/admin");
    } else {
      alert(res.message);
    }

  } catch (err) {
    console.error(err);
    alert("Login failed");
  } finally {
    setLoading(false); // ⭐ MOST IMPORTANT
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