"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Trash2, Users, Calendar, GraduationCap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { addToast } from "@/redux/slices/uiSlice";

export default function BatchManager() {
    const [batches, setBatches] = useState([]);
    const departments = ['IT', 'CS'];
    const [newBatch, setNewBatch] = useState({ name: "", year: new Date().getFullYear(), department: "", studentCount: 60 });
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchData();
    }, [userInfo]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const batchRes = await axios.get('http://localhost:5000/api/hierarchy/batches', config);
            setBatches(batchRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            await axios.post('http://localhost:5000/api/hierarchy/batches', newBatch, config);
            dispatch(addToast({ type: 'success', message: 'Batch Created Successfully' }));
            setNewBatch({ ...newBatch, name: "" });
            fetchData();
        } catch (error) {
            dispatch(addToast({ type: 'error', message: error.response?.data?.message || 'Failed to create batch' }));
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight flex items-center">
                    <Users className="w-8 h-8 mr-3 text-teal-400" />
                    Batch Logistics
                </h2>
                <p className="text-slate-500 text-sm">Create and organize academic groups across departments.</p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
                {/* Form Column (Right-leaning in visual weight) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="p-6 bg-slate-800/50 border border-slate-700/50 rounded-[24px] shadow-xl backdrop-blur-xl">
                        <h3 className="text-sm font-black text-teal-400 uppercase tracking-widest mb-6 px-1">Configure New Batch</h3>

                        <form onSubmit={handleCreate} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter px-2">Identification</label>
                                <input
                                    type="text"
                                    placeholder="Batch Name (e.g. FYCS-A)"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-teal-500/50 transition-all outline-none"
                                    value={newBatch.name}
                                    onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter px-2">Year</label>
                                    <input
                                        type="number"
                                        placeholder="2024"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500/50 outline-none"
                                        value={newBatch.year}
                                        onChange={(e) => setNewBatch({ ...newBatch, year: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter px-2">Students</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500/50 outline-none"
                                        value={newBatch.studentCount}
                                        onChange={(e) => setNewBatch({ ...newBatch, studentCount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter px-2">Department Allocation</label>
                                <div className="flex gap-2">
                                    {departments.map((d) => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setNewBatch({ ...newBatch, department: d })}
                                            className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all border ${newBatch.department === d
                                                    ? 'bg-teal-500 border-teal-400 text-slate-950 shadow-lg shadow-teal-500/20'
                                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                                                }`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 mt-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-95 flex items-center justify-center group"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                INITIALIZE BATCH
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Column */}
                <div className="md:col-span-3 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Inventories • {batches.length}</span>
                    </div>

                    <div className="grid gap-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {batches.map((batch, i) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={batch._id}
                                    className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-teal-500/50 transition-all shadow-lg"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-slate-800 rounded-xl text-teal-400 group-hover:scale-110 transition-transform">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white flex items-center">
                                                {batch.name}
                                                <span className="ml-2 px-1.5 py-0.5 bg-slate-800 text-[8px] rounded border border-slate-700 text-slate-500">{batch.year}</span>
                                            </h4>
                                            <div className="flex items-center space-x-3 mt-1">
                                                <span className={`text-[10px] font-bold ${batch.department === 'IT' ? 'text-teal-400' : 'text-blue-400'}`}>{batch.department}</span>
                                                <span className="w-1 h-1 bg-slate-700 rounded-full" />
                                                <span className="text-[10px] text-slate-500 font-medium">{batch.studentCount || 0} Students Allocated</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-600 hover:text-red-400 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {batches.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 rounded-[32px] border border-dashed border-slate-800">
                                <Users className="w-12 h-12 text-slate-800 mb-4" />
                                <p className="text-slate-600 font-bold italic tracking-tight">Empty Registry</p>
                                <p className="text-[10px] text-slate-700 mt-1 uppercase tracking-widest">Awaiting digital allocation</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

