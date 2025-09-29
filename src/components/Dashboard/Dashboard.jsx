"use client";
import { motion } from "framer-motion";
import { Calendar, FileText, Users, Bell } from "lucide-react";

export default function Dashboard() {
  const cards = [
    { title: "Upcoming Lectures", desc: "3 lectures this week", icon: <Calendar />, color: "from-emerald-500 to-green-600" },
    { title: "Attendance", desc: "85% this semester", icon: <Users />, color: "from-blue-500 to-indigo-600" },
    { title: "Resources", desc: "12 new uploads", icon: <FileText />, color: "from-amber-500 to-orange-600" },
    { title: "Notifications", desc: "2 pending alerts", icon: <Bell />, color: "from-pink-500 to-rose-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`p-6 bg-gradient-to-r ${c.color} text-white rounded-xl shadow-lg`}
          >
            <div className="mb-3">{c.icon}</div>
            <h3 className="text-xl font-semibold">{c.title}</h3>
            <p className="mt-2">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
