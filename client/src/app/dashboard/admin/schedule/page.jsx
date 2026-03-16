"use client";
import AssignLectureForm from "@/components/Dashboard/AssignLectureForm";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SchedulePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <div className="border-b border-slate-800 bg-slate-950 sticky top-0 px-8 py-4 z-[100] shadow-xl">
                <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => router.back()}
                            className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white border border-transparent hover:border-slate-700"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black italic tracking-tight">Academic Scheduler</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Administrative Control Panel • Centralized Timetable Management</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="px-4 py-2 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                            <span className="text-[10px] font-black text-teal-400 uppercase">Live View Mode</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto py-10">
                <div className="bg-slate-900/40 border border-slate-800/50 rounded-[40px] shadow-2xl overflow-hidden backdrop-blur-sm">
                    <AssignLectureForm isFullscreen={true} onClose={() => router.push('/dashboard/admin')} />
                </div>
            </div>

            {/* Footer Style Guide */}
            <div className="max-w-7xl mx-auto px-8 py-10 opacity-30">
                <div className="flex items-center justify-between border-t border-slate-800 pt-8">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">© EduSync Logistics Internal • v2.4.0</p>
                    <div className="flex space-x-6 text-[10px] font-black text-slate-500 uppercase">
                        <span>Autosave Enabled</span>
                        <span>Conflict Resolver Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
