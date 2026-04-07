// src/components/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import API from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/login", { email, password });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.access_token);

        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          dispatch(setUser(res.data.user));
        }

        navigate("/todos");
      }
    } catch (err: any) {
      const errorData = err.response?.data?.detail;
      setMessage(
        Array.isArray(errorData)
          ? errorData[0].msg
          : errorData || "Login failed"
      );
    }
  };

  return (
  <div className="h-screen flex items-center justify-center bg-gray-200">
    <div className="w-[360px] bg-white rounded-3xl p-6 relative shadow-lg overflow-hidden">

      {/* Top shape */}
<div className="absolute -top-36 -left-24 w-[320px] h-[320px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-full z-0"></div>

{/* Content */}
<div className="relative z-10">
  <h2 className="mt-36 text-3xl font-semibold text-gray-800">
    Login
  </h2>

  <p className="text-gray-500 text-sm mt-1">
    Welcome back! Please login
  </p>
</div>

      <form onSubmit={handleLogin}>
  
  {/* Email */}
  <input
    type="email"
    className="w-full mt-6 p-3 rounded-full border"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />

  {/* Password */}
  <input
    type="password"
    className="w-full mt-4 p-3 rounded-full border"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  {/* 🔥 Forgot (center bottom) */}
  <p
    onClick={() => navigate("/forgot-password")}
    className="text-center text-sm text-purple-600 mt-3 cursor-pointer"
  >
    Forgot Password?
  </p>

  {/* Button */}
  <button className="w-full mt-6 p-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white">
    Login →
  </button>

</form>

      {/* Bottom */}
      <p className="text-gray-500 text-sm mt-6 text-center">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-purple-600 cursor-pointer"
        >
          Sign up
        </span>
      </p>

      {/* Error */}
      {message && (
        <p className="text-red-500 text-center mt-3">{message}</p>
      )}

    </div>
  </div>
);
}