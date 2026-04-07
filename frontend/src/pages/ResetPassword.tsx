// src/pages/ResetPassword.tsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/api";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/reset-password", {
        token,
        new_password: newPassword,
      });

      alert("Password reset successfully ✅");
      navigate("/login");
    } catch (err: any) {
      alert(err.response?.data?.detail || "Invalid or expired token");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div className="w-[360px] bg-white rounded-3xl p-6 relative shadow-lg overflow-hidden">

        {/* Top Shape */}
        <div className="absolute -top-32 -left-20 w-[300px] h-[300px] bg-gradient-to-br from-purple-300 to-pink-200 rounded-full"></div>

        <h2 className="mt-32 text-2xl font-semibold">Reset Password</h2>

        <p className="text-gray-500 text-sm mt-1">
          Enter your new password
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="w-full mt-6 p-3 rounded-full border"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button className="w-full mt-6 p-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white">
            Reset Password →
          </button>
        </form>

        {/* Back to login */}
        <p className="text-sm text-center mt-4">
          Back to{" "}
          <span
            className="text-purple-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}