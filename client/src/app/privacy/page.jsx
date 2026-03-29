"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, Scale } from "lucide-react";
import Navbar from "@/components/Shared/Navbar";
import Footer from "@/components/Shared/Footer";
import GridBackground from "@/components/Shared/GridBackground";

export default function PrivacyPolicy() {
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
                Privacy <span className="text-teal-500">Protocol.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Version 1.0.4 • Last Updated March 2026</p>
          </div>

          {/* Content Sections */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-[40px] p-8 lg:p-12 space-y-16 backdrop-blur-xl shadow-2xl">
            
            <section className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-400 border border-teal-500/20">
                  <Eye className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Data Collection</h2>
              </div>
              <p className="leading-relaxed">
                At EduSync, we collect information necessary to provide institutional lecture management services. This includes user identities (names, emails), academic identifiers (roll numbers, departments), and lecture metadata. We do not track users outside the scope of the academic environment.
              </p>
              <ul className="grid md:grid-cols-2 gap-4">
                {['Identity Authentication', 'Academic Records', 'System Log Files', 'Communication Data'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3 text-sm font-medium text-slate-400 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-teal-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Security Standards</h2>
              </div>
              <p className="leading-relaxed">
                We implement institutional-grade security protocols. Your data is encrypted at rest and in transit via TLS/SSL. Access is strictly controlled through Role-Based Access Control (RBAC) to ensure only authorized personnel can view sensitive information.
              </p>
            </section>

            <section className="space-y-6">
               <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">User Rights</h2>
              </div>
              <p className="leading-relaxed">
                Users within the EduSync ecosystem retain the right to access their personal data, request corrections to academic records (pending institutional approval), and understand how their performance metrics are processed.
              </p>
              <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl italic text-sm text-slate-500 border-l-4 border-l-teal-500">
                "We prioritize institutional transparency and individual data sovereignty."
              </div>
            </section>

            <section className="pt-8 border-t border-slate-800 flex flex-col items-center text-center">
                <p className="text-sm text-slate-500 mb-6 font-medium">Questions regarding our data protocols?</p>
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
