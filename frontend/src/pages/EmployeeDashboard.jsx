import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

import {
  FaUserCheck,
  FaCalendarAlt,
  FaPaperPlane,
  FaSignOutAlt
} from "react-icons/fa";

export default function EmployeeDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [status, setStatus] = useState("Present");
  const [loading, setLoading] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const [leaveForm, setLeaveForm] = useState({
    type: "Casual",
    startDate: "",
    endDate: "",
    reason: ""
  });

  const today = new Date().toISOString().split("T")[0];

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchLeaves();
    fetchAttendance();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves/my");
      setLeaves(res.data);
    } catch (err) {
      console.log(err)
      toast.error("Failed to load leaves");
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance/my");
      setAttendance(res.data);
    } catch (err) {
      console.log(err)
      toast.error("Failed to load attendance");
    }
  };

  /* ================= TOTAL DAYS ================= */
  const totalDays =
    leaveForm.startDate && leaveForm.endDate
      ? Math.floor(
          (new Date(leaveForm.endDate) -
            new Date(leaveForm.startDate)) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 0;

  /* ================= ATTENDANCE ================= */
  const markAttendance = async () => {
    try {
      await api.post("/attendance", { status });
      toast.success("Attendance Marked ✅");
      fetchAttendance();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  /* ================= LEAVE APPLY ================= */
  const submitLeave = async () => {
    if (!leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason)
      return toast.error("Fill all details");

    try {
      setLoading(true);

      await api.post("/leaves", leaveForm);

      toast.success("Leave Applied Successfully 🎉");

      setLeaveForm({
        type: "Casual",
        startDate: "",
        endDate: "",
        reason: ""
      });

      setShowLeaveForm(false);

      fetchLeaves();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/";
  };

  const presentDays = attendance.filter(
    (a) => a.status === "Present"
  ).length;

  /* ================= UI ================= */
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
          className="bg-red-500 hover:bg-red-600 py-2 rounded-lg flex items-center justify-center gap-2"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 p-6 space-y-6">

        <h1 className="text-2xl font-bold">Employee Dashboard 👋</h1>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard title="Present Days" value={presentDays} />
          <StatCard title="Total Leaves" value={leaves.length} />
        </div>

        {/* ATTENDANCE */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="font-semibold">Mark Attendance</h3>

          <div className="flex gap-3">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option>Present</option>
              <option>Absent</option>
            </select>

            <button
              onClick={markAttendance}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>

        {/* APPLY BUTTON */}
        <button
          onClick={() => setShowLeaveForm(true)}
          className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <FaPaperPlane /> Apply Leave
        </button>

        {/* LEAVE LIST */}
        <div className="bg-white p-6 rounded-xl shadow space-y-2">
          <h3 className="font-semibold">My Leaves</h3>

          {leaves.map((l) => (
            <div
              key={l._id}
              className="flex justify-between border p-3 rounded-lg text-sm"
            >
              <span>
                {l.type} ({l.totalDays} days)
              </span>
              <span>{l.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 rounded-xl space-y-3">

            <h3 className="font-bold">Apply Leave</h3>

            <input
              type="date"
              min={today}
              className="border p-2 w-full rounded"
              value={leaveForm.startDate}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, startDate: e.target.value })
              }
            />

            <input
              type="date"
              min={leaveForm.startDate || today}
              className="border p-2 w-full rounded"
              value={leaveForm.endDate}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, endDate: e.target.value })
              }
            />

            {totalDays > 0 && (
              <p className="text-sm">Days: {totalDays}</p>
            )}

            <textarea
              placeholder="Reason"
              className="border p-2 w-full rounded"
              value={leaveForm.reason}
              onChange={(e) =>
                setLeaveForm({ ...leaveForm, reason: e.target.value })
              }
            />

            <button
              disabled={loading}
              onClick={submitLeave}
              className="bg-indigo-600 text-white w-full py-2 rounded"
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

/* ================= CARD ================= */
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}
