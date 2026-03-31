"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Trash2, BookOpen, Layers, Type } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchDepartments, createDepartment, deleteDepartment } from "@/redux/slices/departmentSlice";
import { addToast } from "@/redux/slices/uiSlice";

export default function DepartmentManager() {
    const { list: departments, loading } = useSelector((state) => state.departments);
    const [newDept, setNewDept] = useState({ name: "", code: "", description: "" });
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newDept.name || !newDept.code) {
            dispatch(addToast({ type: 'error', message: 'Name and Code are required' }));
            return;
        }
        const resultAction = await dispatch(createDepartment(newDept));
        if (createDepartment.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: 'Department Added Successfully' }));
            setNewDept({ name: "", code: "", description: "" });
        } else {
            dispatch(addToast({ type: 'error', message: resultAction.payload || 'Failed to add department' }));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This will not delete users/batches but may cause issues with dropdowns!")) {
            const resultAction = await dispatch(deleteDepartment(id));
            if (deleteDepartment.fulfilled.match(resultAction)) {
                dispatch(addToast({ type: 'success', message: 'Department Removed' }));
            }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center italic">
                    <BookOpen className="w-8 h-8 mr-3 text-blue-400" />
                    Departmental Registry
                </h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Register and manage academic divisions across the campus.</p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
                {/* Creation Form */}
                <div className="md:col-span-2">
                    <div className="p-8 bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                         <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-8">Define New Division</h3>
                         
                         <form onSubmit={handleCreate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-600 uppercase ml-2 tracking-tighter">Department Name</label>
                                <div className="relative group">
                                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Information Technology"
                                        className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl p-4 pl-12 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-sm"
                                        value={newDept.name}
                                        onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-600 uppercase ml-2 tracking-tighter">Unique Code (Abbr)</label>
                                <div className="relative group">
                                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400" />
                                    <input 
                                        type="text" 
                                        placeholder="IT"
                                        className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl p-4 pl-12 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-black text-sm uppercase"
                                        value={newDept.code}
                                        onChange={(e) => setNewDept({ ...newDept, code: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center space-x-2 text-xs uppercase tracking-widest"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Register Division</span>
                            </button>
                         </form>
                    </div>
                </div>

                {/* Registry List */}
                <div className="md:col-span-3 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Divisions • {departments.length}</span>
                    </div>

                    <div className="grid gap-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {departments.map((dept, i) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    key={dept._id}
                                    className="p-5 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between group hover:border-blue-500/30 transition-all"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-400 font-black text-lg shadow-lg border border-slate-700 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                            {dept.code}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white tracking-tight">{dept.name}</h4>
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter mt-0.5">ESTD. {new Date(dept.createdAt).getFullYear()}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(dept._id)}
                                        className="p-2 opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {departments.length === 0 && !loading && (
                            <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-[32px]">
                                <BookOpen className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                                <p className="text-slate-600 font-bold italic tracking-tight">Registry Uninitialized</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
