"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
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
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { fetchLectures } from "@/redux/slices/lectureSlice";
import { fetchLowAttendanceStudents } from "@/redux/slices/attendanceSlice";
import { setActiveModal } from "@/redux/slices/uiSlice";

export default function TeacherDashboard() {
    const { userInfo } = useSelector((state) => state.auth);
    const { list: lectures, loading } = useSelector((state) => state.lecture);
    const { lowAttendanceStudents: alerts } = useSelector((state) => state.attendance);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchLectures());
            dispatch(fetchLowAttendanceStudents());
        }
    }, [userInfo?._id, dispatch]); // Using _id is more stable than the entire object

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
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {loading ? (
                                <p className="text-slate-500 italic text-sm">Fetching your timetable...</p>
                            ) : lectures.map((l, i) => (
                                <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-2xl group hover:border-indigo-500/50 transition-all">
                                    <div>
                                        <h4 className="text-lg font-bold group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{l.title}</h4>
                                        <p className="text-slate-500 text-xs mt-1">Subject: <b className="text-slate-300">{l.subject}</b> • Room {l.classroom}</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-white">{new Date(l.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p className="text-[10px] text-slate-500 uppercase">
                                                {(() => {
                                                    const d = new Date(l.startTime);
                                                    const today = new Date();
                                                    const tomorrow = new Date();
                                                    tomorrow.setDate(today.getDate() + 1);
                                                    
                                                    if (d.toDateString() === today.toDateString()) return 'Today';
                                                    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
                                                    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                                                })()}
                                            </p>
                                        </div>
                                        <div className="flex flex-col space-y-2">
                                            {l.attendanceMarked ? (
                                                <button
                                                    onClick={() => router.push(`/dashboard/attendance/mark/${l._id}`)}
                                                    className="px-6 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-xl border border-emerald-500/30 transition-all text-sm flex items-center justify-center cursor-pointer"
                                                >
                                                    <CheckSquare className="w-4 h-4 mr-2" /> Edit Attendance
                                                </button>
                                            ) : (
                                                <button
                                                    disabled={new Date() < new Date(l.startTime)}
                                                    onClick={() => router.push(`/dashboard/attendance/mark/${l._id}`)}
                                                    className={`px-6 py-2 font-bold rounded-xl transition-all text-sm flex items-center justify-center ${
                                                        new Date() < new Date(l.startTime)
                                                            ? "bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700"
                                                            : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20"
                                                    }`}
                                                >
                                                    {new Date() < new Date(l.startTime) ? <Clock className="w-4 h-4 mr-2" /> : null}
                                                    {new Date() < new Date(l.startTime) ? "Too Early" : "Mark Attendance"}
                                                </button>
                                            )}
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
                        {userInfo?.isMentor && (
                            <button
                                onClick={() => dispatch(setActiveModal('manageUsers'))}
                                className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center space-x-4 hover:border-blue-500/50 transition-all sm:col-span-2 shadow-2xl shadow-blue-500/5"
                            >
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                    <Users />
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center space-x-2">
                                        <p className="font-bold uppercase tracking-tight">Enroll Students</p>
                                        <span className="px-2 py-[2px] bg-blue-500/20 text-blue-400 text-[8px] font-black rounded uppercase">Mentor Privilege</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Register new students directly into the system</p>
                                </div>
                            </button>
                        )}
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
                                    <p className="text-[10px] text-slate-500 truncate uppercase">{alert.subject}</p>
                                </div>
                            ))}
                            {alerts.length === 0 && (
                                <div className="text-center py-6 text-slate-600 italic text-xs">
                                    No attendance alerts currently.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
