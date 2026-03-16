"use client";
import Link from "next/link";
import { Calendar, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Main Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-500 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">EduSync</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The modern lecture management platform. We provide institutions with the tools they need to automate attendance, resolve scheduling conflicts, and streamline academic logistics.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-6">Navigation</h4>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-slate-400 hover:text-teal-400 transition-colors">
                  Access Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-slate-200 font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-teal-500" />
                <span>contact@edusync.org</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-teal-500" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-teal-500" />
                <span>123 University Ave, NY</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500">
            © {currentYear} EduSync Inc. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}