"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          EduSync
        </h1>

        {/* Links */}
        <div className="space-x-6 text-gray-800 font-medium">
          <Link href="/home" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-indigo-600 transition">
            Dashboard
          </Link>
          <Link href="/login" className="hover:text-indigo-600 transition">
            Login
          </Link>
          <Link href="/register" className="hover:text-indigo-600 transition">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
