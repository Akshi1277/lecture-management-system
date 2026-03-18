"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Shield, Clock, User, Activity, Search, Filter, Terminal, ChevronRight } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function AuditLogViewer() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/audit`, config);
                setLogs(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (userInfo) fetchLogs();
    }, [userInfo]);

    const filteredLogs = logs.filter(log => {
        const search = filter.toLowerCase();
        const details = (log.details?.toString() || "").toLowerCase();
        const action = (log.action?.toString() || "").toLowerCase();
        const userName = (log.user?.name?.toString() || "").toLowerCase();

        return details.includes(search) || action.includes(search) || userName.includes(search);
    });

    const getActionColor = (action) => {
        if (action.includes('CREATE')) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (action.includes('UPDATE')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        if (action.includes('DELETE')) return 'text-red-400 bg-red-500/10 border-red-500/20';
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-teal-500 rounded-2xl shadow-lg shadow-teal-500/20 text-slate-950">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white italic">Security Audit</h2>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Immutable system activity logs</p>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                        type="text"
                        placeholder="Filter activity..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs text-white outline-none focus:ring-2 focus:ring-teal-500 w-64"
                    />
                </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-20 text-center animate-pulse">
                            <Terminal className="w-10 h-10 text-teal-400 mx-auto mb-4" />
                            <p className="text-sm font-black text-slate-500 uppercase italic">Decrypting system integrity logs...</p>
                        </div>
                    ) : filteredLogs.length > 0 ? (
                        <div className="divide-y divide-slate-800">
                            {filteredLogs.map((log, i) => (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    key={log._id} 
                                    className="p-4 hover:bg-slate-900/40 transition-colors group"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4">
                                            <div className="mt-1">
                                                <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border ${getActionColor(log.action)}`}>
                                                    {log.action}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-200">
                                                    {typeof log.details === 'object' && log.details !== null ? (
                                                        <span className="text-xs font-mono text-teal-400/80">
                                                            {Object.entries(log.details).map(([key, value]) => `${key}: ${value}`).join(' | ')}
                                                        </span>
                                                    ) : (
                                                        log.details
                                                    )}
                                                </p>
                                                <div className="flex items-center space-x-3 mt-1.5">
                                                    <span className="flex items-center text-[10px] text-slate-500 font-bold">
                                                        <User className="w-3 h-3 mr-1 text-teal-500" /> {log.user?.name || 'System'}
                                                    </span>
                                                    <span className="flex items-center text-[10px] text-slate-500 font-bold">
                                                        <Clock className="w-3 h-3 mr-1 text-blue-500" /> {new Date(log.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-800 group-hover:text-slate-600 transition-colors" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <Terminal className="w-10 h-10 text-slate-800 mx-auto mb-4" />
                            <p className="text-sm font-black text-slate-600 uppercase">No logs matching your credentials found.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span>Real-time Monitoring Active</span>
                </div>
                <div className="text-[10px] text-slate-600 font-black italic">
                    Showing latest 100 system events
                </div>
            </div>
        </div>
    );
}
