"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Megaphone, Plus, Trash2, Calendar, 
    Users, ShieldAlert, Clock, Filter, 
    Send, AlertTriangle 
} from "lucide-react";
import { addToast } from "@/redux/slices/uiSlice";
import { fetchAnnouncements, createAnnouncement, deleteAnnouncement } from "@/redux/slices/dashboardSlice";
import { fetchBatches } from "@/redux/slices/hierarchySlice";

export default function NoticeBoard() {
    const { userInfo } = useSelector((state) => state.auth);
    const { announcements: notices, loading } = useSelector((state) => state.dashboard);
    const { batches } = useSelector((state) => state.hierarchy);
    const dispatch = useDispatch();

    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        targetAudience: "all",
        priority: "medium",
        targetBatch: ""
    });

    useEffect(() => {
        dispatch(fetchAnnouncements());
        if (userInfo?.role === 'admin' || userInfo?.role === 'teacher') {
            dispatch(fetchBatches());
        }
    }, [userInfo, dispatch]);

    const handleCreate = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(createAnnouncement(formData));
        if (createAnnouncement.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: 'Notice broadcasted successfully!' }));
            setIsCreating(false);
            setFormData({ title: "", content: "", targetAudience: "all", priority: "medium", targetBatch: "" });
        } else {
            dispatch(addToast({ type: 'error', message: resultAction.payload || 'Failed to broadcast notice.' }));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this notice?")) return;
        const resultAction = await dispatch(deleteAnnouncement(id));
        if (deleteAnnouncement.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: 'Notice removed.' }));
        } else {
            dispatch(addToast({ type: 'error', message: resultAction.payload || 'Failed to delete notice.' }));
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'medium': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight">Notice Board</h1>
                    <p className="text-slate-400 mt-1">Institutional broadcasts and real-time announcements.</p>
                </div>
                {(userInfo?.role === 'admin' || userInfo?.role === 'teacher') && (
                    <button 
                        onClick={() => setIsCreating(!isCreating)}
                        className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl text-sm font-black transition-all shadow-lg shadow-teal-500/20 flex items-center"
                    >
                        <Plus className="w-4 h-4 mr-2" /> {isCreating ? "Cancel" : "New Broadcast"}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleCreate} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase ml-1">Title</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="e.g., Semester End Examination Schedule" 
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase ml-1">Priority</label>
                                        <select 
                                            value={formData.priority}
                                            onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none appearance-none"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase ml-1">Target Audience</label>
                                        <select 
                                            value={formData.targetAudience}
                                            onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none appearance-none"
                                        >
                                            <option value="all">Everyone</option>
                                            <option value="teachers">Faculty Only</option>
                                            <option value="students">Students Only</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {formData.targetAudience === 'students' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase ml-1">Target Specific Batch (Optional)</label>
                                    <select 
                                        value={formData.targetBatch}
                                        onChange={(e) => setFormData({...formData, targetBatch: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none appearance-none"
                                    >
                                        <option value="">All Batches</option>
                                        {batches.map(b => (
                                            <option key={b._id} value={b._id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase ml-1">Broadcast Content</label>
                                <textarea 
                                    required
                                    rows={4}
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    placeholder="Type your announcement details here..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none resize-none"
                                />
                            </div>

                            <button type="submit" className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-teal-500/20 flex items-center justify-center">
                                <Send className="w-5 h-5 mr-3" /> Broadcast Announcement
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500 italic">Connecting to announcement frequency...</p>
                    </div>
                ) : notices.length === 0 ? (
                    <div className="col-span-full py-20 text-center flex flex-col items-center">
                        <div className="p-5 bg-slate-900 rounded-full mb-4">
                            <Megaphone className="w-10 h-10 text-slate-700" />
                        </div>
                        <p className="text-slate-500 font-bold">No active announcements.</p>
                    </div>
                ) : (
                    notices.map((notice, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            key={notice._id}
                            className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-6 flex flex-col h-fit hover:border-slate-700 transition-colors group relative shadow-xl"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-0.5 border rounded-lg text-[9px] font-black uppercase tracking-widest ${getPriorityColor(notice.priority)}`}>
                                            {notice.priority}
                                        </span>
                                        <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest bg-slate-800 px-2 py-0.5 rounded-lg">
                                            {notice.targetAudience}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors">{notice.title}</h3>
                                </div>
                                { (userInfo?.role === 'admin' || notice.author?._id === userInfo?._id) && (
                                    <button 
                                        onClick={() => handleDelete(notice._id)}
                                        className="p-3 bg-slate-950/50 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all border border-slate-800/50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <p className="text-slate-400 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                                {notice.content}
                            </p>

                            <div className="mt-auto pt-4 border-t border-slate-800/50 flex items-center justify-between">
                                <div className="flex items-center space-x-3 text-slate-500">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-black text-xs">
                                        {notice.author?.name?.charAt(0)}
                                    </div>
                                    <span className="text-xs font-bold text-slate-400">{notice.author?.name}</span>
                                </div>
                                <div className="flex items-center space-x-1.5 text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        {new Date(notice.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
