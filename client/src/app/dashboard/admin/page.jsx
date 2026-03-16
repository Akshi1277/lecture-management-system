"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Clock, Users, ArrowUpRight, UserPlus, BookOpen, Layers, Settings, Plus, FileText,Activity, AlertTriangle, PlayCircle, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { setActiveModal } from "@/redux/slices/uiSlice";
import { fetchLectures } from "@/redux/slices/lectureSlice";
import FacultyLoadChart from "@/components/Dashboard/FacultyLoadChart";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();
    const { userInfo } = useSelector((state) => state.auth);
    const { list: lectures, loading } = useSelector((state) => state.lecture);
    const [dashboardData, setDashboardData] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchLectures());
            fetchDashboardStats();
        }
    }, [userInfo, dispatch]);

    const fetchDashboardStats = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/dashboard/admin`, {
                headers: { Authorization: `Bearer ${userInfo.token}` }
            });
            const data = await res.json();
            if (res.ok) setDashboardData(data);
        } catch (err) {
            console.error(err);
        }
    };

    const stats = [
        { title: "Active Lectures", value: lectures.length, icon: <Activity />, color: "text-orange-400" },
        { title: "Departments", value: dashboardData?.stats?.departments ?? "...", icon: <BookOpen />, color: "text-teal-400" },
        { title: "Total Users", value: dashboardData?.stats?.totalUsers ?? "...", icon: <Users />, color: "text-blue-400" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight italic">Admin Command Center</h1>
                    <p className="text-slate-400 mt-1">Institutional Oversight & Logistics</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => router.push('/dashboard/settings')}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm transition-all flex items-center text-slate-300 font-bold active:scale-95 shadow-xl shadow-slate-950/20"
                    >
                        <Settings className="w-4 h-4 mr-2 text-teal-400" /> Preferences
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl relative overflow-hidden group"
                    >
                        <div className={`p-3 rounded-xl bg-slate-800 w-fit mb-4 ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <p className="text-slate-400 text-sm">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{stat.value}</h3>
                        <div className="absolute top-4 right-4 text-slate-600 group-hover:text-teal-400 transition-colors">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Quick Actions Card */}
                <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-6">
                    <h3 className="text-xl font-bold text-white mb-2">Logistical Controls</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => router.push('/dashboard/admin/schedule')}
                            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center text-center hover:border-teal-500/50 transition-all group"
                        >
                            <div className="p-4 bg-teal-500/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="text-teal-400 w-6 h-6" />
                            </div>
                            <span className="font-bold text-sm">Assign Lecture</span>
                            <span className="text-[10px] text-slate-500 mt-1">Conflict-free scheduling</span>
                        </button>
                        <button
                            onClick={() => dispatch(setActiveModal('manageUsers'))}
                            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center text-center hover:border-blue-500/50 transition-all group"
                        >
                            <div className="p-4 bg-blue-500/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                <UserPlus className="text-blue-400 w-6 h-6" />
                            </div>
                            <span className="font-bold text-sm">Enroll User</span>
                            <span className="text-[10px] text-slate-500 mt-1">Student & Faculty accounts</span>
                        </button>
                        <button
                            onClick={() => dispatch(setActiveModal('manageBatches'))}
                            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center text-center hover:border-purple-500/50 transition-all group"
                        >
                            <div className="p-4 bg-purple-500/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                <Users className="text-purple-400 w-6 h-6" />
                            </div>
                            <span className="font-bold text-sm">Manage Batches</span>
                            <span className="text-[10px] text-slate-500 mt-1">FY, SY, TY Groups</span>
                        </button>
                       <button
                            onClick={() => dispatch(setActiveModal('blockRoom'))}
                            className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center text-center hover:border-red-500/50 transition-all group "
                        >
                            <div className="p-4 bg-red-500/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                                <ShieldAlert className="text-red-500 w-6 h-6" />
                            </div>
                            <span className="font-bold text-sm text-red-500">Lockdown Venue</span>
                            <span className="text-[10px] text-slate-500 mt-1">Override schedules for Exams</span>
                        </button>
                     
                    </div>
                </div>

                {/* Recent Schedule Check */}
                <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
                    <h3 className="text-xl font-bold text-white mb-6">Upcoming Logistics</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                        {loading ? (
                            <p className="text-slate-500 italic text-sm">Syncing with backend...</p>
                        ) : lectures.length > 0 ? (
                            lectures.slice(0, 5).map((l, i) => (
                                <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-sm">{l.title}</h4>
                                        <p className="text-[10px] text-slate-500 mt-1 flex items-center">
                                            <Clock className="w-3 h-3 mr-1" /> {new Date(l.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Room {l.classroom}
                                        </p>
                                    </div>
                                    <div className="text-right flex flex-col items-end space-y-1">
                                        <p className="text-[10px] font-bold text-teal-400">{l.teacher?.name}</p>
                                        <button
                                            onClick={() => dispatch(setActiveModal({ type: 'findSubstitute', data: l }))}
                                            className="text-[9px] px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-md hover:bg-orange-500/20 transition-all font-bold"
                                        >
                                            Find Substitute
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 italic text-sm">No lectures found. Database is clean.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Administrative Intelligence Section */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400"><FileText className="w-5 h-5" /></div>
                        <div>
                            <h3 className="text-xl font-bold text-white italic">Intelligence & Reporting</h3>
                            <p className="text-xs text-slate-500">Legal compliance & Data exports</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => dispatch(setActiveModal('generateReport'))}
                            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center hover:border-indigo-500/50 transition-all group"
                        >
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Activity className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-xs font-bold text-white">Export Stats</span>
                            <span className="text-[9px] text-slate-500 mt-1 uppercase font-black">PDF / Excel</span>
                        </button>
                        <button 
                            onClick={() => dispatch(setActiveModal('viewAuditLogs'))}
                            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center hover:border-teal-500/50 transition-all group"
                        >
                            <div className="w-10 h-10 bg-teal-500/10 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Layers className="w-5 h-5 text-teal-400" />
                            </div>
                            <span className="text-xs font-bold text-white">Security Audit</span>
                            <span className="text-[9px] text-slate-500 mt-1 uppercase font-black">Review Activity</span>
                        </button>
                    </div>
                </div>

                <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl relative overflow-hidden">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400"><ShieldAlert className="w-5 h-5" /></div>
                        <div>
                            <h3 className="text-xl font-bold text-white italic">System Health</h3>
                            <p className="text-xs text-slate-500">Infrastructure status</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-400">Database Sync</span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-black uppercase">Functional</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-400">SMTP Gateway</span>
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-full font-black uppercase">Operational</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logistical Analytics Section */}
            <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-white">Logistical Analytics</h3>
                        <p className="text-xs text-slate-500 mt-1">Resource allocation & Workload distribution</p>
                    </div>
                </div>
                <div className="h-[350px]">
                    <FacultyLoadChart />
                </div>
            </div>
        </div>
    );
}
