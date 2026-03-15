import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import WardenDashboard from "./pages/WardenDashboard";
import GuardVerify from "./pages/GuardVerify";
import AddStudent from "./pages/AddStudent";
import OutsideList from "./pages/OutsideList";
import RiskView from "./pages/RiskView";
import ExitForm from "./pages/ExitForm";
import EntryForm from "./pages/EntryForm";
import StudentsList from "./pages/StudentsList";
import AddStaff from "./pages/AddStaff";
import StaffList from "./pages/StaffList";
import MyRequests from "./pages/MyRequests";


export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/admin" element={
        <ProtectedRoute allow={["admin"]}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/student" element={
        <ProtectedRoute allow={["student"]}>
          <Layout><StudentDashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/warden" element={
        <ProtectedRoute allow={["admin", "warden"]}>
          <Layout><WardenDashboard /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/guard" element={
        <ProtectedRoute allow={["guard"]}>
          <Layout><GuardVerify /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/add-student" element={
        <ProtectedRoute allow={["admin"]}>
          <Layout><AddStudent /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/add-staff" element={
        <ProtectedRoute allow={["admin"]}>
          <Layout><AddStaff /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/staff-list" element={
        <ProtectedRoute allow={["admin"]}>
          <Layout><StaffList /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/students" element={
        <ProtectedRoute allow={["admin"]}>
          <Layout><StudentsList /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/outside" element={
        <ProtectedRoute allow={["admin", "warden"]}>
          <Layout><OutsideList /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/risk" element={
        <ProtectedRoute allow={["admin", "warden"]}>
          <Layout><RiskView /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/exit" element={
        <ProtectedRoute allow={["student"]}>
          <Layout><ExitForm /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/entry" element={
        <ProtectedRoute allow={["student"]}>
          <Layout><EntryForm /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/my-requests" element={
        <ProtectedRoute allow={["student"]}>
          <Layout><MyRequests /></Layout>
        </ProtectedRoute>
      } />


    </Routes>
  );
}
