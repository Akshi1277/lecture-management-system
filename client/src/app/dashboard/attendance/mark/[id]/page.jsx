"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { 
    Search, 
    CheckCircle2, 
    XCircle, 
    Save, 
    ArrowLeft, 
    Users, 
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/redux/api";
import { addToast } from "@/redux/slices/uiSlice";

export default function MarkAttendancePage() {
    const params = useParams();
    const lectureId = params.id;
    const router = useRouter();
    const dispatch = useDispatch();

    const [lecture, setLecture] = useState(null);
    const [attData, setAttData] = useState([]); // Array of { studentId, status, name, rollNo }
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // 1. Fetch Lecture Details
                const { data: lec } = await api.get(`/lectures/${lectureId}`);
                setLecture(lec);

                // 2. Fetch Existing Attendance
                let existingAttendance = null;
                try {
                    const { data } = await api.get(`/attendance/${lectureId}`);
                    existingAttendance = data;
                } catch (err) {
                    // 404 is fine, means first time marking
                }

                // 3. Fetch Students in Batch
                const { data: students } = await api.get(`/users/batch/${lec.batch._id}`);
                
                // 4. Merge Data
                const mergedData = students.map(student => {
                    const record = existingAttendance?.students.find(s => s.student._id === student._id);
                    return {
                        studentId: student._id,
                        name: student.name,
                        email: student.email,
                        status: record ? record.status : 'present' // Default to present
                    };
                });
                setAttData(mergedData);
            } catch (error) {
                dispatch(addToast({ type: 'error', message: "Failed to load attendance data" }));
                router.back();
            } finally {
                setLoading(false);
            }
        };

        if (lectureId) loadInitialData();
    }, [lectureId]); // Remove router from dependencies to prevent unintended loops

    const handleStatusChange = (studentId, newStatus) => {
        setAttData(prev => prev.map(s => 
            s.studentId === studentId ? { ...s, status: newStatus } : s
        ));
    };

    const markAll = (status) => {
        setAttData(prev => prev.map(s => ({ ...s, status })));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const payload = {
                lectureId,
                students: attData.map(s => ({ studentId: s.studentId, status: s.status }))
            };
            await api.post('/attendance', payload);
            dispatch(addToast({ type: 'success', message: "Attendance synced successfully" }));
            router.push('/dashboard');
        } catch (error) {
            dispatch(addToast({ type: 'error', message: error.response?.data?.message || "Failed to save attendance" }));
        } finally {
            setSaving(false);
        }
    };

    const filteredStudents = attData.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        present: attData.filter(s => s.status === 'present').length,
        absent: attData.filter(s => s.status === 'absent').length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">Initializing Attendance Matrix</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30">
            {/* Sticky Header */}
            <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 p-6 shadow-2xl shadow-black/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-6">
                        <button 
                            onClick={() => router.back()}
                            className="p-3 bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all text-slate-400 hover:text-white group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div>
                            <div className="flex items-center space-x-3 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                    lecture?.type === 'Lab' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}>
                                    {lecture?.type || 'Lecture'}
                                </span>
                                <span className="text-slate-600 font-black text-[9px] tracking-[0.15em] flex items-center uppercase">
                                    <Users className="w-3 h-3 mr-1.5" /> {lecture?.batch?.name}
                                </span>
                            </div>
                            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{lecture?.title}</h1>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 block">{lecture?.subject}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Desktop Stats */}
                        <div className="hidden lg:flex items-center bg-slate-900/50 border border-slate-800/50 px-8 py-4 rounded-3xl space-x-10 shadow-inner shadow-black/40">
                            <div className="text-center">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Present</p>
                                <p className="text-xl font-black text-emerald-400 leading-none">{stats.present}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">Absent</p>
                                <p className="text-xl font-black text-rose-500 leading-none">{stats.absent}</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleSubmit}
                            disabled={saving}
                            className="px-8 py-4 bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 text-white font-black rounded-[24px] shadow-2xl shadow-indigo-500/30 transition-all flex items-center space-x-3 min-w-[200px] justify-center group"
                        >
                            {saving ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="uppercase tracking-widest text-xs">Sync Records</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 space-y-10">
                {/* Search & Bulk Actions */}
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="relative w-full md:max-w-xl group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Identify node by signature or identifier..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-[28px] pl-14 pr-6 py-5 text-sm focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all shadow-inner shadow-black/40 text-white font-medium"
                        />
                    </div>

                    <div className="flex items-center space-x-3 bg-slate-950 border border-slate-800/50 p-2 rounded-[24px] shadow-xl">
                        <button 
                            onClick={() => markAll('present')}
                            className="px-6 py-3 bg-slate-900 hover:bg-emerald-500/10 text-[10px] font-black uppercase tracking-[0.1em] rounded-2xl transition-all border border-slate-800 hover:border-emerald-500/30 text-emerald-400 shadow-lg"
                        >
                            Bulk Present
                        </button>
                        <button 
                            onClick={() => markAll('absent')}
                            className="px-6 py-3 bg-slate-900 hover:bg-rose-500/10 text-[10px] font-black uppercase tracking-[0.1em] rounded-2xl transition-all border border-slate-800 hover:border-rose-500/30 text-rose-400 shadow-lg"
                        >
                            Bulk Absent
                        </button>
                    </div>
                </div>

                {/* List View */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredStudents.map((student, idx) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(idx * 0.02, 0.5) }}
                                key={student.studentId}
                                className={`p-4 rounded-[28px] border transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 group shadow-xl ${
                                    student.status === 'present' ? 'bg-emerald-500/5 border-emerald-500/20 shadow-emerald-500/5' :
                                    'bg-rose-500/5 border-rose-500/20 shadow-rose-500/5'
                                }`}
                            >
                                <div className="flex items-center space-x-6 flex-1">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border shadow-inner transition-colors duration-500 ${
                                        student.status === 'present' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                        'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                    }`}>
                                        {student.name[0]}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white text-base tracking-tight leading-tight group-hover:text-indigo-400 transition-colors uppercase">{student.name}</h4>
                                        <p className="text-[10px] text-slate-600 truncate uppercase font-black tracking-widest mt-1 block">{student.email}</p>
                                    </div>

                                    <div className="hidden sm:block">
                                        <span className={`px-4 py-1.5 bg-slate-950/50 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500 ${
                                            student.status === 'present' ? 'text-emerald-400 border-emerald-500/20 shadow-emerald-500/10' :
                                            'text-rose-400 border-rose-500/20 shadow-rose-500/10'
                                        }`}>
                                            {student.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 w-full md:w-auto">
                                    <button 
                                        onClick={() => handleStatusChange(student.studentId, 'present')}
                                        className={`flex-1 md:flex-none px-6 py-3 rounded-2xl border flex items-center justify-center space-x-2 transition-all duration-300 ${
                                            student.status === 'present' 
                                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-2xl shadow-emerald-500/50 scale-[1.02]' 
                                            : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-emerald-500/30 hover:text-emerald-500'
                                        }`}
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Present</span>
                                    </button>
                                    <button 
                                        onClick={() => handleStatusChange(student.studentId, 'absent')}
                                        className={`flex-1 md:flex-none px-6 py-3 rounded-2xl border flex items-center justify-center space-x-2 transition-all duration-300 ${
                                            student.status === 'absent' 
                                            ? 'bg-rose-500 border-rose-400 text-white shadow-2xl shadow-rose-500/50 scale-[1.02]' 
                                            : 'bg-slate-900 border-slate-800 text-slate-600 hover:border-rose-500/30 hover:text-rose-400'
                                        }`}
                                    >
                                        <XCircle className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Absent</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredStudents.length === 0 && (
                    <div className="py-40 text-center bg-slate-900/20 border border-slate-800/50 rounded-[40px] border-dashed shadow-inner">
                        <motion.div 
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                        >
                            <Search className="w-20 h-20 text-slate-800 mx-auto mb-6 opacity-50" />
                        </motion.div>
                        <p className="text-slate-600 font-black uppercase tracking-[0.3em] text-[10px]">Zero matches identified in the sector.</p>
                    </div>
                )}
            </main>
            
            {/* Real-time Persistence Progress Bar */}
            <div className="fixed bottom-0 left-0 w-full h-1.5 bg-slate-900 z-50">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(attData.length > 0 ? (attData.filter(s => s.status !== 'present').length / attData.length) : 0) * 100}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                />
            </div>
        </div>
    );
}
