import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import {
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [sidebar, setSidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  /* ================= FETCH ================= */
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get("/leaves/all");
      setLeaves(res.data || []);
    } catch (err) {
      console.log(err)
      toast.error("Failed to fetch leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ================= ACTIONS ================= */
  const approve = async (id) => {
    try {
      setActionLoading(id);
      await api.put(`/leaves/${id}/approve`);
      toast.success("Approved ✅");
      fetchLeaves();
    } catch {
      toast.error("Failed ❌");
    } finally {
      setActionLoading(null);
    }
  };

  const reject = async (id) => {
    try {
      setActionLoading(id);
      await api.put(`/leaves/${id}/reject`);
      toast.error("Rejected ❌");
      fetchLeaves();
    } catch {
      toast.error("Failed ❌");
    } finally {
      setActionLoading(null);
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/";
  };

  /* ================= STATS ================= */
  const pending = leaves.filter((l) => l.status === "Pending").length;
  const approved = leaves.filter((l) => l.status === "Approved").length;
  const rejected = leaves.filter((l) => l.status === "Rejected").length;

  /* ================= UI ================= */
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
        fixed md:relative z-40 w-64 h-screen
        bg-gradient-to-b from-indigo-700 to-indigo-900 text-white p-6
        transform ${sidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition duration-300
      `}
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-bold">Admin Panel</h2>

          <FaTimes
            className="md:hidden cursor-pointer"
            onClick={() => setSidebar(false)}
          />
        </div>

        <ul className="space-y-5 text-sm">
          <li className="flex items-center gap-3 opacity-90">
            <FaCalendarAlt /> Leave Requests
          </li>
        </ul>

        <button
          onClick={logout}
          className="absolute bottom-6 left-6 right-6 bg-red-500 hover:bg-red-600 py-2 rounded-xl flex items-center justify-center gap-2"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-4 md:p-8 space-y-8 w-full overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <FaBars
            className="md:hidden text-xl cursor-pointer"
            onClick={() => setSidebar(true)}
          />

          <h1 className="text-xl md:text-3xl font-bold">
            Admin Dashboard 👨‍💼
          </h1>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          <StatCard title="Total" value={leaves.length} />
          <StatCard title="Pending" value={pending} color="yellow" />
          <StatCard title="Approved" value={approved} color="green" />
          <StatCard title="Rejected" value={rejected} color="red" />
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow overflow-x-auto">

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading leaves...
            </div>
          ) : leaves.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No leave requests found
            </div>
          ) : (
            <table className="w-full text-sm min-w-[750px]">

              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4 text-left">Employee</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Days</th>
                  <th className="p-4 text-left">Reason</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((l) => (
                  <tr
                    key={l._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">{l.user?.name || "-"}</td>
                    <td className="p-4">{l.type}</td>
                    <td className="p-4">{l.totalDays}</td>
                    <td className="p-4 max-w-[200px] truncate">
                      {l.reason}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
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
                    </td>

                    {/* ACTION */}
                    <td className="p-4 text-center space-x-2">
                      {l.status === "Pending" && (
                        <>
                          <button
                            disabled={actionLoading === l._id}
                            onClick={() => approve(l._id)}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded-lg text-xs"
                          >
                            Approve
                          </button>

                          <button
                            disabled={actionLoading === l._id}
                            onClick={() => reject(l._id)}
                            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1 rounded-lg text-xs"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      </main>
    </div>
  );
}

/* ================= CARD ================= */
function StatCard({ title, value, color = "indigo" }) {
  const colors = {
    indigo: "text-indigo-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl p-5 md:p-6 rounded-2xl shadow text-center">
      <p className="text-gray-500 text-xs md:text-sm">{title}</p>
      <h2 className={`text-2xl md:text-3xl font-bold ${colors[color]}`}>
        {value}
      </h2>
    </div>
  );
}
