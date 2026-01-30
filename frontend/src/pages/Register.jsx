import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
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
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // -------- Password Strength --------
  const strength =
    form.password.length >= 10
      ? "strong"
      : form.password.length >= 6
      ? "medium"
      : "weak";

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

      await api.post(
        "/auth/register",
        {
          name: form.name,
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );

      toast.success("Registered Successfully 🎉");

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-blue-600 to-purple-700 p-4">

      {/* CARD */}
      <div className="bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl w-full max-w-md p-8 space-y-6 transition hover:scale-[1.01]">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-green-600 text-white p-3 rounded-2xl shadow-lg">
              <FaUserPlus size={20} />
            </div>
          </div>

          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-gray-500 text-sm">
            Register to access HR Dashboard
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={submit} className="space-y-5">

          {/* NAME */}
          <div>
            <div className="relative group">
              <FaUser className="absolute top-4 left-3 text-gray-400 group-focus-within:text-green-600" />

              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="w-full border pl-10 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <div className="relative group">
              <FaEnvelope className="absolute top-4 left-3 text-gray-400 group-focus-within:text-green-600" />

              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border pl-10 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="relative group">
              <FaLock className="absolute top-4 left-3 text-gray-400 group-focus-within:text-green-600" />

              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full border pl-10 pr-10 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              />

              <span
                className="absolute top-4 right-3 cursor-pointer text-gray-500"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Strength Bar */}
            {form.password && (
              <div className="h-1 mt-2 rounded bg-gray-200">
                <div
                  className={`h-1 rounded transition-all ${
                    strength === "weak"
                      ? "w-1/3 bg-red-500"
                      : strength === "medium"
                      ? "w-2/3 bg-yellow-500"
                      : "w-full bg-green-600"
                  }`}
                />
              </div>
            )}

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <div className="relative group">
              <FaLock className="absolute top-4 left-3 text-gray-400 group-focus-within:text-green-600" />

              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full border pl-10 pr-10 p-3 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              />

              <span
                className="absolute top-4 right-3 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-600">
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
