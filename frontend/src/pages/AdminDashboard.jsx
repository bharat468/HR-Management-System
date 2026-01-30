import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaSignOutAlt } from "react-icons/fa";

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);

  /* ================= FETCH ================= */
  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves/all");
      setLeaves(res.data);
    } catch {
      toast.error("Failed to fetch leaves");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ================= ACTIONS ================= */
  const approve = async (id) => {
    await api.put(`/leaves/${id}/approve`);
    toast.success("Approved ✅");
    fetchLeaves();
  };

  const reject = async (id) => {
    await api.put(`/leaves/${id}/reject`);
    toast.error("Rejected ❌");
    fetchLeaves();
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    await api.post("/auth/logout");
    window.location.href = "/";
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard 👨‍💼</h2>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-auto">

        <table className="w-full text-sm">

          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Type</th>
              <th className="p-4">Days</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((l) => (
              <tr key={l._id} className="border-t">

                <td className="p-4">{l.user?.name}</td>
                <td className="p-4">{l.type}</td>
                <td className="p-4">{l.totalDays}</td>
                <td className="p-4">{l.reason}</td>
                <td className="p-4">{l.status}</td>

                <td className="p-4 text-center space-x-2">
                  {l.status === "Pending" && (
                    <>
                      <button
                        onClick={() => approve(l._id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => reject(l._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
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
      </div>
    </div>
  );
}
