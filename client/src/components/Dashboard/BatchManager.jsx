"use client";
import { fetchBatches, createBatch, deleteBatch } from "@/redux/slices/hierarchySlice";
import { fetchDepartments } from "@/redux/slices/departmentSlice";
import { addToast } from "@/redux/slices/uiSlice";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Trash2, Edit2, Users, Calendar, GraduationCap, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateBatch } from "@/redux/slices/hierarchySlice";

export default function BatchManager() {
    const { batches } = useSelector((state) => state.hierarchy);
    const { list: departments } = useSelector((state) => state.departments);
    const [newBatch, setNewBatch] = useState({ name: "", year: new Date().getFullYear(), department: "", studentCount: 60 });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchBatches());
            dispatch(fetchDepartments());
        }
    }, [userInfo, dispatch]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!newBatch.department) {
            dispatch(addToast({ type: 'error', message: 'Please select a department' }));
            return;
        }

        let resultAction;
        if (isEditing) {
            resultAction = await dispatch(updateBatch({ id: editingId, batchData: newBatch }));
        } else {
            resultAction = await dispatch(createBatch(newBatch));
        }

        if (createBatch.fulfilled.match(resultAction) || updateBatch.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: `Batch ${isEditing ? 'Updated' : 'Created'} Successfully` }));
            resetForm();
        } else {
            dispatch(addToast({ type: 'error', message: resultAction.payload || 'Action failed' }));
        }
    };

    const resetForm = () => {
        setNewBatch({ name: "", year: new Date().getFullYear(), department: "", studentCount: 60 });
        setIsEditing(false);
        setEditingId(null);
    };

    const startEdit = (batch) => {
        setNewBatch({
            name: batch.name,
            year: batch.year,
            department: batch.department,
            studentCount: batch.studentCount
        });
        setIsEditing(true);
        setEditingId(batch._id);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;
        const resultAction = await dispatch(deleteBatch(deleteConfirm));
        if (deleteBatch.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: 'Batch Deleted Successfully' }));
        } else {
            dispatch(addToast({ type: 'error', message: resultAction.payload || 'Failed to delete batch' }));
        }
        setDeleteConfirm(null);
    };

    return (
        <div className="space-y-8 relative">
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setDeleteConfirm(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] max-w-sm w-full relative z-10 shadow-2xl text-center space-y-6"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white italic uppercase">Security Clearance</h3>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed">This action will purge all academic records for this batch. Proceed with decommissioning?</p>
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">Abort</button>
                                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 hover:bg-red-400 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-red-500/20">Purge Record</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center italic">
                    <Users className="w-8 h-8 mr-3 text-teal-400" />
                    Batch Logistics
                </h2>
                <p className="text-slate-500 text-sm uppercase text-[10px] font-black tracking-widest">Digital Infrastructure & Academic Groups</p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-[32px] shadow-xl backdrop-blur-xl group">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-teal-400 uppercase tracking-widest px-1">
                                {isEditing ? 'Modify Logistics' : 'Configure New Batch'}
                            </h3>
                            {isEditing && (
                                <button onClick={resetForm} className="p-2 bg-slate-700/50 rounded-lg text-slate-400 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSave} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter px-2 italic">Identification</label>
                                <input
                                    type="text"
                                    placeholder="Batch Name (e.g. FYBMS-A)"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-teal-500/50 transition-all outline-none italic font-bold"
                                    value={newBatch.name}
                                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter px-2 italic">Year</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500/50 outline-none font-bold"
                                        value={newBatch.year}
                                        onChange={(e) => setNewBatch({ ...newBatch, year: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter px-2 italic">{isEditing ? 'New Capacity' : 'Max Students'}</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500/50 outline-none font-bold"
                                        value={newBatch.studentCount}
                                        onChange={(e) => setNewBatch({ ...newBatch, studentCount: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter px-2 italic">Department Allocation</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {departments.map((d) => (
                                        <button
                                            key={d._id}
                                            type="button"
                                            onClick={() => setNewBatch({ ...newBatch, department: d.code })}
                                            className={`py-3 rounded-2xl text-[9px] font-black tracking-widest transition-all border uppercase ${newBatch.department === d.code
                                                ? 'bg-teal-500 border-teal-400 text-slate-950 shadow-lg shadow-teal-500/20'
                                                : 'bg-slate-900 border-slate-700 text-slate-500 hover:bg-slate-800'
                                                }`}
                                        >
                                            {d.code}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-4 mt-2 ${isEditing ? 'bg-amber-500 hover:bg-amber-400' : 'bg-teal-500 hover:bg-teal-400'} text-slate-950 font-black rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center group uppercase tracking-widest text-xs`}
                            >
                                {isEditing ? <Edit2 className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                                {isEditing ? 'Update Logistics' : 'Initialize Batch'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="md:col-span-3 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Inventories • {batches.length}</span>
                    </div>

                    <div className="grid gap-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar no-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {batches.map((batch, i) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={batch._id}
                                    className={`p-5 bg-slate-900/50 border ${editingId === batch._id ? 'border-amber-500/50 bg-amber-500/5 shadow-amber-500/10' : 'border-slate-800'} rounded-[32px] flex items-center justify-between group hover:border-teal-500/30 transition-all shadow-xl`}
                                >
                                    <div className="flex items-center space-x-5">
                                        <div className={`p-4 rounded-2xl transition-transform ${editingId === batch._id ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-teal-400'}`}>
                                            <GraduationCap className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-lg text-white italic flex items-center uppercase tracking-tight">
                                                {batch.name}
                                                <span className="ml-3 px-2 py-0.5 bg-slate-800 text-[9px] rounded-lg border border-slate-700 text-slate-400 font-black">{batch.year}</span>
                                            </h4>
                                            <div className="flex items-center space-x-3 mt-1.5">
                                                <span className="text-[10px] font-black uppercase text-teal-400 tracking-widest">{batch.department}</span>
                                                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">{batch.studentCount || 0} SEATS ALLOCATED</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => startEdit(batch)}
                                            className="p-3 bg-slate-800/50 text-slate-500 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-all"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => setDeleteConfirm(batch._id)}
                                            className="p-3 bg-slate-800/50 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}


