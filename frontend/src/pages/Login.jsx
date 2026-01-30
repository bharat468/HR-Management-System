import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false
  });

  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION ----------------
  const validate = () => {
    let err = {};

    if (!form.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      err.email = "Enter valid email";

    if (!form.password) err.password = "Password is required";
    else if (form.password.length < 6)
      err.password = "Minimum 6 characters";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  // ---------------- LOGIN ----------------
  const login = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      toast.success("Login Successful 🎉");

      navigate(res.data.user.role === "admin" ? "/admin" : "/employee");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 p-4">

      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-md p-8 space-y-6">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome Back 👋</h2>
          <p className="text-gray-500 text-sm">Login to your HR dashboard</p>
        </div>

        {/* FORM */}
        <form onSubmit={login} className="space-y-4">

          {/* EMAIL */}
          <div>
            <div className="relative">
              <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border pl-10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="relative">
              <FaLock className="absolute top-4 left-3 text-gray-400" />

              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full border pl-10 pr-10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <span
                className="absolute top-4 right-3 cursor-pointer text-gray-500"
                onClick={() => setShow(!show)}
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* REMEMBER
          <div className="flex justify-between items-center text-sm">
            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                onChange={(e) =>
                  setForm({ ...form, remember: e.target.checked })
                }
              />
              Remember me
            </label>

            <span className="text-blue-600 cursor-pointer hover:underline">
              Forgot?
            </span>
          </div> */}

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}
