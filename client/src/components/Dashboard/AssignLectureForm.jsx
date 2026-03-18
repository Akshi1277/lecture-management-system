"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Plus, CheckCircle, AlertCircle, Info } from "lucide-react";
import { fetchTeachers } from "@/redux/slices/userSlice";
import { fetchBatches } from "@/redux/slices/hierarchySlice";
import { addToast } from "@/redux/slices/uiSlice";
import { createLecture, fetchLectures } from "@/redux/slices/lectureSlice";

export default function AssignLectureForm({ lecture, onClose, isFullscreen = false }) {
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);
    const { teachers } = useSelector(state => state.users);
    const { batches } = useSelector(state => state.hierarchy);
    const { list: existingLectures } = useSelector(state => state.lecture);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "", teacher: "", batch: "",
        type: "Lecture", classroom: "",
        subject: "",
        startTime: "", endTime: "",
        recurring: "none", // none, daily, weekly
        repeatUntil: "",
    });

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
                recurring: "none",
                repeatUntil: "",
            });
        }
    }, [lecture]);
    const [selectedSlots, setSelectedSlots] = useState([]);

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchTeachers());
            dispatch(fetchBatches());
            dispatch(fetchLectures());
        }
    }, [userInfo, dispatch]);

    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const HOURS = Array.from({ length: 9 }, (_, i) => i + 7); // 7 AM – 3 PM

    const getNextWeekday = (dayIndex) => {
        const now = new Date();
        const day = now.getDay(); // 0=Sun
        const targetDay = dayIndex + 1; // Mon=1
        let diff = targetDay - day;
        if (diff <= 0) diff += 7;
        const date = new Date(now);
        date.setDate(now.getDate() + diff);
        return date;
    };

    const buildTimesForSlot = (slot) => {
        if (!slot) return {};
        const date = getNextWeekday(slot.day);
        const startDate = new Date(date);

        if (slot.hour === 7) {
            startDate.setHours(7, 30, 0, 0);
        } else {
            startDate.setHours(slot.hour, 0, 0, 0);
        }

        const endDate = new Date(date);
        if (slot.hour === 7) {
            endDate.setHours(8, 30, 0, 0);
        } else {
            endDate.setHours(slot.hour + 1, 0, 0, 0);
        }

        return {
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
        };
    };

    const isDropdownsSelected = !!(formData.subject && formData.batch && formData.type && formData.classroom);

    const getSlotStyle = (dayIdx, h) => {
        const isSelected = selectedSlots.some(s => s.day === dayIdx && s.hour === h);
        if (isSelected) return 'bg-teal-500/20 shadow-[inset_0_0_20px_rgba(20,184,166,0.1)] border border-teal-500/30 active-selection';

        const conflict = getConflict(dayIdx, h);
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

    const handleSubmit = async () => {
        if (selectedSlots.length === 0) return;
        let allSuccess = true;
        for (const slot of selectedSlots) {
            const { startTime, endTime } = buildTimesForSlot(slot);
            const payload = {
                ...formData,
                subject: slot.subject,
                batch: slot.batch,
                type: slot.type,
                classroom: slot.classroom,
                startTime,
                endTime
            };
            const resultAction = await dispatch(createLecture(payload));
            if (!createLecture.fulfilled.match(resultAction)) {
                dispatch(addToast({ type: 'error', message: resultAction.payload || `Failed to assign ${slot.subject} on ${DAYS[slot.day]} at ${formatHour(slot.hour)}` }));
                allSuccess = false;
            }
        }
        if (allSuccess) {
            dispatch(addToast({ type: 'success', message: 'All lectures scheduled successfully!' }));
            if (onClose) onClose();
        }
    };

    const selectedTeacher = teachers.find(t => t._id === formData.teacher);
    const getBatchName = (batchId) => batches.find(b => b._id === batchId)?.name || '---';

    const getInitials = (name) => {
        if (!name) return "";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const initials = getInitials(selectedTeacher?.name);

    const formatHour = (h) => {
        if (h === null) return '--';
        if (h === 7) return '7:30 AM';
        const period = h >= 12 ? 'PM' : 'AM';
        const display = h > 12 ? h - 12 : h;
        return `${display}:00 ${period}`;
    };

    const getConflict = (dayIdx, hour) => {
        const slotStart = buildTimesForSlot({ day: dayIdx, hour }).startTime;

        return existingLectures.find(lec => {
            const isSameTime = lec.startTime === slotStart;
            if (!isSameTime) return false;

            const isTeacherConflict = lec.teacher?._id === formData.teacher;
            const isClassroomConflict = lec.classroom === formData.classroom;
            const isBatchConflict = lec.batch?._id === formData.batch;

            return isTeacherConflict || isClassroomConflict || isBatchConflict;
        });
    };

    return (
        <div className={`space-y-0 ${isFullscreen ? 'p-8 min-h-screen bg-slate-950 flex flex-col' : ''}`}>
            {/* Step Indicator */}
            <div className="flex items-center space-x-3 mb-6">
                {[1, 2].map(s => (
                    <div key={s} className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${step >= s ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>{s}</div>
                        <span className={`text-xs font-bold ${step >= s ? 'text-white' : 'text-slate-600'}`}>
                            {s === 1 ? 'Lecture Details' : 'Schedule on Calendar'}
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
                                <h2 className="text-xl font-black text-white">Assign Lecture</h2>
                                <p className="text-slate-500 text-xs">Fill in the core details first</p>
                            </div>
                        </div>

                        <input
                            type="text" placeholder="Lecture Title"
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />

                        <select value={formData.teacher} onChange={(e) => {
                            const t = teachers.find(teach => teach._id === e.target.value);
                            setFormData({ ...formData, teacher: e.target.value, subject: t?.subjects?.[0] || "" });
                        }}
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white appearance-none outline-none focus:ring-2 focus:ring-teal-500">
                            <option value="">Select Teacher</option>
                            {teachers.map(t => (
                                <option key={t._id} value={t._id}>
                                    {t.name} {t.subjects && t.subjects.length > 0 ? `(${t.subjects.join(', ')})` : ''}
                                </option>
                            ))}
                        </select>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Recurring Pattern</label>
                                <select 
                                    value={formData.recurring} 
                                    onChange={(e) => setFormData({ ...formData, recurring: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white appearance-none outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="none">One-time Session</option>
                                    <option value="daily">Daily Repeat</option>
                                    <option value="weekly">Weekly Repeat</option>
                                </select>
                            </div>
                            {formData.recurring !== 'none' && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Repeat Until</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:ring-2 focus:ring-teal-500"
                                        value={formData.repeatUntil}
                                        onChange={(e) => setFormData({ ...formData, repeatUntil: e.target.value })}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => step1Valid && setStep(2)}
                            className={`w-full py-4 font-black rounded-2xl transition-all flex items-center justify-center space-x-2 ${step1Valid ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-xl shadow-teal-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                        >
                            <span>Continue to Scheduling</span>
                            <Plus className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={`space-y-4 ${isFullscreen ? 'flex-1 flex flex-col' : ''}`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-black text-white italic">Timetable Layout</h2>
                                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Refine details & select time slot</p>
                            </div>
                            <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-white transition-colors px-3 py-1.5 bg-slate-800 rounded-xl">← Adjust Step 1</button>
                        </div>

                        {/* Refinement Zone */}
                        <div className="grid grid-cols-4 gap-3 p-4 bg-slate-800/40 border border-slate-800 rounded-2xl relative">
                            {!isDropdownsSelected && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-slate-950 text-[8px] font-black uppercase rounded-lg shadow-lg z-10">
                                    Quick detail selection required
                                </div>
                            )}
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Subject</label>
                                <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-teal-500 appearance-none">
                                    <option value="">Select Subject</option>
                                    {selectedTeacher?.subjects?.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Batch</label>
                                <select value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-teal-500 appearance-none">
                                    <option value="">Select Batch</option>
                                    {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Type</label>
                                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value, classroom: "" })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-teal-500 appearance-none">
                                    <option value="Lecture">Lecture</option>
                                    <option value="Lab">Practical/Lab</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-500 uppercase ml-1">Venue / Room No.</label>
                                {formData.type === 'Lab' ? (
                                    <select
                                        value={formData.classroom}
                                        onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-teal-500 appearance-none"
                                    >
                                        <option value="">Select Lab</option>
                                        <option value="IT Lab">IT Lab</option>
                                        <option value="CS Lab">CS Lab</option>
                                    </select>
                                ) : (
                                    <input type="text" placeholder="e.g. 402"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-teal-500"
                                        value={formData.classroom}
                                        onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Timetable Grid */}
                        <div className={`bg-slate-900 border border-slate-800 rounded-[24px] overflow-hidden ${isFullscreen ? 'flex-1 shadow-2xl' : ''}`}>
                            <div className="grid grid-cols-[100px_repeat(6,1fr)] bg-slate-800/30 sticky top-0 z-20 border-b border-slate-800">
                                <div className="p-4 border-r border-slate-800 bg-slate-900/50 backdrop-blur-md" />
                                {DAYS.map(day => (
                                    <div key={day} className="p-4 text-center border-r border-slate-800 bg-slate-900/50 backdrop-blur-md">
                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{day.slice(0, 3)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="relative overflow-y-auto max-h-[500px] custom-scrollbar">
                                {HOURS.map(h => (
                                    <div key={h} className="grid grid-cols-[100px_repeat(6,1fr)] border-t border-slate-800/50 hover:bg-slate-800/5 transition-colors">
                                        <div className="py-8 text-[11px] font-black text-slate-500 flex items-center justify-center border-r border-slate-800 bg-slate-800/10">
                                            {formatHour(h)}
                                        </div>
                                        {DAYS.map((_, dayIdx) => {
                                            const activeSlot = selectedSlots.find(s => s.day === dayIdx && s.hour === h);
                                            const isSelected = !!activeSlot;
                                            const conflict = getConflict(dayIdx, h);
                                            const slotClass = getSlotStyle(dayIdx, h);

                                            return (
                                                <button
                                                    key={`${dayIdx}-${h}`}
                                                    type="button"
                                                    disabled={!isDropdownsSelected || (!!conflict && !isSelected)}
                                                    onClick={() => {
                                                        const existingSlotIndex = selectedSlots.findIndex(s => s.day === dayIdx && s.hour === h);
                                                        if (existingSlotIndex !== -1) {
                                                            const newSlots = [...selectedSlots];
                                                            newSlots.splice(existingSlotIndex, 1);
                                                            setSelectedSlots(newSlots);
                                                        } else {
                                                            setSelectedSlots([...selectedSlots, {
                                                                day: dayIdx,
                                                                hour: h,
                                                                subject: formData.subject,
                                                                batch: formData.batch,
                                                                type: formData.type,
                                                                classroom: formData.classroom
                                                            }]);
                                                        }
                                                    }}
                                                    className={`${isFullscreen ? 'h-28' : 'h-16'} border-r border-slate-800/50 relative transition-all group ${slotClass}`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute inset-1 flex flex-col items-center justify-center text-center overflow-hidden">
                                                            <div className={`${isFullscreen ? 'w-9 h-9 text-[11px]' : 'w-6 h-6 text-[8px]'} bg-teal-500 text-slate-950 font-black rounded-full flex items-center justify-center shadow-lg shadow-teal-500/20 mb-0.5 shrink-0`}>
                                                                {initials}
                                                            </div>
                                                            <div className="flex flex-col leading-none">
                                                                <span className={`${isFullscreen ? 'text-[10px]' : 'text-[7px]'} font-black text-white uppercase truncate px-1`}>
                                                                    {activeSlot.subject}
                                                                </span>
                                                                <span className={`${isFullscreen ? 'text-[9px]' : 'text-[6px]'} font-bold text-teal-400 mt-0.5`}>
                                                                    {getBatchName(activeSlot.batch)}
                                                                </span>
                                                                <span className={`${isFullscreen ? 'text-[8px]' : 'text-[5px]'} font-black text-slate-400 mt-0.5 uppercase tracking-tighter bg-slate-800/50 px-1 rounded`}>
                                                                    {activeSlot.type === 'Lab' ? activeSlot.classroom : `Room ${activeSlot.classroom}`}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {conflict && !isSelected && (
                                                        <div className="absolute inset-1.5 flex flex-col items-center justify-center text-center">
                                                            <div className={`${isFullscreen ? 'w-9 h-9 text-[10px]' : 'w-7 h-7 text-[10px]'} font-black rounded-full flex items-center justify-center mb-0.5 ${conflict.teacher?._id === formData.teacher ? 'bg-purple-500/30 text-purple-400' : 'bg-red-500/20 text-red-500'}`}>
                                                                {getInitials(conflict.teacher?.name)}
                                                            </div>
                                                            <span className={`${isFullscreen ? 'text-[9px]' : 'text-[7px]'} font-bold leading-none truncate max-w-full uppercase ${conflict.teacher?._id === formData.teacher ? 'text-purple-500/70' : 'text-red-500/60'}`}>
                                                                {conflict.teacher?._id === formData.teacher ? `Busy: ${conflict.subject}` : conflict.classroom === formData.classroom ? 'Room Taken' : 'Batch Busy'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center space-x-4 pt-2">
                            <div className="flex-1 p-4 bg-slate-800/60 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-[12px] font-black text-white">
                                        {initials || '?'}
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-black text-white uppercase tracking-wider">{formData.title || 'Untitled Lecture'}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">{formData.classroom || 'No Room'} • Staff: {selectedTeacher?.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[12px] font-black text-teal-400">
                                        {selectedSlots.length > 0 ? `${selectedSlots.length} Mixed Slot(s)` : '---'}
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        {selectedSlots.length > 0 ? 'Batch/subject preserved per slot' : 'Select details above'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={selectedSlots.length === 0}
                                className={`px-10 py-5 font-black rounded-2xl transition-all h-full text-lg ${selectedSlots.length > 0 ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-xl shadow-teal-500/20 active:scale-[0.98]' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                            >
                                ✓ Schedule Now
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
