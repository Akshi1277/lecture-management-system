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
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchLectures());
            fetchAttendance();
        }
    }, [userInfo, dispatch]);

    const fetchAttendance = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/attendance/my-stats`, config);
                setStats(res.data);
        } catch (error) { console.error(error); }
    };

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Student Hub</h1>
                    <p className="text-slate-400 mt-1">Learning Progress & Upcoming Lectures</p>
                </div>
                <div className="mt-6 md:mt-0 flex items-center space-x-2 text-sm px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl">
                    <Star className="text-orange-400 w-4 h-4 fill-orange-400" />
                    <span className="text-slate-300 font-medium">Academic Rating: <b className="text-white">A+</b></span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white">Learning Timeline</h3>
                            <Calendar className="text-teal-400 w-5 h-5" />
                        </div>
                        <div className="space-y-4">
                            {loading ? (
                                <p className="text-slate-500 italic text-sm">Syncing with schedule...</p>
                            ) : lectures.map((l, i) => (
                                <div key={i} className="flex items-center p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all border-l-4 border-l-teal-500">
                                    <div className="p-3 bg-slate-800 rounded-xl mr-4">
                                        <Clock className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm leading-tight uppercase tracking-tight">{l.title}</h4>
                                        <p className="text-[10px] text-slate-500 uppercase font-black mt-1">{new Date(l.startTime).toLocaleTimeString()} • Room {l.classroom}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-white">{l.teacher?.name}</p>
                                        <p className="text-[10px] text-slate-600">{l.course?.code}</p>
                                    </div>
                                </div>
                            ))}
                            {lectures.length === 0 && !loading && (
                                <p className="text-slate-500 italic py-10 text-center opacity-50">No classes scheduled yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-8 bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-3xl text-center">
                        <div className="p-4 bg-white/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <Award className="text-teal-400 w-10 h-10" />
                        </div>
                        <h3 className="text-4xl font-black text-white">{Math.round(stats.percentage)}%</h3>
                        <p className="text-teal-400 font-bold uppercase tracking-widest text-xs mt-1">Attendance Rate</p>
                        <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-2xl font-bold">{stats.totalLectures}</p>
                                <p className="text-[10px] text-slate-500 uppercase">Lectures</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.absentLectures}</p>
                                <p className="text-[10px] text-slate-500 uppercase">Absences</p>
                            </div>
                        </div>
                    </div>

                    {/* Course / Syllabus Tracker */}
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                        <h4 className="font-bold mb-4 text-slate-400 text-sm flex items-center">
                            <BookOpen className="w-4 h-4 mr-2 text-indigo-400" /> Syllabus Progress
                        </h4>
                        <div className="space-y-3">
                            {[...new Set(lectures.map(l => l.course?._id))].filter(id => id).map((courseId, i) => {
                                const course = lectures.find(l => l.course?._id === courseId).course;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => dispatch(setActiveModal({ type: 'viewSyllabus', data: courseId }))}
                                        className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-2xl hover:border-indigo-500/50 transition-all flex items-center justify-between group"
                                    >
                                        <div className="text-left">
                                            <p className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors uppercase">{course?.code}</p>
                                            <p className="text-[10px] text-slate-500 truncate w-32">{course?.name}</p>
                                        </div>
                                        <Activity className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-all" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
