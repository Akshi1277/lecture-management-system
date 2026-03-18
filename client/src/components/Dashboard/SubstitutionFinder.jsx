"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Users, UserCheck, ShieldAlert, Sparkles, Send } from "lucide-react";
import { fetchSubstitutes, substituteTeacher, fetchLectures } from "@/redux/slices/lectureSlice";
import { addToast } from "@/redux/slices/uiSlice";

export default function SubstitutionFinder({ lecture, onClose }) {
    const { substitutes, loading } = useSelector((state) => state.lecture);
    const [selectedSub, setSelectedSub] = useState(null);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userInfo && lecture?._id) {
            dispatch(fetchSubstitutes(lecture._id));
        }
    }, [userInfo, lecture, dispatch]);

    const handleSubstitute = async () => {
        if (!selectedSub) return;
        const resultAction = await dispatch(substituteTeacher({ lectureId: lecture._id, teacherId: selectedSub }));
        if (substituteTeacher.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: 'Teacher substituted successfully!' }));
            dispatch(fetchLectures()); // Refresh list
            onClose();
        } else {
            dispatch(addToast({ type: 'error', message: resultAction.payload || 'Substitution failed' }));
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

            <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-xl flex items-center mb-4">
                <ShieldAlert className="w-4 h-4 text-teal-400 mr-3" />
                <p className="text-[10px] text-slate-400 uppercase tracking-widest leading-relaxed">
                    AI logic ensures these teachers have <b>NO CONFLICTS</b> and matches their <b>SUBJECT SPECIALTIES</b>.
                </p>
            </div>

            <div className="space-y-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {substitutes.map(sub => (
                    <div
                        key={sub._id}
                        onClick={() => setSelectedSub(sub._id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${selectedSub === sub._id ? 'bg-teal-500/10 border-teal-500/40' : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
                            }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selectedSub === sub._id ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-700 text-slate-400'
                                }`}>
                                {sub.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{sub.name}</h4>
                                <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest">{sub.subjects?.join(', ') || 'General'}</p>
                            </div>
                        </div>
                        {selectedSub === sub._id && <UserCheck className="w-5 h-5 text-teal-500" />}
                    </div>
                ))}

                {substitutes.length === 0 && (
                    <div className="text-center py-10 text-slate-600 italic text-sm">
                        No available teachers found for this slot.
                    </div>
                )}
            </div>

            <button
                disabled={!selectedSub}
                onClick={handleSubstitute}
                className={`w-full py-4 font-black rounded-2xl transition-all flex items-center justify-center space-x-2 ${selectedSub ? 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-xl shadow-teal-500/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
            >
                <Send className="w-4 h-4" />
                <span>Confirm Substitution</span>
            </button>
        </div>
    );
}
