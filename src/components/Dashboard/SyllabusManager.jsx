"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BookOpen, CheckCircle, Circle, BarChart3, Plus, Trash2 } from "lucide-react";
import axios from "axios";
import { addToast } from "@/redux/slices/uiSlice";

export default function SyllabusManager({ courseId, onClose }) {
    const [units, setUnits] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newUnit, setNewUnit] = useState({ unitNumber: "", title: "", description: "" });
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSyllabus = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                const res = await axios.get(`http://localhost:5000/api/courses/${courseId}/syllabus`, config);
                setUnits(res.data);

                // Also fetch course name
                const resCourse = await axios.get(`http://localhost:5000/api/hierarchy/courses`, config);
                const foundCourse = resCourse.data.find(c => c._id === courseId);
                setCourse(foundCourse);

                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        if (userInfo && courseId) fetchSyllabus();
    }, [userInfo, courseId]);

    const toggleUnit = async (unitId, currentStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            await axios.put(`http://localhost:5000/api/courses/${courseId}/syllabus/${unitId}`, { isCompleted: !currentStatus }, config);
            setUnits(prev => prev.map(u => u._id === unitId ? { ...u, isCompleted: !currentStatus } : u));
            dispatch(addToast({ type: 'success', message: 'Syllabus progress updated!' }));
        } catch (error) {
            dispatch(addToast({ type: 'error', message: 'Update failed' }));
        }
    };

    const handleAddUnit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const res = await axios.post(`http://localhost:5000/api/courses/${courseId}/syllabus`, newUnit, config);
            setUnits(res.data.syllabus);
            setNewUnit({ unitNumber: "", title: "", description: "" });
            dispatch(addToast({ type: 'success', message: 'Unit added to syllabus!' }));
        } catch (error) {
            dispatch(addToast({ type: 'error', message: 'Failed to add unit' }));
        }
    };

    const completionRate = units.length > 0
        ? Math.round((units.filter(u => u.isCompleted).length / units.length) * 100)
        : 0;

    if (loading) return <div className="p-10 text-center text-slate-500 italic">Accessing curriculum data...</div>;

    return (
        <div className="space-y-6 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{course?.name}</h2>
                        <p className="text-slate-500 text-sm">Syllabus Coverage Tracker</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-white">{completionRate}%</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Completed</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                />
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {units.map((unit) => (
                    <div
                        key={unit._id}
                        onClick={() => toggleUnit(unit._id, unit.isCompleted)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${unit.isCompleted ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                            }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${unit.isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                                }`}>
                                U{unit.unitNumber}
                            </div>
                            <div>
                                <h4 className={`font-bold text-sm ${unit.isCompleted ? 'text-emerald-400' : 'text-white'}`}>{unit.title}</h4>
                                <p className="text-[10px] text-slate-500">{unit.description}</p>
                            </div>
                        </div>
                        {unit.isCompleted ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Circle className="w-5 h-5 text-slate-600" />}
                    </div>
                ))}

                {/* Admin Only: Add Unit Form (Since teacher can also add if allowed, but usually department heads do) */}
                {userInfo?.role === 'admin' && (
                    <form onSubmit={handleAddUnit} className="p-4 border border-dashed border-slate-700 rounded-2xl space-y-3 mt-4">
                        <div className="grid grid-cols-4 gap-2">
                            <input
                                type="number"
                                placeholder="#"
                                className="bg-slate-800 border-none rounded-lg p-2 text-xs text-white"
                                value={newUnit.unitNumber}
                                onChange={(e) => setNewUnit({ ...newUnit, unitNumber: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Unit Title"
                                className="col-span-3 bg-slate-800 border-none rounded-lg p-2 text-xs text-white"
                                value={newUnit.title}
                                onChange={(e) => setNewUnit({ ...newUnit, title: e.target.value })}
                                required
                            />
                        </div>
                        <textarea
                            placeholder="Unit Description"
                            className="w-full bg-slate-800 border-none rounded-lg p-2 text-xs text-white h-16"
                            value={newUnit.description}
                            onChange={(e) => setNewUnit({ ...newUnit, description: e.target.value })}
                        />
                        <button type="submit" className="w-full py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 hover:bg-indigo-500/20">
                            <Plus className="w-4 h-4" />
                            <span>Add Syllabus Unit</span>
                        </button>
                    </form>
                )}

                {units.length === 0 && (
                    <div className="text-center py-10 text-slate-600 italic text-sm">No syllabus units defined for this course.</div>
                )}
            </div>
        </div>
    );
}
