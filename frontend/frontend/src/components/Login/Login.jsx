import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaUserPlus,
  FaTimes,
} from "react-icons/fa";

const url = "http://localhost:4000";

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
  const [showToast, setShowToast] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });

  useEffect(() => {
    if (!isOpen) return;
    const stored = localStorage.getItem("loginData");
    if (stored) setFormData(JSON.parse(stored));
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/user/login`, {
        email: formData.username,
        password: formData.password,
      });

      if (res.data.success && res.data.token) {
        // Store JWT token
        localStorage.setItem("authToken", res.data.token);

        // SAVE USER ID (IMPORTANT)
        if (res.data.user?._id) {
          localStorage.setItem("userId", res.data.user._id);
        }

        // Remember me option
        if (formData.rememberMe) {
          localStorage.setItem("loginData", JSON.stringify(formData));
        } else {
          localStorage.removeItem("loginData");
        }

        setShowToast({
          visible: true,
          message: "Login Successful",
          isError: false,
        });

        setTimeout(() => {
          setShowToast({ visible: false });
          onLoginSuccess(res.data.token);
          onClose();
        }, 1500);
      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setShowToast({ visible: true, message: msg, isError: true });
      setTimeout(() => setShowToast({ visible: false }), 2000);
    }
  };

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Toast */}
      {showToast.visible && (
        <div className="fixed top-4 right-4 z-[999] transition-all duration-300">
          <div
            className={`${
              showToast.isError ? "bg-red-600" : "bg-green-600"
            } text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2`}
          >
            <FaCheckCircle />
            <span>{showToast.message}</span>
          </div>
        </div>
      )}

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-[#2D1B0E] w-full max-w-md p-8 rounded-xl shadow-xl border-2 border-amber-700 animate-scale-in relative">
          <button
            className="absolute right-4 top-4 text-amber-300 hover:text-amber-500"
            onClick={onClose}
          >
            <FaTimes size={22} />
          </button>

          <h1 className="text-3xl font-bold text-center text-amber-400 mb-6">
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-amber-400" />
              <input
                type="text"
                name="username"
                placeholder="Email"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-[#4a372a] text-amber-100 px-10 py-3 rounded-lg placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-amber-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#4a372a] text-amber-100 px-10 py-3 rounded-lg placeholder-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-3 text-amber-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label className="flex items-center gap-2 text-amber-300">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember Me
            </label>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold rounded-lg hover:scale-[1.03] transition"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => {
                onClose();
                window.location.href = "/signup";
              }}
              className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-500"
            >
              <FaUserPlus /> Create New Account
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
