"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    Settings,
    LogOut,
    Menu,
    X,
    Bell
} from "lucide-react";
import { logout } from "@/redux/slices/authSlice";
import { toggleSidebar } from "@/redux/slices/uiSlice";
import ModalManager from "@/components/Dashboard/ModalManager";

export default function DashboardLayout({ children }) {
    const { userInfo } = useSelector((state) => state.auth);
    const { isSidebarOpen } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!userInfo) {
            router.push("/login");
        }
    }, [userInfo, router]);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    if (!userInfo) return null;

    const menuItems = [
        { name: "Overview", icon: <LayoutDashboard />, path: "/dashboard", roles: ["admin", "teacher", "student"] },
        { name: "Lectures", icon: <Calendar />, path: "/dashboard/lectures", roles: ["admin", "teacher", "student"] },
        { name: "Users", icon: <Users />, path: "/dashboard/users", roles: ["admin"] },
        { name: "Curriculum", icon: <BookOpen />, path: "/dashboard/curriculum", roles: ["admin", "teacher"] },
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
                        className="fixed lg:relative z-50 w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col pt-8 shrink-0"
                    >
                        <div className="px-6 mb-10 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-teal-500 rounded-lg shadow-lg shadow-teal-500/20">
                                    <Calendar className="text-white w-6 h-6" />
                                </div>
                                <span className="text-xl font-bold text-white">EduSync</span>
                            </div>
                            <button onClick={() => dispatch(toggleSidebar())} className="lg:hidden text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                            {menuItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => router.push(item.path)}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-all text-slate-300 hover:text-white group"
                                >
                                    <span className="group-hover:text-teal-400 transition-colors">{item.icon}</span>
                                    <span className="font-medium">{item.name}</span>
                                </button>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-slate-800">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all font-medium"
                            >
                                <LogOut className="w-5 h-5" />
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
                        <button className="relative p-2 text-slate-400 hover:text-white transition-all">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-teal-500 rounded-full border-2 border-slate-950"></span>
                        </button>
                        <div className="flex items-center space-x-3 pl-6 border-l border-slate-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white mb-0 leading-none">{userInfo.name}</p>
                                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{userInfo.role}</p>
                            </div>
                            <div className="w-10 h-10 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center font-bold text-teal-400">
                                {userInfo.name[0].toUpperCase()}
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
