"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus, Trash2, BookOpen, Calendar, Users } from "lucide-react";
import axios from "axios";
import { addToast } from "@/redux/slices/uiSlice";

export default function BatchManager() {
    const [batches, setBatches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newBatch, setNewBatch] = useState({ name: "", year: new Date().getFullYear(), department: "", studentCount: 60 });
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchData();
    }, [userInfo]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const [batchRes, deptRes] = await Promise.all([
                axios.get('http://localhost:5000/api/hierarchy/batches', config),
                axios.get('http://localhost:5000/api/hierarchy/departments', config)
            ]);
            setBatches(batchRes.data);
            setDepartments(deptRes.data);
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
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Create Form */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <Plus className="w-5 h-5 mr-2 text-teal-400" /> Create New Batch
                    </h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Batch Name (e.g. FYCS)"
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
                            value={newBatch.name}
                            onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })}
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                placeholder="Year"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
                                value={newBatch.year}
                                onChange={(e) => setNewBatch({ ...newBatch, year: e.target.value })}
                                required
                            />
                            <input
                                type="number"
                                placeholder="Size"
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
                                value={newBatch.studentCount}
                                onChange={(e) => setNewBatch({ ...newBatch, studentCount: e.target.value })}
                                required
                            />
                        </div>
                        <select
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white"
                            value={newBatch.department}
                            onChange={(e) => setNewBatch({ ...newBatch, department: e.target.value })}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => (
                                <option key={d._id} value={d._id}>{d.name} ({d.code})</option>
                            ))}
                        </select>
                        <button type="submit" className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded-xl transition-all">
                            Create Batch
                        </button>
                    </form>
                </div>

                {/* List View */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl max-h-[400px] overflow-y-auto custom-scrollbar">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-400" /> Active Batches
                    </h3>
                    <div className="space-y-3">
                        {batches.map(batch => (
                            <div key={batch._id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-white">{batch.name}</h4>
                                    <p className="text-xs text-slate-400">{batch.year} • {batch.department?.code} • {batch.studentCount || 0} Students</p>
                                </div>
                                <div className="px-3 py-1 bg-teal-500/10 text-teal-400 text-xs rounded-full font-bold">
                                    Active
                                </div>
                            </div>
                        ))}
                        {batches.length === 0 && <p className="text-slate-500 italic text-center text-sm py-4">No batches found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
