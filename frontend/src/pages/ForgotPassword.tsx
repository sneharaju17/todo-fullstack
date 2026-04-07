// src/pages/ForgotPassword.tsx
import { useState } from "react";
import axios from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/forgot-password", { email });

      if (res.data.reset_link) {
        setResetLink(res.data.reset_link);
      }

      alert(res.data.message || "Check below for reset link ✅");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Error sending reset link");
    }
  };

  return (
     <div className="h-screen flex items-center justify-center bg-gray-200">
    <div className="w-[360px] bg-white rounded-3xl p-6 relative shadow-lg overflow-hidden">

        {/* Top shape */}
<div className="absolute -top-36 -left-24 w-[320px] h-[320px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-full z-0"></div>

{/* Content wrapper */}
<div className="relative z-10">
  <h2 className="mt-32 text-3xl font-semibold text-gray-800">
    Forgot Password
  </h2>
</div>
        
        

        <p className="text-gray-500 text-sm mt-1">
          Enter your email to reset password
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full mt-6 p-3 rounded-full border"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="w-full mt-6 p-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white">
            Send Reset Link →
          </button>
        </form>

        {/* 🔹 Local dev reset link */}
        {resetLink && (
          <div className="mt-4 text-sm break-all">
            <p className="text-green-600">Reset link:</p>
            <a
              href={resetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {resetLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}