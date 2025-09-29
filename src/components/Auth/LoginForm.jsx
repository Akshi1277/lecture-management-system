"use client";
import { useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      <div className="bg-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Login to EduSync
        </h2>
        <form className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-pink-400"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-pink-400"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-semibold hover:scale-105 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
