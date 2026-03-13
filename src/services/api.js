export const BASE = "https://hostel-exit-entry.onrender.com/api";

/* ---------- helper ---------- */

async function jfetch(url, opts = {}) {
  try {
    const r = await fetch(url, opts);

    const text = await r.text();

    console.log("API CALL:", url);
    console.log("RAW RESPONSE:", text);

    if (!text) return {};

    return JSON.parse(text);

  } catch (e) {
    console.error("API ERROR:", e);
    return {};
  }
}
export const api = {
  /* ===== LOGIN ===== */
  login: (id, password, roleHint = "auto") =>
    jfetch(BASE + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password, roleHint })
    }),


  /* ===== STUDENT ===== */
  getRisk: (studentId) =>
    jfetch(BASE + "/student/risk/" + studentId),

  todayStats: () =>
    jfetch(BASE + "/stats/today"),

  addStudent: (data) =>
    jfetch(BASE + "/student/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }),

  deleteStudent: (id) =>
    jfetch(BASE + "/student/" + id, {
      method: "DELETE"
    }),

  studentList: () =>
    jfetch(BASE + "/student/list"),

  /* ===== STUDENT ===== */

myRequests: (studentId) =>
  jfetch(BASE + "/my-requests/" + studentId),
  /* ===== STAFF ===== */

  addStaff: (data) =>
    jfetch(BASE + "/staff/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }),

  staffList: () =>
    jfetch(BASE + "/staff/list"),

  deleteStaff: (id) =>
    jfetch(BASE + "/staff/" + id, {
      method: "DELETE"
    }),

  /* ===== EXIT / ENTRY ===== */

  exit: (studentId, reason) =>
    jfetch(BASE + "/exit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, reason })
    }),

  entry: (studentId) =>
    jfetch(BASE + "/entry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId })
    }),

  exitRequests: () =>
    jfetch(BASE + "/exit-requests"),

  approveExit: (id) =>
    jfetch(BASE + "/approve-exit/" + id, {
      method: "POST"
    }),

  rejectExit: (id) =>
    jfetch(BASE + "/reject-exit/" + id, {
      method: "POST"
    }),
  /* ===== GUARD ===== */

  verifyPass: (logId) =>
    jfetch(BASE + "/verify-pass/" + logId),

  /* ===== LISTS ===== */

  outsideList: () =>
    jfetch(BASE + "/outside"),
};