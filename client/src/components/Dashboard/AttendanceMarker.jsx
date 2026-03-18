"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Users, CheckCircle, XCircle, Search, Save } from "lucide-react";
import { fetchStudentsByBatch } from "@/redux/slices/userSlice";
import { markAttendance } from "@/redux/slices/attendanceSlice";
import { addToast } from "@/redux/slices/uiSlice";

export default function AttendanceMarker({ lecture, onClose }) {
    const { students, loading } = useSelector((state) => state.users);
    const [attendanceData, setAttendanceData] = useState({}); // { studentId: 'present' | 'absent' }
    const [searchTerm, setSearchTerm] = useState("");
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo && lecture?.batch) {
            const batchId = lecture.batch?._id || lecture.batch;
            dispatch(fetchStudentsByBatch(batchId));
        }
    }, [userInfo, lecture, dispatch]);

    useEffect(() => {
        if (students.length > 0) {
            const initialData = {};
            students.forEach(s => {
                initialData[s._id] = 'present';
            });
            setAttendanceData(initialData);
        }
    }, [students]);

    const handleToggle = (studentId) => {
        setAttendanceData(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
        }));
    };

    const handleSubmit = async () => {
        const payload = {
            lectureId: lecture._id,
            students: Object.entries(attendanceData).map(([studentId, status]) => ({
                studentId,
                status
            }))
        };
        const resultAction = await dispatch(markAttendance(payload));
        if (markAttendance.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: 'Attendance marked successfully!' }));
            onClose();
        } else {
            dispatch(addToast({ type: 'error', message: resultAction.payload || 'Failed to mark attendance' }));
        }
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center text-slate-500 italic">Finding the class roster...</div>;

    return (
        <div className="space-y-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{lecture.title}</h2>
                    <p className="text-slate-500 text-sm">Subject: {lecture.subject || 'N/A'}</p>
                </div>
                <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold">
                        Batch: {lecture.batch?.name || lecture.batchName || 'N/A'}
                    </span>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Search students..."
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                {filteredStudents.map(student => (
                    <div
                        key={student._id}
                        onClick={() => handleToggle(student._id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${attendanceData[student._id] === 'present'
                            ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40'
                            : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                            }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${attendanceData[student._id] === 'present' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                }`}>
                                {student.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{student.name}</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{student.email.split('@')[0]}</p>
                            </div>
                        </div>
                        <div>
                            {attendanceData[student._id] === 'present'
                                ? <CheckCircle className="w-6 h-6 text-emerald-500" />
                                : <XCircle className="w-6 h-6 text-red-500" />
                            }
                        </div>
                    </div>
                ))}
                {filteredStudents.length === 0 && (
                    <div className="text-center py-10 text-slate-600 italic text-sm">No students found matching your search.</div>
                )}
            </div>

            <button
                onClick={handleSubmit}
                className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center space-x-2 mt-4"
            >
                <Save className="w-5 h-5" />
                <span>Submit Final Attendance</span>
            </button>
        </div>
    );
}
