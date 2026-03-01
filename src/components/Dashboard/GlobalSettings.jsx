"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Shield, Clock, Bell, Percent } from "lucide-react";

export default function GlobalSettings({ onClose }) {
    const [settings, setSettings] = useState({
        attendanceThreshold: 75,
        lectureDuration: 60,
        enableNotifications: true,
        academicYear: "2025-2026"
    });

    const handleSave = () => {
        // Here we would sync with backend
        onClose();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-teal-500 rounded-2xl shadow-lg shadow-teal-500/20">
                    <Shield className="text-white w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white italic">Global Settings</h2>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">System-wide configurations</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Percent className="text-teal-400 w-5 h-5" />
                            <span className="text-sm font-bold text-slate-300">Attendance Threshold</span>
                        </div>
                        <input
                            type="number"
                            className="w-20 bg-slate-800 border border-slate-700 rounded-xl p-2 text-center text-white outline-none focus:ring-1 focus:ring-teal-500"
                            value={settings.attendanceThreshold}
                            onChange={(e) => setSettings({ ...settings, attendanceThreshold: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Clock className="text-blue-400 w-5 h-5" />
                            <span className="text-sm font-bold text-slate-300">Lecture Duration (min)</span>
                        </div>
                        <input
                            type="number"
                            className="w-20 bg-slate-800 border border-slate-700 rounded-xl p-2 text-center text-white outline-none focus:ring-1 focus:ring-blue-500"
                            value={settings.lectureDuration}
                            onChange={(e) => setSettings({ ...settings, lectureDuration: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Bell className="text-purple-400 w-5 h-5" />
                            <span className="text-sm font-bold text-slate-300">System Notifications</span>
                        </div>
                        <button
                            onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                            className={`w-12 h-6 rounded-full relative transition-colors ${settings.enableNotifications ? 'bg-teal-500' : 'bg-slate-700'}`}
                        >
                            <motion.div
                                animate={{ x: settings.enableNotifications ? 24 : 4 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                            />
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
                >
                    <Save className="w-5 h-5" />
                    <span>Apply Configurations</span>
                </button>
            </div>
        </div>
    );
}
