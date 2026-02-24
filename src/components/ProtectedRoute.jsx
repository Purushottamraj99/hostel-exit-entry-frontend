import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allow, children }) {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" replace />;

  const role = user.role;

  if (!allow.includes(role)) {

    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "student") return <Navigate to="/student" replace />;
    if (role === "warden") return <Navigate to="/warden" replace />;
    if (role === "guard") return <Navigate to="/guard" replace />;
  }

  return children;
}
