"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search, UserPlus, Users, BookOpen, UserCircle,
    MoreVertical, Mail, Hash, ShieldCheck, GraduationCap, ArrowUpRight
} from "lucide-react";
import axios from "axios";
import { setActiveModal, addToast } from "@/redux/slices/uiSlice";

export default function UsersDirectoryPage() {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("students");
    const [searchTerm, setSearchTerm] = useState("");

    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

                const [studentsRes, teachersRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/students`, config),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/teachers`, config)
                ]);

                setStudents(studentsRes.data);
                setTeachers(teachersRes.data);
            } catch (err) {
                dispatch(addToast({ type: 'error', message: 'Failed to sync directory.' }));
            } finally {
                setLoading(false);
            }
        };

        if (userInfo) {
            fetchUsers();
        }
    }, [userInfo, dispatch]);

    const activeList = activeTab === "students" ? students : teachers;
    const filteredUsers = activeList.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.batch?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.department || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (userInfo?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="text-center space-y-4">
                    <ShieldCheck className="w-16 h-16 text-slate-700 mx-auto" />
                    <p className="text-slate-400 font-bold tracking-widest uppercase">Admin clearance required</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight">Access Directory</h1>
                    <p className="text-slate-400 mt-1">Manage accounts, roles, and institutional mappings.</p>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => dispatch(setActiveModal('manageUsers'))}
                        className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-slate-950 rounded-xl text-sm font-black transition-all shadow-lg shadow-blue-500/20 flex items-center"
                    >
                        <UserPlus className="w-4 h-4 mr-2" /> Enroll User / Bulk
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Students</p>
                        <p className="text-3xl font-black text-white mt-1">{loading ? '...' : students.length}</p>
                    </div>
                    <div className="p-3 bg-teal-500/10 rounded-xl"><GraduationCap className="text-teal-400 w-6 h-6" /></div>
                </div>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Faculty</p>
                        <p className="text-3xl font-black text-white mt-1">{loading ? '...' : teachers.length}</p>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-xl"><Users className="text-purple-400 w-6 h-6" /></div>
                </div>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Nodes</p>
                        <p className="text-3xl font-black text-white mt-1">1</p>
                    </div>
                    <div className="p-3 bg-rose-500/10 rounded-xl"><ShieldCheck className="text-rose-400 w-6 h-6" /></div>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between">
                <div className="flex space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('students')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Students
                    </button>
                    <button
                        onClick={() => setActiveTab('teachers')}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'teachers' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Faculty
                    </button>
                </div>

                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text" placeholder={`Search ${activeTab}...`}
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Data Grid */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 p-4 border-b border-slate-800 bg-slate-800/30 text-xs font-black text-slate-500 uppercase tracking-widest">
                    <div>Identity</div>
                    <div>Contact Vector</div>
                    <div>{activeTab === 'students' ? 'Batch Assignment' : 'Department'}</div>
                    <div>{activeTab === 'students' ? 'Status' : 'Subjects'}</div>
                    <div className="text-center">Actions</div>
                </div>

                <div className="divide-y divide-slate-800/50 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {loading ? (
                        <div className="p-12 text-center text-slate-500 italic">Syncing directory nodes...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 italic">No matching identities found.</div>
                    ) : (
                        <AnimatePresence>
                            {filteredUsers.map((user, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    key={user._id}
                                    className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] gap-4 p-4 items-center hover:bg-slate-800/20 transition-colors group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${activeTab === 'students' ? 'bg-teal-500/20 text-teal-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-white flex items-center">
                                                {user.name}
                                                {user.isMentor && <ShieldCheck className="w-3.5 h-3.5 text-blue-400 ml-2" title="Mentor Priveleges Active" />}
                                            </p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">ID: {user._id.substring(user._id.length - 6)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 text-slate-400 group-hover:text-slate-300 transition-colors">
                                        <Mail className="w-3.5 h-3.5" />
                                        <span className="text-xs truncate">{user.email}</span>
                                    </div>
                                    <div>
                                        {activeTab === 'students' ? (
                                            <div className="flex items-center space-x-2">
                                                <Hash className="w-3.5 h-3.5 text-slate-500" />
                                                <span className="text-xs font-bold text-teal-400/80">{user.batch?.name || 'Unassigned'}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-bold text-purple-400/80">{user.department || 'General'}</span>
                                        )}
                                    </div>
                                    <div>
                                        {activeTab === 'students' ? (
                                            <span className="px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-md text-[10px] font-black uppercase tracking-wider inline-flex items-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></div>
                                                Active
                                            </span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {(user.subjects || []).slice(0, 2).map((sub, idx) => (
                                                    <span key={idx} className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] uppercase font-bold truncate max-w-[80px]">
                                                        {sub}
                                                    </span>
                                                ))}
                                                {user.subjects?.length > 2 && (
                                                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-500 rounded text-[9px] font-bold">
                                                        +{user.subjects.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end pr-2">
                                        <button className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors group-hover:border-slate-600 border border-transparent">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
}
