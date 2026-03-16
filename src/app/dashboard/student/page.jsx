"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    BookOpen,
    Calendar,
    Clock,
    Star,
    Award,
    FileText,
    Activity
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { fetchLectures } from "@/redux/slices/lectureSlice";
import { useState } from "react";
import { setActiveModal } from "@/redux/slices/uiSlice";

export default function StudentDashboard() {
    const { userInfo } = useSelector((state) => state.auth);
    const { list: lectures, loading } = useSelector((state) => state.lecture);
    const [stats, setStats] = useState({ totalLectures: 0, presentLectures: 0, absentLectures: 0, percentage: 0 });
    const [notices, setNotices] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchLectures());
            fetchAttendance();
            fetchNotices();
        }
    }, [userInfo, dispatch]);

    const fetchAttendance = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/attendance/my-stats`, config);
            setStats(res.data);
        } catch (error) { console.error(error); }
    };

    const fetchNotices = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/announcements`, config);
            setNotices(data.slice(0, 3)); // Only top 3 for dashboard
        } catch (error) { console.error(error); }
    };

    const nextLecture = lectures[0];

    return (
        <div className="space-y-10 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-black text-white italic tracking-tight">Student Hub</h1>
                    <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-widest">Academic Identity: {userInfo?.email}</p>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center space-x-4"
                >
                    <div className="px-5 py-2.5 bg-slate-900 border border-teal-500/20 rounded-2xl flex items-center space-x-3 shadow-xl shadow-teal-500/5">
                        <Award className="text-teal-400 w-5 h-5" />
                        <div>
                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none">Learning Tier</p>
                            <p className="text-sm font-bold text-white uppercase tracking-tight">Distinction Scholar</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Schedule & Next up */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Next Session Highlight */}
                    {nextLecture && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-8 bg-gradient-to-br from-indigo-600 to-teal-500 rounded-[40px] relative overflow-hidden shadow-2xl shadow-teal-500/20 group"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform">
                                <Calendar className="w-32 h-32 text-white" />
                            </div>
                            <div className="relative z-10">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">Next Up</span>
                                <h2 className="text-3xl font-black text-white mt-4 uppercase leading-none">{nextLecture.title}</h2>
                                <p className="text-white/80 mt-2 font-medium">Topic: {nextLecture.subject}</p>
                                
                                <div className="mt-8 flex items-center space-x-6">
                                    <div className="flex items-center space-x-2 text-white/90">
                                        <Clock className="w-5 h-5" />
                                        <span className="font-bold">{new Date(nextLecture.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-white/90 border-l border-white/20 pl-6">
                                        <Calendar className="w-5 h-5" />
                                        <span className="font-bold">Room {nextLecture.classroom}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Timeline List */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[40px] p-8 shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-white italic">Learning Timeline</h3>
                            <div className="flex space-x-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-700" />)}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                <div className="py-20 text-center text-slate-500 animate-pulse font-bold tracking-widest uppercase text-xs italic">Syncing Curricular Data...</div>
                            ) : lectures.map((l, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={i} 
                                    className="flex items-center p-6 bg-slate-950/50 border border-slate-800 rounded-3xl hover:border-teal-500/30 transition-all group"
                                >
                                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex flex-col items-center justify-center mr-6 border border-slate-800 group-hover:bg-teal-500/10 group-hover:border-teal-500/20 transition-all">
                                        <p className="text-[10px] font-black text-slate-500 group-hover:text-teal-400 leading-none">WEEK</p>
                                        <p className="text-xl font-black text-white">0{i+1}</p>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white group-hover:text-teal-400 transition-colors uppercase tracking-tight leading-none mb-1">{l.title}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{l.teacher?.name} • Room {l.classroom}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="px-2 py-0.5 bg-slate-800 rounded-md text-[9px] font-black text-slate-400 mb-1 group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-all">{l.status}</span>
                                        <p className="text-xs font-bold text-white">{new Date(l.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </motion.div>
                            ))}
                            {lectures.length === 0 && !loading && (
                                <div className="py-20 text-center">
                                    <Activity className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">No active sessions mapped to your batch.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Attendance & Analytics */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Attendance Card */}
                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-[40px] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500" />
                        <h3 className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Academic Presence</h3>
                        
                        <div className="relative w-40 h-40 mx-auto mb-8">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                                <motion.circle 
                                    initial={{ strokeDasharray: "0, 440" }}
                                    animate={{ strokeDasharray: `${(stats.percentage / 100) * 440}, 440` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeLinecap="round" className="text-teal-500" 
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-white leading-none">{Math.round(stats.percentage)}%</span>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter mt-1 italic">Total Score</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                                <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Total</p>
                                <p className="text-xl font-black text-white leading-none">{stats.totalLectures}</p>
                            </div>
                            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                                <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Absent</p>
                                <p className="text-xl font-black text-rose-500 leading-none">{stats.absentLectures}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Notices */}
                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-[40px] shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-black text-white italic">Bulletin Feed</h3>
                            <Star className="text-orange-400 w-4 h-4 fill-orange-400" />
                        </div>
                        <div className="space-y-4">
                            {notices.map((n, i) => (
                                <div key={i} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 group hover:border-orange-500/30 transition-all cursor-pointer">
                                    <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest px-2 py-0.5 bg-orange-500/10 rounded-md block w-fit mb-2">{n.priority}</span>
                                    <h4 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors line-clamp-1">{n.title}</h4>
                                    <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-tight">{new Date(n.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                            {notices.length === 0 && (
                                <p className="text-slate-600 text-xs text-center py-4 italic">No priority broadcasts.</p>
                            )}
                        </div>
                        <button 
                            onClick={() => router.push('/dashboard/notices')}
                            className="w-full mt-6 py-3 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all"
                        >
                            Open Notice Board
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
