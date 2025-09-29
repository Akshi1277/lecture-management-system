"use client";
import { motion } from "framer-motion";
import { Calendar, Users, FileText } from "lucide-react";

export default function Home() {
  const features = [
    { icon: <Calendar size={32} />, title: "Smart Scheduling", desc: "Easily manage and track your lectures." },
    { icon: <Users size={32} />, title: "Attendance Tracking", desc: "Reliable digital attendance records." },
    { icon: <FileText size={32} />, title: "Resource Sharing", desc: "Download notes and recordings anytime." },
  ];

  return (
    <div className="max-w-6xl mx-auto py-16">
      {/* Intro */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-gray-900 text-center"
      >
        Why EduSync?
      </motion.h2>
      <p className="text-center text-gray-600 mt-4 max-w-2xl mx-auto">
        EduSync brings teachers, students, and admins together in one place — boosting productivity and collaboration.
      </p>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        {features.map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-gray-50 border rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="text-brand-primary flex justify-center mb-4">{f.icon}</div>
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p className="text-gray-500 mt-2">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Call To Action */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold text-gray-900">Ready to Get Started?</h3>
        <p className="text-gray-600 mt-2">Sign up today and simplify your lecture management.</p>
        <button className="mt-6 px-6 py-3 bg-brand-secondary text-white rounded-lg font-semibold hover:bg-blue-700 transition">
          Register Now
        </button>
      </div>
    </div>
  );
}
