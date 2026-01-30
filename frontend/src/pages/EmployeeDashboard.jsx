import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

import {
  FaUserCheck,
  FaCalendarAlt,
  FaPaperPlane,
  FaSignOutAlt,
  FaTimes
} from "react-icons/fa";

export default function EmployeeDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const [leaveBalance, setLeaveBalance] = useState(
    Number(localStorage.getItem("leaveBalance")) || 20
  );

  const [leaveForm, setLeaveForm] = useState({
    type: "Casual",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const today = new Date().toISOString().split("T")[0];

  // ---------------- FETCH ----------------
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

  // ---------------- DAYS CALC ----------------
  const totalDays =
    leaveForm.startDate && leaveForm.endDate
      ? Math.floor(
          (new Date(leaveForm.endDate) -
            new Date(leaveForm.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  const remainingBalance = leaveBalance - totalDays;

  // ---------------- ATTENDANCE ----------------
  const markAttendance = async () => {
    try {
      await api.post("/attendance", { status });
      toast.success("Attendance Marked ✅");
      fetchAttendance();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  // ---------------- LEAVE VALIDATION ----------------
  const isInvalid =
    !leaveForm.startDate ||
    !leaveForm.endDate ||
    !leaveForm.reason ||
    totalDays <= 0 ||
    remainingBalance < 0;

  // ---------------- LEAVE SUBMIT ----------------
  const submitLeave = async () => {
    if (isInvalid) return toast.error("Please fill valid details");

    try {
      setLoading(true);

      await api.post("/leaves", leaveForm);

      toast.success("Leave Applied Successfully 🎉");

      setShowLeaveForm(false);
      setLeaveBalance(remainingBalance);

      setLeaveForm({
        type: "Casual",
        startDate: "",
        endDate: "",
        reason: ""
      });

      fetchLeaves();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const presentDays = attendance.filter(
    (a) => a.status === "Present"
  ).length;

  // ---------------- UI ----------------
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-indigo-700 text-white flex-col justify-between p-6">
        <div>
          <h2 className="text-2xl font-bold mb-10">HR Panel</h2>

          <ul className="space-y-4 text-sm">
            <li className="flex gap-2 items-center">
              <FaUserCheck /> Attendance
            </li>
            <li className="flex gap-2 items-center">
              <FaCalendarAlt /> Leaves
            </li>
          </ul>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 py-2 rounded-lg"
        >
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-4 md:p-8 space-y-6">

        <h1 className="text-2xl font-bold">Employee Dashboard 👋</h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title="Present Days" value={presentDays} color="green" />
          <StatCard title="Total Leaves" value={leaves.length} color="blue" />
        </div>

        {/* ATTENDANCE */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <h3 className="font-semibold">Mark Attendance</h3>

          <div className="flex flex-col md:flex-row gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-3 rounded-lg w-full md:w-40"
            >
              <option>Present</option>
              <option>Absent</option>
            </select>

            <button
              onClick={markAttendance}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>

        {/* APPLY BUTTON */}
        <button
          onClick={() => setShowLeaveForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
        >
          Apply Leave
        </button>

        {/* LEAVE LIST */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-2">
          <h3 className="font-semibold">My Leaves</h3>

          {leaves.map((l) => (
            <div
              key={l._id}
              className="flex justify-between border p-3 rounded-lg text-sm"
            >
              <span>{l.type} ({l.totalDays} days)</span>
              <span>{l.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LEAVE MODAL */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-2xl space-y-4">

            <h3 className="font-bold text-lg">Apply Leave</h3>

            <label className="text-sm">Type</label>
            <select
              className="border p-3 rounded-lg w-full"
              value={leaveForm.type}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, type: e.target.value })
              }
            >
              <option>Casual</option>
              <option>Sick</option>
              <option>Paid</option>
            </select>

            <label className="text-sm">From Date </label>
            <input
              type="date"
              min={today}
              className="border p-3 rounded-lg w-full"
              value={leaveForm.startDate}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, startDate: e.target.value })
              }
            />

            <label className="text-sm">To Date </label>
            <input
              type="date"
              min={leaveForm.startDate || today}
              className="border p-3 rounded-lg w-full"
              value={leaveForm.endDate}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, endDate: e.target.value })
              }
            />

            {totalDays > 0 && (
              <div className="text-sm bg-gray-100 p-3 rounded-lg">
                Days: <b>{totalDays}</b> 
              </div>
            )}

            <textarea
              placeholder="Reason"
              className="border p-3 rounded-lg w-full"
              value={leaveForm.reason}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, reason: e.target.value })
              }
            />

            <button
              disabled={isInvalid || loading}
              onClick={submitLeave}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Leave"}
            </button>

            <button
              onClick={() => setShowLeaveForm(false)}
              className="w-full text-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- STAT CARD ----------
function StatCard({ title, value, color }) {
  const colors = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600"
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className={`text-3xl font-bold ${colors[color]}`}>{value}</h3>
    </div>
  );
}
