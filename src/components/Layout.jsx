import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(window.innerWidth > 768);

  return (
    <div className={dark ? "app dark" : "app"}>
      <Sidebar open={open} />

      <div className="content">
        <header className="topbar">
          <button className="btn" onClick={() => setOpen(!open)}>
            ☰
          </button>

          <div style={{display:"flex",gap:10}}>
            <button className="btn" onClick={() => setDark(!dark)}>
              {dark ? "☀ Light" : "🌙 Dark"}
            </button>

            <button
              className="btn"
              onClick={() => {
                localStorage.removeItem("user");
                window.location = "/";
              }}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}