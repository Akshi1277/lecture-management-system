"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, Scale, Cpu, Zap, Radio } from "lucide-react";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import GridBackground from "@/components/Shared/GridBackground";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans relative selection:bg-teal-500/30">
      <GridBackground />
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-12"
        >
          {/* Header */}
          <div className="space-y-6 text-center lg:text-left">
            <Link 
              href="/" 
              className="inline-flex items-center space-x-2 text-slate-500 hover:text-teal-400 transition-colors group mb-8"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-black uppercase tracking-widest">Back to Home</span>
            </Link>
            
            <h1 className="text-4xl lg:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                Service <span className="text-teal-500">Terms.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Version 1.0.4 • Last Updated March 2026</p>
          </div>

          {/* Content Sections */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-[40px] p-8 lg:p-12 space-y-16 backdrop-blur-xl shadow-2xl">
            
            <section className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-400 border border-teal-500/20">
                  <Zap className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Institutional Acceptance</h2>
              </div>
              <p className="leading-relaxed">
                By entering the EduSync portal, you agree to comply with system-wide academic integrity policies. This platform is designed for institutional management of lectures, attendance, and educational resources. Unauthorized access or system manipulation is strictly prohibited.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
                  <Scale className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">System Compliance</h2>
              </div>
              <p className="leading-relaxed">
                Attendance and academic records generated within EduSync are binding for institutional results and credit allocations. Faculty and administrators are responsible for the accuracy of data input and the integrity of shared resources.
              </p>
              <ul className="grid md:grid-cols-2 gap-4">
                {['Accurate Resource Sharing', 'Unauthorized Access Prohibition', 'Data Manipulation Detection', 'Role-Based Compliance'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-sm font-medium text-slate-400 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <Radio className="w-4 h-4 text-teal-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-6">
               <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                  <Cpu className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Platform Uptime</h2>
              </div>
              <p className="leading-relaxed">
                While we strive for maximum system availability, EduSync reserves the right to conduct scheduled maintenance to enhance core infrastructure. Critical academic functions should be planned around these windows.
              </p>
            </section>

            <section className="pt-8 border-t border-slate-800 flex flex-col items-center text-center">
                <p className="text-sm text-slate-500 mb-6 font-medium">Questions regarding our Service Terms?</p>
                <a 
                  href="mailto:contact@edusync.org" 
                  className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all border border-slate-700 shadow-xl"
                >
                  Contact Us
                </a>
            </section>

          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
