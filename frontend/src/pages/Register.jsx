import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION ----------------
  const validate = () => {
    let err = {};

    if (!form.name) err.name = "Name required";

    if (!form.email) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      err.email = "Invalid email";

    if (!form.password) err.password = "Password required";
    else if (form.password.length < 6)
      err.password = "Minimum 6 characters";

    if (form.password !== form.confirmPassword)
      err.confirmPassword = "Passwords do not match";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // ---------------- REGISTER ----------------
  const submit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password
      });

      toast.success("Registered Successfully 🎉");

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-blue-600 to-purple-600 p-4">

      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl w-full max-w-md p-8 space-y-6">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create Account ✨</h2>
          <p className="text-gray-500 text-sm">
            Register to access HR dashboard
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-4">

          {/* NAME */}
          <div>
            <div className="relative">
              <FaUser className="absolute top-4 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full border pl-10 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <div className="relative">
              <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                className="w-full border pl-10 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
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
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="w-full border pl-10 pr-10 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <span
                className="absolute top-4 right-3 cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <div className="relative">
              <FaLock className="absolute top-4 left-3 text-gray-400" />

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full border pl-10 pr-10 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword: e.target.value
                  })
                }
              />

              <span
                className="absolute top-4 right-3 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        {/* LOGIN LINK */}
        <p className="text-center text-sm">
          Already have account?{" "}
          <Link
            to="/"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
