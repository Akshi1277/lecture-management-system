"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-xl rounded-2xl p-12 text-center max-w-3xl"
      >
        <h1 className="text-5xl font-extrabold text-brand-primary">
          EduSync
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Manage lectures, attendance, and resources — all in one smart platform.
        </p>

        <div className="mt-8 flex justify-center space-x-6">
          <Link
            href="/home"
            className="px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold shadow hover:bg-emerald-700 transition"
          >
            Explore
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-brand-primary text-brand-primary font-semibold hover:bg-brand-primary hover:text-white transition"
          >
            Login
          </Link>
        </div>
      </motion.div>

      {/* Add Highlights Section */}
      <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-6xl">
        {[
          { title: "Smart Scheduling", desc: "Avoid conflicts with AI-powered suggestions." },
          { title: "Digital Attendance", desc: "Transparent, accurate, and automated." },
          { title: "Resource Sharing", desc: "All study materials in one central place." },
        ].map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow-md rounded-xl"
          >
            <h3 className="text-xl font-semibold text-brand-secondary">{f.title}</h3>
            <p className="text-gray-600 mt-2">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
