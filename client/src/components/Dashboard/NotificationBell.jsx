"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Clock, Megaphone, CheckCircle2, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications, markAllAsRead, addNotification } from "@/redux/slices/notificationSlice";
import { io } from "socket.io-client";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();
    const { items, unreadCount } = useSelector((state) => state.notifications);
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchNotifications());

            const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 
                             (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : "http://localhost:5000");
            const socket = io(socketUrl);
            
            socket.on('new_announcement', (data) => {
                // Check if target is relevant for current user role/batch
                const isRelevant = 
                    data.targetAudience === 'all' || 
                    (userInfo.role === 'student' && (data.targetAudience === 'students' && (!data.targetBatch || data.targetBatch === userInfo.batch))) ||
                    (userInfo.role === 'teacher' && data.targetAudience === 'teachers') ||
                    userInfo.role === 'admin';

                if (isRelevant) {
                    dispatch(addNotification({
                        ...data,
                        createdAt: new Date().toISOString()
                    }));
                }
            });

            return () => socket.disconnect();
        }
    }, [dispatch, userInfo]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            dispatch(markAllAsRead());
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-400 bg-red-400/10';
            case 'medium': return 'text-amber-400 bg-amber-400/10';
            default: return 'text-teal-400 bg-teal-400/10';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={toggleDropdown}
                className={`relative p-2.5 rounded-xl transition-all duration-300 ${isOpen ? 'bg-slate-800 text-teal-400 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-3 h-3 bg-teal-500 rounded-full border-2 border-slate-950 shadow-lg"
                    />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-[380px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-[100] overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md">
                            <div className="flex items-center space-x-3">
                                <Megaphone className="w-5 h-5 text-teal-400" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Global Broadcasts</h3>
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded-lg">
                                {items.length} TOTAL
                            </span>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2">
                            {items.length > 0 ? (
                                items.map((item, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        key={idx}
                                        className="p-4 rounded-2xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50 group mb-1"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div className={`mt-1 p-2 rounded-lg shrink-0 ${getPriorityColor(item.priority)}`}>
                                                {item.priority === 'high' ? <BellOff size={16} /> : <Megaphone size={16} />}
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-bold text-white leading-none">{item.title}</h4>
                                                    <div className="flex items-center text-[10px] text-slate-500 font-medium">
                                                        <Clock size={10} className="mr-1" />
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                                    {item.content}
                                                </p>
                                                <div className="flex items-center space-x-2 pt-1">
                                                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-tighter">
                                                        BY {item.author?.name || 'SYSTEM ADMIN'}
                                                    </span>
                                                    <div className="w-1 h-1 bg-slate-700 rounded-full" />
                                                    <span className={`text-[9px] font-black uppercase tracking-tighter ${item.priority === 'high' ? 'text-red-400' : 'text-teal-400'}`}>
                                                        {item.priority} PRIORITY
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 className="w-8 h-8 text-slate-600" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest italic">All clear for now</p>
                                </div>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 text-center">
                                <button className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">
                                    View Archived Notices
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
