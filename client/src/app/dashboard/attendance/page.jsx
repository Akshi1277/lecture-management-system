"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, Filter, CheckSquare, AlertTriangle,
    Download, UserX, Mail, Hash, BookOpen
} from "lucide-react";
import { fetchBatches } from "@/redux/slices/hierarchySlice";
import { fetchLectures } from "@/redux/slices/lectureSlice";
import { fetchDefaulters, fetchAttendanceStats, fetchSubjectWiseAttendance } from "@/redux/slices/attendanceSlice";
import { addToast } from "@/redux/slices/uiSlice";

export default function AttendancePage() {
    const { userInfo } = useSelector((state) => state.auth);
    const { batches } = useSelector((state) => state.hierarchy);
    const { list: lectures } = useSelector((state) => state.lecture);
    const { defaulters, subjectStats, loading, statsLoading } = useSelector((state) => state.attendance);
    const dispatch = useDispatch();

    const [hasMounted, setHasMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [threshold, setThreshold] = useState(75);

    const [selectedBatch, setSelectedBatch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (userInfo?.role === 'admin') {
            dispatch(fetchDefaulters(threshold));
        } else if (userInfo?.role === 'teacher') {
            dispatch(fetchBatches());
            dispatch(fetchLectures());
        }
    }, [userInfo, threshold, dispatch]);

    // Sub-effect for teachers when selection changes
    useEffect(() => {
        if (userInfo?.role === 'teacher' && selectedBatch && selectedSubject) {
            dispatch(fetchAttendanceStats({ subject: selectedSubject, batchId: selectedBatch }));
        }
    }, [selectedBatch, selectedSubject, userInfo?.role, dispatch]);

    useEffect(() => {
        if (userInfo?.role === 'student') {
            dispatch(fetchSubjectWiseAttendance());
        }
    }, [userInfo?.role, dispatch]);

    useEffect(() => {
        if (userInfo?.role === 'teacher' && lectures.length > 0) {
            const uniqueSubjects = [...new Set(lectures.map(item => item.subject))];
            setSubjects(uniqueSubjects.filter(Boolean));
        }
    }, [lectures, userInfo?.role]);

    const handleExport = () => {
        if (defaulters.length === 0) return;
        const csvContent = [
            ["Student Name", "Email", "Batch", "Total Lectures", "Present", "Attendance %"],
            ...defaulters.map(d => [
                d.student?.name || 'N/A',
                d.student?.email || 'N/A',
                d.batch?.name || 'N/A',
                d.totalLectures,
                d.presentLectures,
                d.percentage.toFixed(1) + '%'
            ])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Global_Defaulters_Report_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    if (!hasMounted || !userInfo) return null;

    if (userInfo?.role === 'student') {
        return (
            <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">Presence Report</h1>
                        <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-widest leading-none">Subject-Wise Performance & Compliance</p>
                    </div>
                </div>

                {statsLoading ? (
                    <div className="py-20 text-center">
                        <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full mx-auto mb-4 animate-spin" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Aggregating Subject Data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {subjectStats.map((stat, i) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                key={i}
                                className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 relative overflow-hidden group hover:border-rose-500/30 transition-all shadow-2xl shadow-black/40"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br transition-opacity duration-500 opacity-5 ${stat.percentage < 75 ? 'from-rose-500 to-transparent' : 'from-teal-500 to-transparent'}`} />
                                
                                <div className="flex items-center justify-between mb-8">
                                    <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:bg-slate-800 transition-colors">
                                        <BookOpen className={`w-6 h-6 ${stat.percentage < 75 ? 'text-rose-500' : 'text-teal-400'}`} />
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-2xl font-black leading-none ${stat.percentage < 75 ? 'text-rose-500' : 'text-teal-400'}`}>{Math.round(stat.percentage)}%</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-8 line-clamp-1">{stat.subject}</h3>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Total Hubs</p>
                                        <p className="text-lg font-black text-white">{stat.totalLectures}</p>
                                    </div>
                                    <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                                        <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Present</p>
                                        <p className={`text-lg font-black ${stat.percentage < 75 ? 'text-rose-400' : 'text-teal-400'}`}>{stat.presentLectures}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
                                        <span className="text-slate-500">Compliance Status</span>
                                        <span className={stat.percentage < 75 ? 'text-rose-500 animate-pulse' : 'text-teal-400'}>
                                            {stat.percentage < 75 ? 'Critically Low' : 'Stable'}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.percentage}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`h-full rounded-full ${stat.percentage < 75 ? 'bg-rose-600' : 'bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]'}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    const filteredDefaulters = defaulters.filter(d =>
        d.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.batch?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight">
                        {userInfo?.role === 'admin' ? "Attendance & Defaulters" : "Class Insights"}
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {userInfo?.role === 'admin' 
                            ? "Global oversight of student participation and compliance."
                            : "Analyze student performance and attendance patterns for your classes."}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleExport}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-black transition-all border border-slate-700 flex items-center shadow-xl shadow-slate-950/20"
                    >
                        <Download className="w-4 h-4 mr-2" /> Export CSV Report
                    </button>
                </div>
            </div>

            {/* Quick Stats Panel */}
            <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between group">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {userInfo?.role === 'admin' ? "Total Defaulters" : "Students Monitored"}
                        </p>
                        <p className="text-3xl font-black text-rose-500 mt-1">{loading ? '...' : defaulters.length}</p>
                    </div>
                    <div className="p-3 bg-rose-500/10 rounded-xl group-hover:scale-110 transition-transform">
                        {userInfo?.role === 'admin' ? <UserX className="text-rose-400 w-6 h-6" /> : <BookOpen className="text-rose-400 w-6 h-6" />}
                    </div>
                </div>

                <div className="col-span-2 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between">
                    {userInfo?.role === 'admin' ? (
                        <>
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-amber-500/10 rounded-xl"><AlertTriangle className="text-amber-500 w-6 h-6" /></div>
                                <div>
                                    <h3 className="text-sm font-black text-white">Threshold Configuration</h3>
                                    <p className="text-xs text-slate-500 mt-1">Adjust the minimum required attendance percentage.</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="text-xs font-bold text-slate-400">Boundary:</span>
                                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 shrink-0 px-3">
                                    <input
                                        type="number"
                                        value={threshold}
                                        onChange={(e) => setThreshold(e.target.value)}
                                        className="w-12 bg-transparent text-white font-black outline-none text-center"
                                    />
                                    <span className="text-slate-500 font-bold ml-1">%</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-4 w-full">
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Batch</label>
                                <select 
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none appearance-none"
                                >
                                    <option value="">Select Target Batch</option>
                                    {batches.map(b => <option key={b._id} value={b._id}>{b.name} ({b.department})</option>)}
                                </select>
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Subject</label>
                                <select 
                                    value={selectedSubject}
                                    onChange={(e) => setSelectedSubject(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none appearance-none"
                                >
                                    <option value="">Select Target Subject</option>
                                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search student identity, email, or batch..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-1 focus:ring-rose-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Master Data Grid */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-4 p-4 border-b border-slate-800 bg-slate-800/30 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <div>Student Identity</div>
                    <div>Batch Alignment</div>
                    <div>Attendance Log</div>
                    <div>Percentage</div>
                    <div className="text-center">Action</div>
                </div>

                <div className="divide-y divide-slate-800/50 max-h-[500px] overflow-y-auto custom-scrollbar relative">
                    {loading ? (
                        <div className="p-16 text-center">
                            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 italic text-sm">Aggregating global attendance logs...</p>
                        </div>
                    ) : filteredDefaulters.length === 0 ? (
                        <div className="p-16 text-center flex flex-col items-center">
                            <div className="p-4 bg-teal-500/10 rounded-full mb-4">
                                <CheckSquare className="w-8 h-8 text-teal-500" />
                            </div>
                            <p className="text-white font-bold">Total Compliance</p>
                            <p className="text-slate-500 text-sm mt-1">No students fall under the {threshold}% boundary.</p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredDefaulters.map((defaulter, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                    key={`${defaulter.student?._id}-${defaulter.batch?._id}`}
                                    className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_auto] gap-4 p-4 items-center hover:bg-slate-800/20 transition-colors group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-sm font-black text-rose-500 shrink-0">
                                            {defaulter.student?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || '?'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-white group-hover:text-rose-400 transition-colors">{defaulter.student?.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase mt-0.5 flex items-center">
                                                <Mail className="w-3 h-3 mr-1" /> {defaulter.student?.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] font-black uppercase tracking-wider inline-flex items-center text-slate-300">
                                            <Hash className="w-3 h-3 mr-1 text-slate-500" />
                                            {defaulter.batch?.name || 'Unassigned'}
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-center">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold">Total</p>
                                                <p className="text-sm font-black text-white">{defaulter.totalLectures}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[10px] text-slate-500 uppercase font-bold">Present</p>
                                                <p className="text-sm font-black text-teal-400">{defaulter.presentLectures}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between items-center text-[10px]">
                                                <span className="font-bold text-slate-400">Compliance</span>
                                                <span className={`font-black ${defaulter.percentage < 50 ? 'text-red-500' : 'text-rose-400'}`}>
                                                    {defaulter.percentage.toFixed(1)}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${defaulter.percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className={`h-full rounded-full ${defaulter.percentage < 50 ? 'bg-red-500' : 'bg-rose-500'}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pr-2">
                                        <button
                                            title="Issue Warning Notification"
                                            className="px-3 py-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors border border-transparent hover:border-rose-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center"
                                        >
                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                            Warn
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
