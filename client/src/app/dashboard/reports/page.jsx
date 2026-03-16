"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { 
    BarChart3, TrendingUp, PieChart, Users, 
    Calendar, Download, ArrowUpRight, ArrowDownRight,
    Activity, ShieldCheck, Clock
} from "lucide-react";
import axios from "axios";
import { addToast } from "@/redux/slices/uiSlice";

export default function ReportsPage() {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [stats, setStats] = useState({
        totalLectures: 0,
        completedLectures: 0,
        cancelledLectures: 0,
        facultyLoad: [],
        averageAttendance: 0,
        totalUsers: { students: 0, teachers: 0 }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, [userInfo]);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            
            const [resLectures, resUsers, resFacultyLoad] = await Promise.all([
                axios.get(`${apiUrl}/lectures`, config),
                axios.get(`${apiUrl}/users`, config),
                axios.get(`${apiUrl}/attendance/faculty-load`, config)
            ]);

            let lectures = resLectures.data;
            const users = resUsers.data;

            // Filter for teachers: only their own data
            if (userInfo?.role === 'teacher') {
                lectures = lectures.filter(l => l.teacher?._id === userInfo?._id);
            }

            setStats({
                totalLectures: lectures.length,
                completedLectures: lectures.filter(l => l.status === 'Completed').length,
                cancelledLectures: lectures.filter(l => l.status === 'Cancelled').length,
                facultyLoad: userInfo?.role === 'admin' ? resFacultyLoad.data : [],
                totalUsers: {
                    students: users.filter(u => u.role === 'student').length,
                    teachers: users.filter(u => u.role === 'teacher').length
                },
                averageAttendance: 82 // Mocked for now
            });
        } catch (err) {
            dispatch(addToast({ type: 'error', message: 'Failed to generate reports.' }));
        } finally {
            setLoading(false);
        }
    };

    if (userInfo?.role === 'student') {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="text-center space-y-4">
                    <BarChart3 className="w-16 h-16 text-slate-700 mx-auto" />
                    <p className="text-slate-400 font-bold tracking-widest uppercase">Student view coming soon</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight">
                        {userInfo?.role === 'admin' ? "Institutional Reports" : "Performance Analytics"}
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {userInfo?.role === 'admin' 
                            ? "Deep analytics on academic delivery and behavioral trends."
                            : "Analyze your teaching efficiency and class engagement metrics."}
                    </p>
                </div>
                <button 
                    onClick={() => window.print()}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-black transition-all border border-slate-700 flex items-center shadow-xl shadow-slate-950/20"
                >
                    <Download className="w-4 h-4 mr-2" /> Export Snapshot
                </button>
            </div>

            {/* High Level Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
                {[
                    { label: "Lecture Efficiency", value: `${stats.totalLectures ? Math.round((stats.completedLectures/stats.totalLectures)*100) : 0}%`, icon: <Activity className="text-teal-400" />, trend: "+2.4%", trendUp: true },
                    { label: "Avg. Student Presence", value: `${stats.averageAttendance}%`, icon: <Users className="text-blue-400" />, trend: "-0.8%", trendUp: false },
                    { label: "Faculty Utilization", value: "High", icon: <TrendingUp className="text-purple-400" />, trend: "Steady", trendUp: true },
                    { label: "Security/Lockdowns", value: "03", icon: <ShieldCheck className="text-rose-500" />, trend: "Monthly", trendUp: true }
                ].map((stat, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="p-6 bg-slate-900 border border-slate-800 rounded-[32px] space-y-4 relative overflow-hidden group shadow-xl"
                    >
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                            <div className={`flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg ${stat.trendUp ? 'bg-teal-500/10 text-teal-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                <span>{stat.trend}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-white">{loading ? '...' : stat.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {userInfo?.role === 'admin' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-white italic">Faculty Execution Load</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">Total Lectures Handled</p>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-3xl"><PieChart className="w-6 h-6 text-slate-400" /></div>
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                <div className="py-10 text-center text-slate-500 animate-pulse font-bold tracking-widest uppercase text-xs">Calibrating data...</div>
                            ) : stats.facultyLoad.map((faculty, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-slate-300">{faculty.teacher}</span>
                                        <span className="font-black text-white">{faculty.count} Sessions</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(faculty.count / stats.totalLectures) * 100}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Operations Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white italic">Delivery Summary</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">Session Outcome Distribution</p>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-3xl"><Activity className="w-6 h-6 text-slate-400" /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Completed", value: stats.completedLectures, color: "teal", sub: "Delivered Sessions" },
                            { label: "Cancelled", value: stats.cancelledLectures, color: "rose", sub: "Nulled Executions" },
                            { label: "Scheduled", value: stats.totalLectures - stats.completedLectures - stats.cancelledLectures, color: "blue", sub: "Upcoming Load" },
                            { label: "Total Population", value: stats.totalUsers.students + stats.totalUsers.teachers, color: "indigo", sub: "Identity Count" }
                        ].map((item, idx) => (
                            <div key={idx} className={`p-6 bg-slate-950/50 border border-slate-800 rounded-3xl space-y-2`}>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                                <p className={`text-4xl font-black text-${item.color}-500`}>{loading ? '0' : item.value}</p>
                                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">{item.sub}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-slate-800/20 rounded-3xl border border-slate-800 flex items-center space-x-4">
                        <AlertTriangle className="w-10 h-10 text-orange-500/50 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-slate-300">Operational Anomaly Detected</p>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1">Cancellation rate is 12% higher than the previous semester baseline. Review room blocking protocols.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
