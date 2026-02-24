import { useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    document.body.classList.toggle("dark");
    setDark(!dark);
  };

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <header className="navbar">
      <h2 className="logo">🏫 HOSTEL GATE PASS</h2>

      <div className="nav-right">
        <button className="btn" onClick={toggleDark}>
          {dark ? "☀ Light" : "🌙 Dark"}
        </button>

        <button className="btn logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}