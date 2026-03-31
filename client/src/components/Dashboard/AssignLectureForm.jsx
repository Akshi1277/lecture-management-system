"use client";
import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Plus, Clock, Info, AlertTriangle, Coffee } from "lucide-react";
import { fetchTeachers } from "@/redux/slices/userSlice";
import { fetchBatches } from "@/redux/slices/hierarchySlice";
import { addToast } from "@/redux/slices/uiSlice";
import { createLecture, fetchLectures } from "@/redux/slices/lectureSlice";
import { fetchSettings } from "@/redux/slices/settingsSlice";

export default function AssignLectureForm({ lecture, onClose, isFullscreen = false }) {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { teachers } = useSelector(state => state.users);
    const { batches } = useSelector(state => state.hierarchy);
    const { list: existingLectures } = useSelector(state => state.lecture);
    const { data: settings } = useSelector(state => state.settings);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "", teacher: "", batch: "",
        type: "Lecture", classroom: "",
        subject: "",
        startTime: "", endTime: "",
    });
    const [selectedSlots, setSelectedSlots] = useState([]);
    
    useEffect(() => {
        if (lecture) {
            setFormData({
                title: lecture.title || "",
                teacher: lecture.teacher?._id || lecture.teacher || "",
                batch: lecture.batch?._id || lecture.batch || "",
                type: lecture.type || "Lecture",
                classroom: lecture.classroom || "",
                subject: lecture.subject || "",
                startTime: lecture.startTime || "",
                endTime: lecture.endTime || "",
            });
        }
    }, [lecture]);

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchTeachers());
            dispatch(fetchBatches());
            dispatch(fetchLectures());
            dispatch(fetchSettings());
        }
    }, [userInfo, dispatch]);

    // ─── Time Helper Logic ──────────────────────────────────────────────────
    const addMinutes = (timeStr, mins) => {
        const [h, m] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m + mins, 0, 0);
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };

    const formatTimeDisplay = (timeStr) => {
        if (!timeStr) return "";
        const [h, m] = timeStr.split(':').map(Number);
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
    };

    const batchConfig = useMemo(() => {
        if (!settings?.batchDurations || !formData.batch) return null;
        return settings.batchDurations.find(bd => bd.batchId?.toString() === formData.batch?.toString());
    }, [settings, formData.batch]);

    // ─── Dynamic Grid Generation ─────────────────────────────────────────────
    const gridRows = useMemo(() => {
        const config = batchConfig || { startTime: "07:30", endTime: "17:00", lectureDuration: 60, labDuration: 120, breaks: [] };
        const duration = formData.type === 'Lab' ? (config.labDuration || 120) : (config.lectureDuration || 60);
        const batchEnd = config.endTime || "17:00";
        
        let rows = [];
        let currentTime = config.startTime || "07:30";
        
        // Helper to compare "HH:mm" strings
        const isPastEnd = (time, end) => {
            const [h1, m1] = time.split(':').map(Number);
            const [h2, m2] = end.split(':').map(Number);
            return (h1 > h2) || (h1 === h2 && m1 >= m2);
        };

        // Generate slots until batchEnd is reached
        for (let i = 0; i < 20; i++) {
            if (isPastEnd(currentTime, batchEnd)) break;

            // Check for break AT this startTime
            const breakFound = config.breaks?.find(b => b.startTime === currentTime);
            if (breakFound) {
                const bEndTime = addMinutes(breakFound.startTime, breakFound.duration);
                rows.push({
                    type: 'break',
                    label: breakFound.label,
                    startTime: breakFound.startTime,
                    endTime: bEndTime,
                    duration: breakFound.duration
                });
                currentTime = bEndTime;
                if (isPastEnd(currentTime, batchEnd)) break;
            }

            const slotEndTime = addMinutes(currentTime, duration);
            rows.push({
                type: 'slot',
                startTime: currentTime,
                endTime: slotEndTime,
                duration: duration,
                id: `row-${i}`
            });
            currentTime = slotEndTime;
        }
        return rows;
    }, [batchConfig, formData.type]);

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const getNextWeekdayDate = (dayIndex) => {
        const now = new Date();
        const day = now.getDay();
        const targetDay = dayIndex + 1; // 1 (Mon) - 6 (Sat)
        let diff = targetDay - day;
        if (diff < 0) diff += 7;
        const date = new Date(now);
        date.setDate(now.getDate() + diff);
        return date;
    };

    const buildFullISOTime = (dayIndex, timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        const date = getNextWeekdayDate(dayIndex);
        date.setHours(h, m, 0, 0);
        return date.toISOString();
    };

    const isDropdownsSelected = !!(formData.subject && formData.batch && formData.type && formData.classroom);

    // ─── Conflict Logic ──────────────────────────────────────────────────────
    const getConflict = (dayIdx, row) => {
        if (row.type === 'break') return null;
        
        const tentativeStart = new Date(buildFullISOTime(dayIdx, row.startTime));
        const tentativeEnd = new Date(buildFullISOTime(dayIdx, row.endTime));

        return existingLectures.find(lec => {
            const lecStart = new Date(lec.startTime);
            const lecEnd = new Date(lec.endTime);
            const overlaps = lecStart < tentativeEnd && lecEnd > tentativeStart;
            if (!overlaps) return false;
            
            const isTeacherConflict = lec.teacher?._id === formData.teacher;
            const isClassroomConflict = lec.classroom === formData.classroom;
            const isBatchConflict = lec.batch?._id === formData.batch;
            return isTeacherConflict || isClassroomConflict || isBatchConflict;
        });
    };

    const isSlotSelected = (dayIdx, rowId) => {
        return selectedSlots.some(s => s.day === dayIdx && s.rowId === rowId);
    };

    const getSlotStyle = (dayIdx, row) => {
        if (row.type === 'break') return 'bg-slate-800/80 cursor-not-allowed opacity-60';
        if (isSlotSelected(dayIdx, row.id)) {
            return 'bg-teal-500/20 shadow-[inset_0_0_20px_rgba(20,184,166,0.08)] border border-teal-500/30';
        }
        const conflict = getConflict(dayIdx, row);
        if (conflict) {
            if (conflict.teacher?._id === formData.teacher) {
                return 'bg-purple-500/10 border-purple-500/20 cursor-not-allowed';
            }
            return 'bg-red-500/5 cursor-not-allowed';
        }
        if (!isDropdownsSelected) return 'opacity-20 cursor-not-allowed pointer-events-none grayscale';
        return 'hover:bg-teal-500/10 cursor-pointer';
    };

    const step1Valid = formData.title && formData.teacher;

    const handleSlotClick = (dayIdx, row) => {
        if (!isDropdownsSelected || row.type === 'break') return;

        const existingIdx = selectedSlots.findIndex(s => s.day === dayIdx && s.rowId === row.id);
        if (existingIdx !== -1) {
            const newSlots = [...selectedSlots];
            newSlots.splice(existingIdx, 1);
            setSelectedSlots(newSlots);
            return;
        }

        if (getConflict(dayIdx, row)) {
            dispatch(addToast({ type: 'error', message: `Conflict detected for this specifically calculated slot.` }));
            return;
        }

        setSelectedSlots([...selectedSlots, {
            day: dayIdx,
            rowId: row.id,
            startTime: row.startTime,
            endTime: row.endTime,
            subject: formData.subject,
            batch: formData.batch,
            type: formData.type,
            classroom: formData.classroom,
        }]);
    };

    const handleSubmit = async () => {
        if (selectedSlots.length === 0) return;
        let allSuccess = true;
        for (const slot of selectedSlots) {
            const payload = {
                ...formData,
                subject: slot.subject,
                batch: slot.batch,
                type: slot.type,
                division: 'A',
                classroom: slot.classroom,
                startTime: buildFullISOTime(slot.day, slot.startTime),
                endTime: buildFullISOTime(slot.day, slot.endTime)
            };
            const resultAction = await dispatch(createLecture(payload));
            if (!createLecture.fulfilled.match(resultAction)) {
                dispatch(addToast({ type: 'error', message: resultAction.payload?.message || "Scheduling conflict" }));
                allSuccess = false;
            }
        }
        if (allSuccess) {
            dispatch(addToast({ type: 'success', message: 'Academic schedule updated!' }));
            if (onClose) onClose();
        }
    };

    const selectedTeacher = teachers.find(t => t._id === formData.teacher);
    const getBatchName = (batchId) => batches.find(b => b._id === batchId)?.name || '---';
    const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const initials = getInitials(selectedTeacher?.name);

    return (
        <div className={`space-y-0 ${isFullscreen ? 'p-8 min-h-screen bg-slate-950 flex flex-col' : ''}`}>
            {/* Step Indicator */}
            <div className="flex items-center space-x-3 mb-6">
                {[1, 2].map(s => (
                    <div key={s} className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step >= s ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>{s}</div>
                        <span className={`text-xs font-bold ${step >= s ? 'text-white' : 'text-slate-600'}`}>
                            {s === 1 ? 'Academic Context' : 'Timetable Matrix'}
                        </span>
                        {s < 2 && <div className={`h-px w-8 ${step > s ? 'bg-teal-500' : 'bg-slate-800'}`} />}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={`space-y-4 ${isFullscreen ? 'max-w-2xl mx-auto w-full pt-10' : ''}`}>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2.5 bg-teal-500/20 rounded-xl text-teal-400"><Calendar className="w-5 h-5" /></div>
                            <div>
                                <h2 className="text-xl font-black text-white italic">Scheduler Initialization</h2>
                                <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Provide core session parameters</p>
                            </div>
                        </div>

                        <input
                            type="text" placeholder="Lecture Title / Course Name"
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />

                        <select value={formData.teacher} onChange={(e) => {
                            const t = teachers.find(teach => teach._id === e.target.value);
                            setFormData({ ...formData, teacher: e.target.value, subject: t?.subjects?.[0] || "" });
                        }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white appearance-none outline-none focus:ring-2 focus:ring-teal-500">
                            <option value="">Select Resource Personnel (Teacher)</option>
                            {teachers.map(t => (
                                <option key={t._id} value={t._id}>
                                    {t.name} {t.subjects && t.subjects.length > 0 ? `(${t.subjects.join(', ')})` : ''}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={() => step1Valid && setStep(2)}
                            className={`w-full py-4 font-black rounded-2xl transition-all flex items-center justify-center space-x-2 ${step1Valid ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-xl shadow-teal-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                        >
                            <span>Validate & Map Schedule</span>
                            <Plus className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={`space-y-4 ${isFullscreen ? 'flex-1 flex flex-col' : ''}`}>
                        {/* Header controls moved into compact bar */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-white italic">Dynamic Matrix</h2>
                                <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Generated based on {getBatchName(formData.batch)} policy</p>
                            </div>
                            <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-white transition-colors px-4 py-2 bg-slate-800 rounded-xl border border-slate-700">← Change Details</button>
                        </div>

                        {/* Config bar */}
                        <div className="grid grid-cols-4 gap-3 p-4 bg-slate-900 border border-slate-800 rounded-[28px]">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Subject</label>
                                <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-teal-500">
                                    <option value="">Select Subject</option>
                                    {selectedTeacher?.subjects?.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Batch Target</label>
                                <select value={formData.batch} onChange={(e) => { setFormData({ ...formData, batch: e.target.value }); setSelectedSlots([]); }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-teal-500">
                                    <option value="">Select Batch</option>
                                    {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Type</label>
                                <select value={formData.type} onChange={(e) => { setFormData({ ...formData, type: e.target.value, classroom: "" }); setSelectedSlots([]); }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-teal-500">
                                    <option value="Lecture">Lecture</option>
                                    <option value="Lab">Practical/Lab</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Infrastructure</label>
                                {formData.type === 'Lab' ? (
                                    <select value={formData.classroom} onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-teal-500">
                                        <option value="">Select Lab</option>
                                        <option value="IT Lab">IT Lab</option>
                                        <option value="CS Lab">CS Lab</option>
                                        <option value="BMS Lab">BMS Lab</option>
                                    </select>
                                ) : (
                                    <input type="text" placeholder="Room No." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" value={formData.classroom} onChange={(e) => setFormData({ ...formData, classroom: e.target.value })} />
                                )}
                            </div>
                        </div>

                        {/* Timetable Grid Overhaul */}
                        <div className={`bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden ${isFullscreen ? 'flex-1 shadow-2xl' : ''}`}>
                            <div className="grid grid-cols-[140px_repeat(6,1fr)] bg-slate-800/40 sticky top-0 z-20 border-b border-slate-800 backdrop-blur-xl">
                                <div className="p-4 border-r border-slate-800 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-slate-600" />
                                </div>
                                {DAYS.map(day => (
                                    <div key={day} className="p-4 text-center border-r border-slate-800">
                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{day.slice(0, 3)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="relative overflow-y-auto max-h-[600px] custom-scrollbar">
                                {gridRows.map(row => (
                                    <div key={row.id || row.startTime} className={`grid grid-cols-[140px_repeat(6,1fr)] border-t border-slate-800/50 ${row.type === 'break' ? 'bg-slate-800/5' : 'hover:bg-slate-800/10'} transition-colors`}>
                                        <div className="px-4 py-8 text-[11px] font-black flex flex-col items-center justify-center border-r border-slate-800 bg-slate-900/50 space-y-1">
                                            <span className="text-white">{formatTimeDisplay(row.startTime)}</span>
                                            <div className="h-px w-4 bg-slate-700" />
                                            <span className="text-slate-500">{formatTimeDisplay(row.endTime)}</span>
                                            {row.type === 'break' && <Coffee className="w-3 h-3 text-amber-500 mt-2" />}
                                        </div>
                                        
                                        {DAYS.map((_, dayIdx) => {
                                            if (row.type === 'break') {
                                                return (
                                                    <div key={dayIdx} className="border-r border-slate-800/50 flex flex-col items-center justify-center p-2 opacity-30 select-none">
                                                        <span className="text-[8px] font-black uppercase text-slate-600 tracking-widest -rotate-90">{row.label}</span>
                                                    </div>
                                                );
                                            }

                                            const isSelected = isSlotSelected(dayIdx, row.id);
                                            const conflict = getConflict(dayIdx, row);
                                            const slotClass = getSlotStyle(dayIdx, row);
                                            
                                            return (
                                                <button
                                                    key={`${dayIdx}-${row.id}`}
                                                    onClick={() => handleSlotClick(dayIdx, row)}
                                                    className={`${isFullscreen ? 'h-28' : 'h-20'} border-r border-slate-800/50 relative transition-all group ${slotClass} overflow-hidden`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute inset-1 flex flex-col items-center justify-center text-center">
                                                            <div className="w-7 h-7 bg-teal-500 text-slate-950 font-black rounded-lg flex items-center justify-center shadow-lg mb-1">{initials}</div>
                                                            <span className="text-[8px] font-black text-white uppercase truncate px-1">{formData.subject}</span>
                                                            <span className="text-[7px] text-teal-400 font-bold">{getBatchName(formData.batch)}</span>
                                                        </div>
                                                    )}
                                                    {conflict && !isSelected && (
                                                        <div className="absolute inset-1 flex flex-col items-center justify-center text-center">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${conflict.teacher?._id === formData.teacher ? 'bg-purple-500/20 text-purple-400' : 'bg-red-500/10 text-red-500'}`}>
                                                                <AlertTriangle className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-[7px] font-bold text-slate-600 uppercase">Occupied</span>
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Bar Overhaul */}
                        <div className="flex items-center space-x-4 pt-2">
                            <div className="flex-1 p-5 bg-slate-900 border border-slate-800 rounded-[24px] flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg font-black text-teal-400">
                                        {selectedSlots.length}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase tracking-wider italic">Pending Assignments</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Target: {getBatchName(formData.batch)} • Type: {formData.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-teal-500 uppercase tracking-widest">{formData.subject || 'No Subject'}</p>
                                    <p className="text-[10px] text-slate-500">Staff: {selectedTeacher?.name || '---'}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={selectedSlots.length === 0}
                                className={`px-12 py-5 font-black rounded-[24px] transition-all text-sm uppercase tracking-widest ${selectedSlots.length > 0 ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-2xl shadow-teal-500/40 active:scale-95' : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'}`}
                            >
                                Publish Timetable
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
