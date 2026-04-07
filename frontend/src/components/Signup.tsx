// src/components/Signup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/signup", {
        name,
        email,
        password,
      });

      if (res.status === 200) {
        setMessage("Signup successful ✅");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err: any) {
      const errorData = err.response?.data?.detail;

      if (Array.isArray(errorData)) {
        setMessage(errorData[0].msg);
      } else if (typeof errorData === "string") {
        setMessage(errorData);
      } else {
        setMessage("Signup failed");
      }
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
          Signup
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          Create your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignup}>
        
        {/* Name */}
        <input
          type="text"
          className="w-full mt-6 p-3 rounded-full border"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Email */}
        <input
          type="email"
          className="w-full mt-4 p-3 rounded-full border"
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

        {/* Button */}
        <button className="w-full mt-6 p-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white">
          Sign up →
        </button>
      </form>

      {/* Bottom */}
      <p className="text-gray-500 text-sm mt-6 text-center">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-purple-600 cursor-pointer"
        >
          Login
        </span>
      </p>

      {/* Message */}
      {message && (
        <p
          className={`text-center mt-3 ${
            message.includes("✅") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}

    </div>
  </div>
);
}