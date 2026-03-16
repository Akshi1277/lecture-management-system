"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Settings, ShieldCheck, User, Key, Bell, Clock,
    Database, Sliders, Globe, Server, ChevronRight,
    Save, Mail, Percent, Loader2
} from "lucide-react";
import { setActiveModal, addToast } from "@/redux/slices/uiSlice";
import axios from "axios";

export default function SettingsPage() {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("profile");
    
    // Global Settings State
    const [globalSettings, setGlobalSettings] = useState({
        attendanceThreshold: 75,
        labWeight: 4,
        systemName: "EduSync"
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const fetchGlobalSettings = async () => {
            if (userInfo?.role !== 'admin' || !userInfo?.token) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
                const { data } = await axios.get(`${apiUrl}/settings`, config);
                if (data) {
                    setGlobalSettings({
                        attendanceThreshold: data.attendanceThreshold || 75,
                        labWeight: data.labWeight || 4,
                        systemName: data.systemName || "EduSync"
                    });
                }
            } catch (err) {
                console.error("Failed to fetch settings:", err);
            }
        };
        fetchGlobalSettings();
    }, [userInfo]);

    const handleSaveGlobalSettings = async () => {
        setIsSaving(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            await axios.put(`${apiUrl}/settings`, globalSettings, config);
            dispatch(addToast({ type: 'success', message: 'Global configurations updated successfully' }));
        } catch (err) {
            dispatch(addToast({ type: 'error', message: 'Failed to update configurations' }));
        } finally {
            setIsSaving(false);
        }
    };

    const handleSendWarnings = async () => {
        if (!window.confirm("This will send email notifications to parents of all students with low attendance. Proceed?")) return;
        
        setIsSending(true);
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const { data } = await axios.post(`${apiUrl}/attendance/send-warnings`, {}, config);
            dispatch(addToast({ type: 'success', message: data.message }));
        } catch (err) {
            dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Failed to dispatch warning emails' }));
        } finally {
            setIsSending(false);
        }
    };

    const renderTabs = () => {
        const tabs = [
            { id: 'profile', label: 'My Account', icon: <User className="w-4 h-4" /> },
            { id: 'security', label: 'Security & Auth', icon: <Key className="w-4 h-4" /> },
        ];

        if (userInfo?.role === 'admin') {
            tabs.push(
                { id: 'system', label: 'System Configuration', icon: <Sliders className="w-4 h-4" /> },
                { id: 'database', label: 'Infrastructure & Data', icon: <Database className="w-4 h-4" /> }
            );
        }

        return (
            <div className="flex flex-col space-y-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`p-4 rounded-2xl flex items-center justify-between transition-all ${activeTab === tab.id ? 'bg-slate-800 border border-slate-700 shadow-md text-white' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-300 border border-transparent'}`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-xl ${activeTab === tab.id ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-900 text-slate-500'}`}>
                                {tab.icon}
                            </div>
                            <span className="font-bold text-sm tracking-wide">{tab.label}</span>
                        </div>
                        {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-teal-400" />}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <div className="flex items-center space-x-4">
                <div className="p-4 bg-slate-800 rounded-3xl shadow-lg shadow-slate-950/20 border border-slate-700">
                    <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight">Preferences</h1>
                    <p className="text-slate-400 mt-1">Manage your account and platform parameters.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-[1fr_2.5fr] gap-8">
                {/* Sidebar Navigation */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 h-fit sticky top-8">
                    {renderTabs()}
                </div>

                {/* Content Area */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 min-h-[600px] shadow-2xl">

                    {activeTab === 'profile' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Public Profile</h3>
                                <p className="text-xs text-slate-500 mt-1 uppercase font-black tracking-widest">Global Identity</p>
                            </div>

                            <div className="flex items-center space-x-8">
                                <div className="relative group">
                                    <div className="w-28 h-28 rounded-[38px] bg-slate-800 flex items-center justify-center text-4xl font-black text-teal-400 border-2 border-slate-700 shadow-2xl shadow-teal-500/10 transition-transform group-hover:scale-105">
                                        {(userInfo?.name || '?').split(' ').map(n => n[0]).join('').substring(0, 2)}
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 p-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white">{userInfo?.name}</h4>
                                    <p className="text-sm text-slate-500">{userInfo?.email}</p>
                                    <button className="mt-4 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all border border-slate-700 uppercase tracking-widest">Update Photo</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Legal Full Name</label>
                                    <input type="text" defaultValue={userInfo?.name} className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Email Address</label>
                                    <input type="email" defaultValue={userInfo?.email} disabled className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4 text-sm text-slate-500 cursor-not-allowed outline-none" />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Department & Role</label>
                                    <div className="w-full bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4 text-sm text-slate-500 flex items-center justify-between">
                                        <span className="uppercase font-bold tracking-wider">{userInfo?.department?.length > 0 ? userInfo.department.join(', ') : 'Not Assigned'}</span>
                                        <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-teal-400 uppercase text-[9px] font-black italic">{userInfo?.role}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center tracking-tight">
                                    Authentication <ShieldCheck className="w-5 h-5 ml-2 text-emerald-500" />
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 uppercase font-black tracking-widest">Credential Logic</p>
                            </div>

                            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-8 space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Current Credentials</label>
                                    <input type="password" placeholder="••••••••" className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">New Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Confirm New Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:ring-1 focus:ring-teal-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <button className="w-full md:w-auto px-10 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-black rounded-2xl transition-all shadow-xl shadow-teal-500/20 active:scale-95 uppercase tracking-widest">
                                    Initialize Change
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">System Configuration</h3>
                                    <p className="text-xs text-slate-500 mt-1 uppercase font-black tracking-widest">Global Academic Parameters</p>
                                </div>
                                <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-2xl">
                                    <ShieldCheck className="w-6 h-6 text-teal-400" />
                                </div>
                            </div>

                            <div className="space-y-4">
                               <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-8 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 text-white">
                                                <Percent className="w-5 h-5 text-teal-400" />
                                                <span className="font-black text-sm uppercase italic">Attendance Threshold</span>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed">Required minimum percentage for students before warning triggers are activated.</p>
                                            <div className="flex items-center space-x-3">
                                                <input 
                                                    type="number" 
                                                    value={globalSettings.attendanceThreshold}
                                                    onChange={(e) => setGlobalSettings({...globalSettings, attendanceThreshold: parseInt(e.target.value)})}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black focus:ring-1 focus:ring-teal-500 outline-none" 
                                                />
                                                <span className="text-slate-500 font-bold">%</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3 text-white">
                                                <Clock className="w-5 h-5 text-blue-400" />
                                                <span className="font-black text-sm uppercase italic">Practical Session Weight</span>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed">The multiplier applied to Lab sessions relative to standard lectures (current: {globalSettings.labWeight}x).</p>
                                            <input 
                                                type="number" 
                                                value={globalSettings.labWeight}
                                                onChange={(e) => setGlobalSettings({...globalSettings, labWeight: parseInt(e.target.value)})}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-white font-black focus:ring-1 focus:ring-blue-500 outline-none" 
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-800/50 space-y-6">
                                        <div className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-red-400" />
                                            <h4 className="text-sm font-black text-white uppercase italic tracking-wide">Emergency Communication</h4>
                                        </div>
                                        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-md">
                                                Instantly dispatch warning notifications to parents of all students whose current weighted attendance is below the <strong>{globalSettings.attendanceThreshold}%</strong> threshold.
                                            </p>
                                            <button 
                                                onClick={handleSendWarnings}
                                                disabled={isSending}
                                                className="shrink-0 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl font-black uppercase text-[10px] tracking-widest disabled:opacity-50"
                                            >
                                                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Execute Dispatch"}
                                            </button>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleSaveGlobalSettings}
                                        disabled={isSaving}
                                        className="w-full py-5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl shadow-2xl shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
                                    >
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        <span>Update System Parameters</span>
                                    </button>
                               </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'database' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div>
                                <h3 className="text-xl font-bold text-white text-red-400 tracking-tight italic">Infrastructure Mapping</h3>
                                <p className="text-xs text-slate-500 mt-1 uppercase font-black tracking-widest leading-relaxed">Core architectural nodes. Modify with extreme caution.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <button
                                    onClick={() => dispatch(setActiveModal('manageBatches'))}
                                    className="p-8 bg-slate-950/50 border border-slate-800 rounded-[32px] text-left hover:border-slate-600 transition-all group relative overflow-hidden active:scale-95 shadow-xl hover:shadow-2xl"
                                >
                                    <div className="absolute top-0 right-0 p-8 text-slate-800 group-hover:text-slate-700 transition-colors">
                                        <Database className="w-16 h-16" />
                                    </div>
                                    <div className="p-4 bg-slate-900/50 rounded-2xl inline-block mb-6 group-hover:bg-slate-800 transition-colors border border-slate-800">
                                        <Database className="w-6 h-6 text-teal-400" />
                                    </div>
                                    <p className="font-black text-sm text-white uppercase italic tracking-wider">Batch Architecture</p>
                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">Configure structural nodes, divisions, and year mappings (FY, SY, TY).</p>
                                </button>
                                <button
                                    className="p-8 bg-slate-950/50 border border-slate-800 rounded-[32px] text-left hover:border-slate-600 transition-all group relative overflow-hidden active:scale-95 shadow-xl hover:shadow-2xl"
                                >
                                    <div className="absolute top-0 right-0 p-8 text-slate-800 group-hover:text-slate-700 transition-colors">
                                        <Server className="w-16 h-16" />
                                    </div>
                                    <div className="p-4 bg-slate-900/50 rounded-2xl inline-block mb-6 group-hover:bg-slate-800 transition-colors border border-slate-800">
                                        <Server className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <p className="font-black text-sm text-white uppercase italic tracking-wider">Diagnostic Logs</p>
                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">View system diagnostic telemetry and environment integrity heartbeats.</p>
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

function Camera({className}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
    )
}
