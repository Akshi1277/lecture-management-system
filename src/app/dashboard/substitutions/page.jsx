"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    UserMinus, CalendarDays, Clock, ShieldAlert,
    UserCheck, AlertCircle, RefreshCcw
} from "lucide-react";
import axios from "axios";
import { addToast, setActiveModal } from "@/redux/slices/uiSlice";
import { fetchLectures } from "@/redux/slices/lectureSlice";

export default function SubstitutionsPage() {
    const { userInfo } = useSelector((state) => state.auth);
    const { list: allLectures } = useSelector((state) => state.lecture);
    const dispatch = useDispatch();

    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingSubstitutions = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}`;
            
            if (userInfo?.role === 'admin') {
                const { data } = await axios.get(`${apiUrl}/lectures/substitutions/pending`, config);
                setPendingRequests(data);
            } else if (userInfo?.role === 'teacher') {
                // Fetch teacher's own lectures that are scheduled
                const { data } = await axios.get(`${apiUrl}/lectures/my`, config);
                setPendingRequests(data.filter(l => l.status === 'Scheduled'));
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', message: 'Failed to fetch substitution data.' }));
        } finally {
            setLoading(false);
        }
    };

    // We also refetch whenever global lectures change 
    // to keep the list synced if someone assigns a sub from elsewhere
    useEffect(() => {
        if (userInfo) {
            fetchPendingSubstitutions();
        }
    }, [userInfo, allLectures]);

    const handleTeacherRequest = async (lectureId) => {
        const reason = window.prompt("Reason for substitution request?");
        if (!reason) return;
        
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/lectures/${lectureId}/request-substitution`, { reason }, config);
            dispatch(addToast({ type: 'success', message: 'Substitution request sent to admin.' }));
            fetchPendingSubstitutions();
        } catch (err) {
            dispatch(addToast({ type: 'error', message: 'Failed to send request.' }));
        }
    };

    if (userInfo?.role === 'student') {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="text-center space-y-4">
                    <UserMinus className="w-16 h-16 text-slate-700 mx-auto" />
                    <p className="text-slate-400 font-bold tracking-widest uppercase">No substitution access for students</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight">
                        {userInfo?.role === 'admin' ? "Proxy Management" : "Substitution Hub"}
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {userInfo?.role === 'admin' 
                            ? "Resolve emergency faculty leaves and maintain continuous scheduling."
                            : "Manage your presence and request departmental coverage for your lectures."}
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchPendingSubstitutions}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-black transition-all border border-slate-700 flex items-center shadow-xl shadow-slate-950/20"
                    >
                        <RefreshCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh Feed
                    </button>
                </div>
            </div>

            {/* Emergency Ribbon */}
            {pendingRequests.length > 0 && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-orange-500/20 rounded-full">
                            <AlertCircle className="text-orange-400 w-6 h-6 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="font-bold text-orange-400">
                                {userInfo?.role === 'admin' ? "Critical Action Required" : "System Notification"}
                            </h3>
                            <p className="text-xs text-orange-500/80 mt-0.5">
                                {userInfo?.role === 'admin' 
                                    ? `There are ${pendingRequests.length} unmanned lectures in the system requiring immediate proxy assignment.`
                                    : `You have ${pendingRequests.filter(p => !p.isSubstitutionRequested).length} upcoming sessions. Request a proxy if you are unavailable.`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {loading && pendingRequests.length === 0 ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-slate-500 italic text-sm">Scanning for unattended nodes...</p>
                        </div>
                    ) : pendingRequests.length === 0 ? (
                        <div className="col-span-full py-20 text-center flex flex-col items-center">
                            <div className="p-5 bg-teal-500/10 rounded-full mb-4">
                                <ShieldAlert className="w-10 h-10 text-teal-500" />
                            </div>
                            <p className="text-white font-bold text-xl">All Clear</p>
                            <p className="text-slate-500 text-sm mt-1">No emergency substitutions required at this time.</p>
                        </div>
                    ) : (
                        pendingRequests.map((req, i) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                key={req._id}
                                className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden hover:border-slate-700 transition-colors shadow-xl"
                            >
                                <div className="p-6 bg-slate-800/20 border-b border-slate-800 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="px-2.5 py-1 bg-rose-500/10 text-rose-400 rounded-md text-[10px] font-black uppercase tracking-wider mb-3 inline-block">
                                                Proxy Requested
                                            </span>
                                            <h3 className="font-bold text-lg text-white leading-tight">{req.title}</h3>
                                            <p className="text-xs text-slate-400 mt-1">{req.course?.code || req.subject} • {req.batch?.name}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-black text-slate-400 shrink-0 border border-slate-700">
                                            {req.teacher?.name?.charAt(0)}
                                        </div>
                                    </div>

                                    <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center">
                                            <AlertCircle className="w-3 h-3 mr-1 text-orange-400" /> Original Faculty
                                        </p>
                                        <p className="text-sm font-bold text-slate-300">{req.teacher?.name}</p>
                                        <p className="text-xs text-slate-500 mt-1 italic border-l-2 border-slate-700 pl-2">
                                            {req.substitutionReason || "Emergency Leave / Unavailable"}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Time Window</p>
                                            <p className="text-slate-300 font-bold flex items-center">
                                                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                                                {new Date(req.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5 ml-4.5">
                                                {new Date(req.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">Venue</p>
                                            <p className="text-teal-400 font-bold flex items-center">
                                                <CalendarDays className="w-3.5 h-3.5 mr-1" />
                                                {req.classroom}
                                            </p>
                                        </div>
                                    </div>

                                    {userInfo?.role === 'admin' ? (
                                        <button 
                                            onClick={() => dispatch(setActiveModal({ type: 'findSubstitute', data: req }))}
                                            className="w-full py-3 bg-orange-500 hover:bg-orange-400 text-slate-950 text-sm font-black rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] flex items-center justify-center"
                                        >
                                            <UserCheck className="w-4 h-4 mr-2" />
                                            Assign AI Proxy
                                        </button>
                                    ) : (
                                        <button 
                                            disabled={req.isSubstitutionRequested}
                                            onClick={() => handleTeacherRequest(req._id)}
                                            className={`w-full py-3 ${req.isSubstitutionRequested ? 'bg-slate-800 text-slate-500 border border-slate-700' : 'bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/20'} text-sm font-black rounded-xl transition-all active:scale-[0.98] flex items-center justify-center`}
                                        >
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            {req.isSubstitutionRequested ? "Substitution Pending" : "Request Departmental Proxy"}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
