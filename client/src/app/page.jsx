"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { 
  ArrowRight, Calendar, Users, 
  BarChart3, CheckCircle2,
  BellRing, ShieldCheck, Clock,
  FileSpreadsheet, Megaphone,
  BookOpenCheck, PieChart,
  UserCheck, History
} from "lucide-react";
import GridBackground from "@/components/Shared/GridBackground";

const mainFeatures = [
  {
    title: "Intelligent Scheduling",
    description: "Detect and resolve faculty conflicts and room double-bookings automatically.",
    icon: <Calendar className="w-6 h-6 text-teal-400" />
  },
  {
    title: "Weighted Attendance",
    description: "Configurable participation logic (e.g., Lab sessions weighted 4x standard lectures).",
    icon: <BarChart3 className="w-6 h-6 text-teal-400" />
  },
  {
    title: "Parental Notifications",
    description: "Automatic email alerts to guardians when student attendance falls below your threshold.",
    icon: <BellRing className="w-6 h-6 text-teal-400" />
  },
  {
    title: "Bulk Management",
    description: "Register hundreds of students instantly via Excel imports with automated credential emails.",
    icon: <FileSpreadsheet className="w-6 h-6 text-teal-400" />
  },
  {
    title: "Resource Repository",
    description: "Centralized hub for sharing lecture notes, PDFs, and study materials with students.",
    icon: <BookOpenCheck className="w-6 h-6 text-teal-400" />
  },
  {
    title: "Institutional Notices",
    description: "Broadcast important announcements and digitize the campus notice board.",
    icon: <Megaphone className="w-6 h-6 text-teal-400" />
  }
];

const portals = [
  {
    role: "Administrators",
    features: ["Faculty Substitution Engine", "Room & Resource Planning", "Bulk User Control", "System-wide Settings"],
    icon: <ShieldCheck className="w-8 h-8" />
  },
  {
    role: "Faculty",
    features: ["Digital Attendance Marking", "Lecture History", "Student Performance Reports", "Resource Uploads"],
    icon: <UserCheck className="w-8 h-8" />
  },
  {
    role: "Students",
    features: ["Subject-wise Attendance", "Personal Schedule", "Notice Access", "Downloadable Resources"],
    icon: <Users className="w-8 h-8" />
  }
];

export default function Home() {
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (userInfo) {
      router.push("/dashboard");
    }
  }, [userInfo, router]);

  if (userInfo) return null;

  return (
    <div className="min-h-screen text-slate-200 selection:bg-teal-500/30 font-sans relative">
      <GridBackground />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-full text-sm font-medium text-teal-400 backdrop-blur-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Institutional Grade Lecture Management</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight text-white max-w-5xl"
          >
            Your Academic Workflow, <br className="hidden lg:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400">
              Synchronized & Simplified.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl text-lg lg:text-xl text-slate-400 leading-relaxed"
          >
            EduSync is the central nervous system for your institution's lectures. 
            Automate the tedious logistics so your faculty can focus on what matters: teaching.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row items-center gap-4"
          >
            <Link 
              href="/login" 
              className="px-8 py-4 bg-teal-700 hover:bg-teal-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all flex items-center space-x-2 group"
            >
              <span>Access Academic Portal</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        
        </div>
      </section>

      {/* Role Portals Section */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {portals.map((portal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 rounded-[2.5rem] bg-slate-900/40 border border-slate-800 hover:border-teal-500/20 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-teal-400 mb-8 group-hover:scale-110 transition-transform">
                {portal.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-6 italic tracking-tight">{portal.role}</h3>
              <ul className="space-y-4">
                {portal.features.map((f, i) => (
                  <li key={i} className="flex items-center space-x-3 text-slate-400 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 py-24 bg-slate-950 border-y border-slate-900" id="features">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Powerful Features for a Modern Campus</h2>
              <p className="text-slate-400 text-lg">Integrated tools that handle everything from the first enrollment to the final attendance report.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, idx) => (
              <div key={idx} className="p-10 rounded-[2rem] bg-slate-900/30 border border-slate-800 hover:border-teal-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Dashboard Teaser */}
      <section className="relative z-10 py-32 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-bold text-white">Data-Driven Administration</h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Gain deep insights into institutional performance. Monitor subject-wise attendance trends, track student engagement, and identify issues before they impact academic results.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-teal-400">
                    <PieChart className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-widest">Real-time</span>
                  </div>
                  <p className="text-slate-500 text-sm italic">Instant analytics generation.</p>
               </div>
               <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <History className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-widest">Historical</span>
                  </div>
                  <p className="text-slate-500 text-sm italic">Audit trails for every lecture.</p>
               </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden group"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-24 h-4 bg-slate-800 rounded" />
                <div className="w-12 h-4 bg-teal-500/20 rounded" />
              </div>
              <div className="h-48 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-end p-4 space-x-3">
                 {[40, 90, 60, 100, 70, 85, 45, 95].map((h, i) => (
                   <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1 }}
                    className={`flex-1 rounded-t-lg ${i === 3 ? 'bg-teal-500' : 'bg-slate-800'}`} 
                   />
                 ))}
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="w-32 h-3 bg-slate-800 rounded" />
                    <div className="w-16 h-3 bg-slate-800 rounded" />
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="w-24 h-3 bg-slate-800 rounded" />
                    <div className="w-20 h-3 bg-slate-800 rounded" />
                 </div>
              </div>
            </div>
            {/* Hover overlay teaser */}
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="px-6 py-2 bg-white text-slate-950 rounded-full font-bold text-sm shadow-xl">Insight View</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto py-20 px-12 rounded-[4rem] text-center space-y-8 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
          
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-black text-white italic tracking-tighter mb-6">
              ELEVATE ACADEMIA <br /> <span className="text-teal-500">TOGETHER.</span>
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              Deployment takes minutes. Institutional excellence lasts forever.
            </p>
            <Link 
              href="/login" 
              className="inline-flex items-center px-12 py-5 bg-teal-700 hover:bg-teal-600 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-95 uppercase tracking-widest text-xs"
            >
              Start Managed Session
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}