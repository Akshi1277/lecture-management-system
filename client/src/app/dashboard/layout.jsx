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

export default function DashboardLayout({ children }) {
    const { userInfo } = useSelector((state) => state.auth);
    const { isSidebarOpen } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const isFullPage = pathname === "/dashboard/admin/schedule";

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (hasMounted && !userInfo) {
            router.push("/login");
        }
    }, [userInfo, router, hasMounted]);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    if (!hasMounted || !userInfo) return null;

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
                                onClick={handleLogout}
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
                            <div className="w-10 h-10 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center font-bold text-teal-400">
                                {userInfo?.name ? userInfo.name[0].toUpperCase() : userInfo?.email ? userInfo.email[0].toUpperCase() : '?'}
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
        </div>
    );
}
