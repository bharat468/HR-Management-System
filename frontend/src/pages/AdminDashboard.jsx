import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaSignOutAlt } from "react-icons/fa";

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    const res = await api.get("/leaves/all");
    setLeaves(res.data);
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

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

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard 👨‍💼</h2>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">

            <thead className="bg-gray-50">
              <tr className="text-gray-600 text-left">
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
                <tr key={l._id} className="border-t hover:bg-gray-50">

                  <td className="p-4 font-medium">{l.user?.name}</td>

                  <td className="p-4">{l.type}</td>

                  <td className="p-4">{l.totalDays}</td>

                  <td className="p-4 text-gray-600 max-w-xs truncate">
                    {l.reason}
                  </td>

                  <td
                    className={`p-4 font-semibold ${
                      l.status === "Approved"
                        ? "text-green-600"
                        : l.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {l.status}
                  </td>

                  <td className="p-4 text-center space-x-2">

                    {l.status === "Pending" && (
                      <>
                        <button
                          onClick={() => approve(l._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => reject(l._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
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
    </div>
  );
}
