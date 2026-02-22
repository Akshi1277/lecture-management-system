"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Clock,
    CheckSquare,
    FilePlus,
    MessageSquare,
    Users,
    Calendar,
    AlertTriangle,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { fetchLectures } from "@/redux/slices/lectureSlice";
import { setActiveModal } from "@/redux/slices/uiSlice";

export default function TeacherDashboard() {
    const { userInfo } = useSelector((state) => state.auth);
    const { list: lectures, loading } = useSelector((state) => state.lecture);
    const [alerts, setAlerts] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchLectures());
            fetchAlerts();
        }
    }, [userInfo, dispatch]);

    const fetchAlerts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const res = await axios.get('http://localhost:5000/api/attendance/low-stats', config);
            setAlerts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-bold text-white">Teacher Workspace</h1>
                <p className="text-slate-400 mt-1">Academic Delivery & Engagement</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Schedule List */}
                    <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <Calendar className="w-5 h-5 mr-3 text-indigo-400" /> My Schedule
                        </h3>
                        <div className="space-y-4">
                            {loading ? (
                                <p className="text-slate-500 italic text-sm">Fetching your timetable...</p>
                            ) : lectures.map((l, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-2xl group hover:border-indigo-500/50 transition-all">
                                    <div>
                                        <h4 className="text-lg font-bold group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{l.title}</h4>
                                        <p className="text-slate-500 text-xs mt-1">Course: <b className="text-slate-300">{l.course?.name}</b> • Room {l.classroom}</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-white">{new Date(l.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p className="text-[10px] text-slate-500">TODAY</p>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            <button
                                                onClick={() => dispatch(setActiveModal({ type: 'markAttendance', data: l }))}
                                                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm"
                                            >
                                                Mark Attendance
                                            </button>
                                            <button
                                                onClick={() => dispatch(setActiveModal({ type: 'uploadResource', data: l }))}
                                                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700 transition-all text-[11px] flex items-center justify-center"
                                            >
                                                <FilePlus className="w-3 h-3 mr-2 text-teal-400" /> Share Resource
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {lectures.length === 0 && !loading && (
                                <div className="text-center py-10 opacity-50 italic text-slate-500">
                                    No lectures assigned to you yet.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <button className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 hover:border-teal-500/50 transition-all">
                            <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                                <FilePlus />
                            </div>
                            <div className="text-left">
                                <p className="font-bold">Upload Resources</p>
                                <p className="text-xs text-slate-500">PDFs, Notes, Assignments</p>
                            </div>
                        </button>
                        <button className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center space-x-4 hover:border-orange-500/50 transition-all">
                            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
                                <MessageSquare />
                            </div>
                            <div className="text-left">
                                <p className="font-bold">Send Announcement</p>
                                <p className="text-xs text-slate-500">Broadcast to all students</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Attendance Alerts */}
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                        <h4 className="font-bold mb-4 text-slate-400 text-sm flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2 text-rose-500" /> Attendance Alerts (&lt; 75%)
                        </h4>
                        <div className="space-y-3">
                            {alerts.map((alert, i) => (
                                <div key={i} className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-white text-xs">{alert.student?.name}</span>
                                        <span className="text-rose-400 font-bold text-[10px]">{Math.round(alert.percentage)}%</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 truncate lowercase">{alert.course?.code} • {alert.course?.name}</p>
                                </div>
                            ))}
                            {alerts.length === 0 && (
                                <div className="text-center py-6 text-slate-600 italic text-xs">
                                    No attendance alerts currently.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Course / Syllabus Tracker */}
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                        <h4 className="font-bold mb-4 text-slate-400 text-sm flex items-center">
                            <BookOpen className="w-4 h-4 mr-2 text-indigo-400" /> Course Progress
                        </h4>
                        <div className="space-y-3">
                            {/* Derive unique courses from lectures */}
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
                                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
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
