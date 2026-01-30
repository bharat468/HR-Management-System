import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

import {
  FaUserCheck,
  FaCalendarAlt,
  FaPaperPlane,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function EmployeeDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [sidebar, setSidebar] = useState(false);

  const [leaveForm, setLeaveForm] = useState({
    type: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const today = new Date().toISOString().split("T")[0];

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchLeaves();
    fetchAttendance();
  }, []);

  const fetchLeaves = async () => {
    const res = await api.get("/leaves/my");
    setLeaves(res.data);
  };

  const fetchAttendance = async () => {
    const res = await api.get("/attendance/my");
    setAttendance(res.data);
  };

  /* ================= CALC ================= */
  const presentDays = attendance.filter(
    (a) => a.status === "Present"
  ).length;

  const totalDays =
    leaveForm.startDate && leaveForm.endDate
      ? Math.floor(
          (new Date(leaveForm.endDate) -
            new Date(leaveForm.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  /* ================= ACTIONS ================= */
  const markAttendance = async () => {
    await api.post("/attendance", { status });
    toast.success("Attendance Marked ✅");
    fetchAttendance();
  };

  const submitLeave = async () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason)
      return toast.error("Fill all details");

    setLoading(true);

    await api.post("/leaves", leaveForm);

    toast.success("Leave Applied 🎉");
    setShowLeaveForm(false);
    setLoading(false);

    fetchLeaves();
  };

  const logout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/";
  };

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-100vh w-64
        bg-gradient-to-b from-indigo-700 to-indigo-900 text-white p-6
        transform ${sidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition duration-300`}
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-bold">HR Panel</h2>
          <FaTimes
            className="md:hidden cursor-pointer"
            onClick={() => setSidebar(false)}
          />
        </div>

        <ul className="space-y-5 text-sm">
          <li className="flex gap-3 items-center opacity-90">
            <FaUserCheck /> Attendance
          </li>
          <li className="flex gap-3 items-center opacity-90">
            <FaCalendarAlt /> Leaves
          </li>
        </ul>

        <button
          onClick={logout}
          className="absolute top-60 left-6 right-6 bg-red-500 hover:bg-red-600 py-2 rounded-xl flex items-center justify-center gap-2"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 p-4 md:p-8 space-y-8 w-full">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <FaBars
            className="md:hidden text-xl cursor-pointer"
            onClick={() => setSidebar(true)}
          />

          <h1 className="text-2xl md:text-3xl font-bold">
            Employee Dashboard 👋
          </h1>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <StatCard title="Present Days" value={presentDays} color="indigo" />
          <StatCard title="Total Leaves" value={leaves.length} color="green" />
        </div>

        {/* ================= ATTENDANCE ================= */}
        <div className="glass-card space-y-4">
          <h3 className="font-semibold text-lg">Mark Attendance</h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded-lg flex-1"
            >
              <option>Present</option>
              <option>Absent</option>
            </select>

            <button
              onClick={markAttendance}
              className="btn-primary"
            >
              Submit
            </button>
          </div>
        </div>

        {/* APPLY BUTTON */}
        <button
          onClick={() => setShowLeaveForm(true)}
          className="btn-success"
        >
          <FaPaperPlane /> Apply Leave
        </button>

        {/* ================= LEAVES ================= */}
        <div className="glass-card">
          <h3 className="font-semibold mb-4 text-lg">My Leaves</h3>

          <div className="space-y-3">
            {leaves.map((l) => (
              <div
                key={l._id}
                className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <span>
                  {l.type} ({l.totalDays} days)
                </span>

                <span
                  className={`px-3 py-1 text-xs rounded-full font-semibold
                  ${
                    l.status === "Approved"
                      ? "bg-green-100 text-green-700"
                      : l.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-4">

            <h3 className="font-bold text-lg">Apply Leave</h3>

            <input
              type="date"
              min={today}
              className="input"
              value={leaveForm.startDate}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, startDate: e.target.value })
              }
            />

            <input
              type="date"
              min={leaveForm.startDate || today}
              className="input"
              value={leaveForm.endDate}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, endDate: e.target.value })
              }
            />

            {totalDays > 0 && (
              <p className="text-sm text-gray-500">
                Total Days: {totalDays}
              </p>
            )}

            <textarea
              placeholder="Reason"
              className="input"
              value={leaveForm.reason}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, reason: e.target.value })
              }
            />

            <button
              disabled={loading}
              onClick={submitLeave}
              className="btn-primary w-full"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>

            <button
              onClick={() => setShowLeaveForm(false)}
              className="text-sm text-gray-500 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= REUSABLE ================= */
function StatCard({ title, value }) {
  return (
    <div className="glass-card text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}
