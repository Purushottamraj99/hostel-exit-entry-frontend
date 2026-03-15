import { NavLink } from "react-router-dom";
import { getUser } from "../utils/auth";

import {
  FaHome,
  FaUserPlus,
  FaUsers,
  FaUserShield,
  FaList,
  FaChartLine,
  FaQrcode,
  FaSignOutAlt,
  FaUserGraduate
} from "react-icons/fa";

export default function Sidebar({ open }) {
  const user = getUser();
  if (!user) return null;

  const role = user.role;

  const menus = {
    student: [
      { to: "/student", label: "My Dashboard", icon: <FaUserGraduate /> },
      { to: "/exit", label: "Exit Form", icon: <FaSignOutAlt /> },
      { to: "/entry", label: "Entry Form", icon: <FaHome /> },
      { to: "/my-requests", label: "My Requests", icon: <FaList /> },
    ],

    admin: [
      { to: "/admin", label: "Dashboard", icon: <FaHome /> },
      { to: "/add-student", label: "Add Student", icon: <FaUserPlus /> },
      { to: "/students", label: "Students List", icon: <FaUsers /> },
      { to: "/outside", label: "Outside List", icon: <FaList /> },
      { to: "/risk", label: "Risk View", icon: <FaChartLine /> },
      { to: "/add-staff", label: "Add Staff", icon: <FaUserPlus /> },
      { to: "/staff-list", label: "Staff List", icon: <FaUsers /> },
    ],

    warden: [
      { to: "/warden", label: "Dashboard", icon: <FaHome /> },
      { to: "/outside", label: "Outside List", icon: <FaList /> },
      { to: "/risk", label: "Risk Analysis", icon: <FaChartLine /> }
    ],

    guard: [
      { to: "/guard", label: "QR Verify", icon: <FaQrcode /> }
    ]
  };

  return (
    <aside className={open ? "sidebar modern" : "sidebar modern closed"}>
      <h2 className="sidebar-title">
        {open ? "AGC HOSTEL" : "🏫"}
      </h2>

      <nav className="menu">
        {menus[role]?.map(m => (
          <NavLink
            key={m.to}
            to={m.to}
            className="menu-link"
          >
            <span className="icon">{m.icon}</span>
            {open && <span>{m.label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}