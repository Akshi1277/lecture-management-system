"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    Settings,
    LogOut,
    X,
    Bell,
    CheckSquare,
    UserMinus,
    BarChart3,
    Megaphone,
    Menu
} from "lucide-react";
import { logout } from "@/redux/slices/authSlice";
import { toggleSidebar } from "@/redux/slices/uiSlice";
import ModalManager from "@/components/Dashboard/ModalManager";
import NotificationBell from "@/components/Dashboard/NotificationBell";
import api from "@/redux/api";

export default function DashboardLayout({ children }) {
    const { userInfo } = useSelector((state) => state.auth);
    const { isSidebarOpen } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const isFullPage = pathname === "/dashboard/admin/schedule";

    const [hasMounted, setHasMounted] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        setHasMounted(true);
        // Wake up server in background if not already awake
        api.get('/users/ping').catch(() => {});
    }, []);

    useEffect(() => {
        if (hasMounted && !userInfo) {
            router.replace("/login");
        }
    }, [userInfo, router, hasMounted]);

    const handleLogout = () => {
        dispatch(logout());
        router.replace("/login");
        setShowLogoutConfirm(false);
    };

    if (!hasMounted || !userInfo) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 font-black uppercase tracking-widest text-[10px]">
                Initializing Auth Protocol...
            </div>
        );
    }

    // Direct return for full-screen pages like the scheduler
    if (isFullPage) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-200">
                {children}
                <ModalManager />
            </div>
        );
    }

    const menuItems = [
        { name: "Overview", icon: <LayoutDashboard />, path: "/dashboard", roles: ["admin", "teacher", "student"] },
        { 
            name: userInfo.role === "student" ? "My Timetable" : "Lectures", 
            icon: <Calendar />, 
            path: "/dashboard/lectures", 
            roles: ["admin", "teacher", "student"] 
        },
        { name: "Users", icon: <Users />, path: "/dashboard/users", roles: ["admin"] },
        { 
            name: userInfo.role === "student" ? "Presence Report" : "Attendance", 
            icon: <CheckSquare />, 
            path: "/dashboard/attendance", 
            roles: ["admin", "teacher", "student"] 
        },
        { name: "Substitutions", icon: <UserMinus />, path: "/dashboard/substitutions", roles: ["admin", "teacher"] },
        { name: "Notice Board", icon: <Megaphone />, path: "/dashboard/notices", roles: ["admin", "teacher", "student"] },
        { name: "Resources", icon: <BookOpen />, path: "/dashboard/resources", roles: ["admin", "teacher", "student"] },
        { name: "Reports", icon: <BarChart3 />, path: "/dashboard/reports", roles: ["admin"] },
        { name: "Settings", icon: <Settings />, path: "/dashboard/settings", roles: ["admin", "teacher", "student"] },
    ].filter(item => item.roles.includes(userInfo.role));

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex overflow-hidden">
            {/* Sidebar */}
            <AnimatePresence mode="wait">
                {isSidebarOpen && (
                    <motion.aside
                        initial={{ x: -260 }}
                        animate={{ x: 0 }}
                        exit={{ x: -260 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="fixed lg:relative z-50 w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col pt-8 shrink-0"
                    >
                        <div className="px-6 mb-8 flex items-center justify-between shrink-0">
                            <div className="flex items-center space-x-3">
                                <img src="/logo.png" alt="EduSync Logo" className="w-10 h-10 rounded-xl shadow-lg shadow-teal-500/20" />
                                <span className="text-lg font-bold text-white tracking-tight">EduSync</span>
                            </div>
                            <button onClick={() => dispatch(toggleSidebar())} className="lg:hidden text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar pr-1">
                            {menuItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => router.push(item.path)}
                                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all group ${pathname === item.path ? 'bg-slate-800 text-white border border-slate-700/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                                >
                                    <span className={`${pathname === item.path ? 'text-teal-400' : 'text-slate-500 group-hover:text-teal-400'} transition-colors`}>{item.icon}</span>
                                    <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                                </button>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-slate-800 mt-auto shrink-0 bg-slate-900/50 backdrop-blur-md">
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-bold text-sm"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Navbar */}
                <header className="h-20 bg-slate-950 border-b border-slate-900 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center space-x-4">
                        {!isSidebarOpen && (
                            <button onClick={() => dispatch(toggleSidebar())} className="p-2 hover:bg-slate-800 rounded-lg transition-all">
                                <Menu className="w-6 h-6" />
                            </button>
                        )}
                        <h2 className="text-xl font-semibold text-white">Dashboard</h2>
                    </div>

                    <div className="flex items-center space-x-6">
                        <NotificationBell />
                        <div className="flex items-center space-x-3 pl-6 border-l border-slate-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white mb-0 leading-none">{userInfo.name}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{userInfo.role}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center font-bold text-teal-400 overflow-hidden shrink-0">
                                {userInfo?.profileImage ? (
                                    <img 
                                        src={userInfo.profileImage} 
                                        alt={userInfo.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>
                                        {userInfo?.name ? userInfo.name[0].toUpperCase() : userInfo?.email ? userInfo.email[0].toUpperCase() : '?'}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Area */}
                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    {children}
                    <ModalManager />
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl text-center space-y-6"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                                <LogOut className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white italic tracking-tight uppercase">End Session?</h3>
                                <p className="text-slate-500 text-sm mt-1">You are about to be redirected to the login portal.</p>
                            </div>
                            <div className="flex flex-col space-y-3">
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 transition-all uppercase tracking-widest text-xs"
                                >
                                    Logout Now
                                </button>
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="w-full py-4 bg-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-700 transition-all uppercase tracking-widest text-xs"
                                >
                                    Stay Logged In
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
