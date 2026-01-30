import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserShield,
} from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // ---------------- VALIDATION ----------------
  const validate = () => {
    let err = {};

    if (!form.email) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      err.email = "Invalid email";

    if (!form.password) err.password = "Password required";
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

      const res = await api.post(
        "/auth/login",
        {
          email: form.email,
          password: form.password,
        },
        { withCredentials: true }
      );

      setUser(res.data.user);

      toast.success("Login Successful 🎉");

      navigate(res.data.user.role === "admin" ? "/admin" : "/employee");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 p-4">

      {/* CARD */}
      <div className="bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl w-full max-w-md p-8 space-y-6 transition hover:scale-[1.01]">

        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg">
              <FaUserShield size={22} />
            </div>
          </div>

          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-gray-500 text-sm">
            Login to your HR Dashboard
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={login} className="space-y-5">

          {/* EMAIL */}
          <div>
            <div className="relative group">
              <FaEnvelope className="absolute top-4 left-3 text-gray-400 group-focus-within:text-blue-600" />

              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className="w-full border pl-10 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <div className="relative group">
              <FaLock className="absolute top-4 left-3 text-gray-400 group-focus-within:text-blue-600" />

              <input
                type={show ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="w-full border pl-10 pr-10 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

              <span
                className="absolute top-4 right-3 cursor-pointer text-gray-500"
                onClick={() => setShow(!show)}
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* REMEMBER + FORGOT */}
          {/* <div className="flex justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) =>
                  setForm({ ...form, remember: e.target.checked })
                }
              />
              Remember me
            </label>

            <span className="text-blue-600 hover:underline cursor-pointer">
              Forgot?
            </span>
          </div> */}

          {/* BUTTON */}
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}

            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-600">
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
