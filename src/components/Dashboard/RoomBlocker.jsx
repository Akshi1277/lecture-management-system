"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, CalendarRange, RotateCcw, XCircle } from "lucide-react";
import axios from "axios";
import { addToast } from "@/redux/slices/uiSlice";
import { fetchLectures } from "@/redux/slices/lectureSlice";

export default function RoomBlocker({ onClose }) {
    const [formData, setFormData] = useState({
        room: "",
        date: "",
        startTime: "",
        endTime: "",
        reason: "",
        action: "relocate",
        newRoom: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [affectedCount, setAffectedCount] = useState(null);
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);

    // Mock check for affected lectures - in a real app, this could be a debounced API call
    // For now, we'll let the submission handle it and show the result

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
            const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

            const payload = {
                room: formData.room,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                reason: formData.reason,
                action: formData.action,
                ...(formData.action === 'relocate' && { newRoom: formData.newRoom })
            };

            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/rooms/block`, payload, config);

            dispatch(addToast({
                type: 'success',
                message: `Room blocked successfully. ${data.affectedCount} lecture(s) ${data.actionTaken}.`
            }));

            // Refresh schedule globally
            dispatch(fetchLectures());

            if (onClose) onClose();

        } catch (err) {
            dispatch(addToast({
                type: 'error',
                message: err.response?.data?.message || 'Failed to block room'
            }));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-red-500/20 rounded-2xl border border-red-500/30">
                    <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white italic tracking-tight">Master Room Blocker</h2>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Exams & Maintenance Lockdown Protocol</p>
                </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-amber-500">Warning: Destructive Action</h4>
                    <p className="text-xs text-amber-500/80 mt-1">
                        Blocking a room will automatically override any existing lectures scheduled during this window.
                        Affected teachers and students will be notified via WebSocket immediately.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Room to Block</label>
                        <input
                            type="text" required placeholder="e.g. Room 402 or Main Hall"
                            value={formData.room} onChange={e => setFormData({ ...formData, room: e.target.value })}
                            className="w-full bg-slate-800 border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Date</label>
                        <input
                            type="date" required
                            value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-slate-800 border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">Start Time</label>
                        <input
                            type="time" required
                            value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                            className="w-full bg-slate-800 border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase ml-1">End Time</label>
                        <input
                            type="time" required
                            value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                            className="w-full bg-slate-800 border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase ml-1">Reason for Lockdown</label>
                    <input
                        type="text" required placeholder="e.g. 10th Board Exams - Biology"
                        value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })}
                        className="w-full bg-slate-800 border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-red-500 outline-none"
                    />
                </div>

                <div className="border-t border-slate-800 pt-6">
                    <h4 className="text-sm font-bold text-white mb-4">Conflict Resolution Rule</h4>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, action: 'relocate' })}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${formData.action === 'relocate' ? 'bg-blue-500/10 border-blue-500' : 'bg-slate-800 border-transparent hover:border-slate-700'}`}
                        >
                            <RotateCcw className={`w-6 h-6 mb-2 ${formData.action === 'relocate' ? 'text-blue-500' : 'text-slate-500'}`} />
                            <span className={`font-bold text-sm ${formData.action === 'relocate' ? 'text-blue-500' : 'text-slate-400'}`}>Relocate Lectures</span>
                            <span className="text-[10px] text-slate-500 mt-1">Move them to a backup room</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, action: 'cancel' })}
                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center ${formData.action === 'cancel' ? 'bg-red-500/10 border-red-500' : 'bg-slate-800 border-transparent hover:border-slate-700'}`}
                        >
                            <XCircle className={`w-6 h-6 mb-2 ${formData.action === 'cancel' ? 'text-red-500' : 'text-slate-500'}`} />
                            <span className={`font-bold text-sm ${formData.action === 'cancel' ? 'text-red-500' : 'text-slate-400'}`}>Cancel Lectures</span>
                            <span className="text-[10px] text-slate-500 mt-1">Suspend them completely</span>
                        </button>
                    </div>
                </div>

                {formData.action === 'relocate' && (
                    <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
                        <label className="text-xs font-black text-blue-400 uppercase ml-1">Backup Venue / Relocated To</label>
                        <input
                            type="text" required placeholder="e.g. Room 501"
                            value={formData.newRoom} onChange={e => setFormData({ ...formData, newRoom: e.target.value })}
                            className="w-full bg-blue-500/5 border-blue-500/30 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-blue-500/30"
                        />
                    </div>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={submitting || !formData.room || !formData.date || !formData.startTime || !formData.endTime || !formData.reason}
                        className="w-full p-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-[0.98] uppercase tracking-widest text-sm"
                    >
                        {submitting ? 'Executing Protocol...' : 'Initiate Lockdown'}
                    </button>
                </div>
            </form>
        </div>
    );
}
