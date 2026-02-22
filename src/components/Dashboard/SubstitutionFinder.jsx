"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Users, UserCheck, ShieldAlert, Sparkles, Send } from "lucide-react";
import axios from "axios";
import { addToast } from "@/redux/slices/uiSlice";
import { fetchLectures } from "@/redux/slices/lectureSlice";

export default function SubstitutionFinder({ lecture, onClose }) {
    const [substitutes, setSubstitutes] = useState([]);
    const [selectedSub, setSelectedSub] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSubs = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                const res = await axios.get(`http://localhost:5000/api/lectures/substitutes/${lecture._id}`, config);
                setSubstitutes(res.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        if (userInfo && lecture?._id) fetchSubs();
    }, [userInfo, lecture]);

    const handleSubstitute = async () => {
        if (!selectedSub) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            // Simple update for now: just change the teacher. 
            // In a more complex system, we'd mark it as 'Substituted'
            await axios.put(`http://localhost:5000/api/lectures/${lecture._id}`, { teacher: selectedSub }, config);
            dispatch(addToast({ type: 'success', message: 'Teacher substituted successfully!' }));
            dispatch(fetchLectures()); // Refresh global list
            onClose();
        } catch (error) {
            dispatch(addToast({ type: 'error', message: error.response?.data?.message || 'Substitution failed' }));
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500 italic">Analyzing teacher availability...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-400">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Smart Substitution</h2>
                    <p className="text-slate-500 text-sm">Finding replacements for {lecture.title}</p>
                </div>
            </div>

            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-center mb-4">
                <ShieldAlert className="w-4 h-4 text-orange-400 mr-3" />
                <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
                    AI logic ensures these teachers have <b>NO CONFLICTS</b> and belong to the same <b>DEPARTMENT</b>.
                </p>
            </div>

            <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {substitutes.map(sub => (
                    <div
                        key={sub._id}
                        onClick={() => setSelectedSub(sub._id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedSub === sub._id ? 'bg-orange-500/10 border-orange-500/40' : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
                            }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedSub === sub._id ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-700 text-slate-400'
                                }`}>
                                {sub.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{sub.name}</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{sub.email.split('@')[0]}</p>
                            </div>
                        </div>
                        {selectedSub === sub._id && <UserCheck className="w-5 h-5 text-orange-500" />}
                    </div>
                ))}

                {substitutes.length === 0 && (
                    <div className="text-center py-10 text-slate-600 italic text-sm">
                        No available teachers found in this department for this slot.
                    </div>
                )}
            </div>

            <button
                disabled={!selectedSub}
                onClick={handleSubstitute}
                className={`w-full py-4 font-black rounded-2xl transition-all flex items-center justify-center space-x-2 ${selectedSub ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-xl shadow-orange-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
            >
                <Send className="w-4 h-4" />
                <span>Confirm Substitution</span>
            </button>
        </div>
    );
}
