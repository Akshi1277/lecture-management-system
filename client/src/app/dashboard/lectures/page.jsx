"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, CalendarDays, Clock,
    MoreVertical, Edit, UserMinus, Plus, ShieldAlert,
    XCircle, CheckCircle, RefreshCcw, BookOpen
} from "lucide-react";
import { fetchLectures } from "@/redux/slices/lectureSlice";
import { setActiveModal } from "@/redux/slices/uiSlice";
import { useRouter } from "next/navigation";

export default function LecturesPage() {
    const { list: lectures, loading } = useSelector((state) => state.lecture);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedDay, setSelectedDay] = useState(new Date().getDay()); // 0-6

    useEffect(() => {
        setHasMounted(true);
        dispatch(fetchLectures());
    }, [dispatch]);

    if (!hasMounted || !userInfo) return null;

    const safeLectures = Array.isArray(lectures) ? lectures : [];

    // Derived statistics
    const totalLectures = safeLectures.length;
    const activeLectures = safeLectures.filter(l => l.status === 'Scheduled').length;
    const cancelledLectures = safeLectures.filter(l => l.status === 'Cancelled').length;
    const relocatedLectures = safeLectures.filter(l => l.status === 'Relocated').length;

    // Filtering Logic
    const filteredLectures = safeLectures.filter(lecture => {
        // Role-based filtering: Teachers only see their own lectures
        const isOwner = userInfo?.role === 'admin' || lecture.teacher?._id === userInfo?._id;
        
        const matchesSearch =
            lecture.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecture.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lecture.classroom?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "All" || lecture.status === statusFilter;

        return isOwner && matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Scheduled': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
            case 'Cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Relocated': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'Completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const groupLecturesByDay = () => {
        const grouped = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
        safeLectures.forEach(l => {
            const day = new Date(l.startTime).getDay();
            grouped[day].push(l);
        });
        // Sort each day by time
        Object.keys(grouped).forEach(day => {
            grouped[day].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
        });
        return grouped;
    };

    if (userInfo?.role === 'student') {
        const grouped = groupLecturesByDay();
        const currentDayLectures = grouped[selectedDay] || [];

        return (
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">My Timetable</h1>
                        <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-widest leading-none">Weekly Curricular Mapping & Agenda</p>
                    </div>
                </div>

                {/* Day Picker */}
                <div className="flex p-2 bg-slate-900 border border-slate-800 rounded-[32px] overflow-x-auto custom-scrollbar no-scrollbar">
                    {days.map((day, idx) => (
                        <button
                            key={day}
                            onClick={() => setSelectedDay(idx)}
                            className={`flex-1 min-w-[100px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedDay === idx ? "bg-teal-500 text-slate-950 shadow-xl shadow-teal-500/10" : "text-slate-500 hover:text-white"}`}
                        >
                            {day}
                        </button>
                    ))}
                </div>

                {/* Timeline View */}
                <div className="grid grid-cols-1 gap-6 relative">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={selectedDay}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {currentDayLectures.length === 0 ? (
                                <div className="py-32 text-center bg-slate-900/40 border border-slate-800 rounded-[40px] border-dashed">
                                    <CalendarDays className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No sessions programmed for {days[selectedDay]}.</p>
                                </div>
                            ) : (
                                currentDayLectures.map((l, i) => (
                                    <div key={i} className="flex group">
                                        {/* Time Column */}
                                        <div className="w-24 shrink-0 pr-8 text-right py-2">
                                            <p className="text-sm font-black text-white">{new Date(l.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            <p className="text-[9px] text-slate-600 font-black uppercase mt-1 italic">{new Date(l.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>

                                        {/* Timeline Bar */}
                                        <div className="relative flex flex-col items-center mr-8">
                                            <div className="w-4 h-4 rounded-full bg-teal-500 border-4 border-slate-950 z-10 group-hover:scale-125 transition-transform" />
                                            {i !== currentDayLectures.length - 1 && <div className="w-0.5 h-full bg-slate-800 absolute top-4" />}
                                        </div>

                                        {/* Card Column */}
                                        <div className="flex-1 pb-10">
                                            <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px] group-hover:border-teal-500/30 transition-all shadow-xl shadow-black/20">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <span className="px-2 py-0.5 bg-slate-800 rounded text-[8px] font-black text-teal-400 uppercase tracking-widest mb-3 block w-fit">{l.type || 'Lecture'}</span>
                                                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{l.title}</h3>
                                                        <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-wider">{l.subject}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 inline-block">
                                                            <p className="text-[10px] text-slate-500 font-black uppercase leading-none mb-1">Room</p>
                                                            <p className="text-sm font-black text-white">{l.classroom}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-teal-400 border border-slate-700">
                                                            {l.teacher?.name?.[0]}
                                                        </div>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Faculty: {l.teacher?.name}</p>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${l.status === 'Relocated' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-teal-500/10 text-teal-500 border-teal-500/20'}`}>
                                                        {l.status}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight">
                        {userInfo?.role === 'admin' ? "Master Logistics" : "My Timetable"}
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {userInfo?.role === 'admin' 
                            ? "Global view of all scheduled sessions, exams, and labs."
                            : "Your personalized weekly agenda and academic sessions."}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => dispatch(setActiveModal('blockRoom'))}
                        className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-500 text-sm font-bold transition-all flex items-center"
                    >
                        <ShieldAlert className="w-4 h-4 mr-2" /> Lockdown Venue
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/admin/schedule')}
                        className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-sm font-black transition-all shadow-lg shadow-teal-500/20 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Schedule Lecture
                    </button>
                </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: "Total Registered", value: totalLectures, icon: <BookOpen className="text-slate-400" /> },
                    { label: "Active Nodes", value: activeLectures, icon: <CheckCircle className="text-teal-400" /> },
                    { label: "Relocated / Conflicts", value: relocatedLectures, icon: <RefreshCcw className="text-amber-500" /> },
                    { label: "Cancelled Executions", value: cancelledLectures, icon: <XCircle className="text-red-500" /> }
                ].map((stat, idx) => (
                    <div key={idx} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                            <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                        </div>
                        <div className="p-2 bg-slate-800 rounded-lg">{stat.icon}</div>
                    </div>
                ))}
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center space-x-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search by title, teacher, or room..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none appearance-none"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Relocated">Relocated</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Master Data Grid */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] gap-4 p-4 border-b border-slate-800 bg-slate-800/20 text-xs font-black text-slate-500 uppercase tracking-widest">
                    <div>Subject & Batch</div>
                    <div>Faculty</div>
                    <div>Schedule & Room</div>
                    <div>Type</div>
                    <div>Status</div>
                    <div className="text-center">Actions</div>
                </div>

                <div className="divide-y divide-slate-800/50 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500 italic">Syncing with server network...</div>
                    ) : filteredLectures.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 italic">No matching records found in the current temporal window.</div>
                    ) : (
                        filteredLectures.map((lecture, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={lecture._id}
                                className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr_auto] gap-4 p-4 items-center hover:bg-slate-800/20 transition-colors"
                            >
                                <div>
                                    <p className="font-bold text-sm text-white">{lecture.title}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{lecture.subject} • {lecture.batch?.name}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-black text-teal-400 shrink-0">
                                        {lecture.teacher?.name?.split(' ').map(n => n[0]).join('') || '?'}
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-bold text-slate-300">{lecture.teacher?.name}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{lecture.teacher?.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-300 flex items-center">
                                        <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                                        {new Date(lecture.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(lecture.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        <span className="mx-1">•</span>
                                        <span className="font-bold text-teal-400/80">{lecture.classroom}</span>
                                    </p>
                                </div>
                                <div>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${lecture.type === 'Lab' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {lecture.type || 'Lecture'}
                                    </span>
                                </div>
                                <div>
                                    <span className={`px-2.5 py-1 border rounded-md text-[10px] font-black uppercase tracking-wider inline-flex items-center ${getStatusStyle(lecture.status)}`}>
                                        {lecture.status}
                                        {lecture.status === 'Relocated' && (
                                            <span className="ml-1 opacity-70">➔ {lecture.relocatedTo}</span>
                                        )}
                                    </span>
                                    {lecture.conflictReason && (
                                        <p className="text-[9px] text-slate-500 mt-1 truncate max-w-[120px]" title={lecture.conflictReason}>
                                            {lecture.conflictReason}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-end space-x-2">
                                    {lecture.status === 'Scheduled' && (
                                        <button
                                            onClick={() => dispatch(setActiveModal({ type: 'findSubstitute', data: lecture }))}
                                            className="p-2 bg-slate-800 hover:bg-orange-500/20 text-slate-400 hover:text-orange-400 rounded-lg transition-colors border border-transparent hover:border-orange-500/20 group relative"
                                            title="Find Substitute"
                                        >
                                            <UserMinus className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors border border-transparent hover:border-slate-600">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
