"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { 
    BookOpen, Search, Download, FileText, 
    ExternalLink, Filter, FolderKanban, Clock, Trash2
} from "lucide-react";
import { fetchLectures, deleteResource } from "@/redux/slices/lectureSlice";
import { addToast } from "@/redux/slices/uiSlice";

export default function ResourcesPage() {
    const { userInfo } = useSelector((state) => state.auth);
    const { list: lectures, loading } = useSelector((state) => state.lecture);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(fetchLectures());
    }, [dispatch]);

    // Flatten all resources from all lectures
    const allResources = lectures.reduce((acc, lecture) => {
        if (lecture.resources && lecture.resources.length > 0) {
            const resourcesWithMeta = lecture.resources.map(r => ({
                ...r,
                lectureId: lecture._id,
                resourceId: r._id,
                subject: lecture.subject,
                course: lecture.course?.name || lecture.subject,
                teacher: lecture.teacher?.name,
                teacherId: lecture.teacher?._id || lecture.teacher,
                date: r.createdAt || lecture.createdAt,
                lectureTitle: lecture.title
            }));
            return [...acc, ...resourcesWithMeta];
        }
        return acc;
    }, []);

    const filteredResources = allResources.filter(res => 
        (res.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (res.subject?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (res.teacher?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (lectureId, resourceId) => {
        if (window.confirm("Are you sure you want to remove this academic resource? This action cannot be undone.")) {
            const resultAction = await dispatch(deleteResource({ lectureId, resourceId }));
            if (deleteResource.fulfilled.match(resultAction)) {
                dispatch(addToast({ type: 'success', message: 'Resource permanently removed from the vault.' }));
            } else {
                dispatch(addToast({ type: 'error', message: resultAction.payload || 'Failed to delete resource' }));
            }
        }
    };

    // Grouping by Subject for a more organized view
    const groupedBySubject = filteredResources.reduce((acc, res) => {
        const key = res.subject || 'Uncategorized';
        if (!acc[key]) acc[key] = [];
        acc[key].push(res);
        return acc;
    }, {});

    return (
        <div className="space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">Resource Library</h1>
                    <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-widest">Academic Vault & Shared Assets</p>
                </div>
                
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                        type="text"
                        placeholder="Search by topic, subject, or faculty..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center animate-pulse">
                    <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full mx-auto mb-4 animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Decrypting Library Access...</p>
                </div>
            ) : allResources.length === 0 ? (
                <div className="py-32 text-center bg-slate-900/50 border border-slate-800 rounded-[40px] border-dashed">
                    <FolderKanban className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-400">The vault is currently empty.</h3>
                    <p className="text-slate-600 text-sm mt-1">Teachers haven't shared any resources for your batch yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-12">
                    {Object.entries(groupedBySubject).map(([subject, resources], idx) => (
                        <motion.section 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={subject}
                            className="space-y-6"
                        >
                            <div className="flex items-center space-x-4">
                                <span className="h-px flex-1 bg-slate-800" />
                                <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] px-4">{subject}</h2>
                                <span className="h-px flex-1 bg-slate-800" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {resources.map((res, ridx) => (
                                    <motion.div 
                                        whileHover={{ y: -5 }}
                                        key={ridx}
                                        className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 group hover:border-teal-500/30 transition-all shadow-xl shadow-black/20"
                                    >
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`p-4 rounded-2xl border text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all ${res.type === 'Link' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 group-hover:bg-orange-500' : 'bg-slate-950 border-slate-800'}`}>
                                                <FileText className="w-6 h-6" />
                                            </div>

                                            {/* Context-aware top-right button */}
                                            <div className="flex items-center space-x-2">
                                                {res.type === 'Link' ? (
                                                    <a
                                                        href={res.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-orange-400 transition-colors border border-slate-800"
                                                        title="Open Link"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                ) : (
                                                    <a
                                                        href={`https://docs.google.com/viewer?url=${encodeURIComponent(res.url)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-teal-400 transition-colors border border-slate-800"
                                                        title="View in Browser"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                    </a>
                                                )}

                                                {(userInfo?.role === 'admin' || userInfo?._id === res.teacherId) && (
                                                    <button
                                                        onClick={() => handleDelete(res.lectureId, res.resourceId)}
                                                        className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-red-400 transition-colors border border-slate-800"
                                                        title="Delete Resource"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-lg font-black text-white leading-tight mb-1 group-hover:text-teal-400 transition-colors uppercase italic">{res.name}</h3>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mb-3 inline-block ${res.type === 'Link' ? 'bg-orange-500/10 text-orange-400' : 'bg-teal-500/10 text-teal-400'}`}>
                                            {res.type || 'File'}
                                        </span>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-6">Shared by {res.teacher}</p>
                                        
                                        <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center space-x-2 text-[10px] text-slate-600 font-black uppercase">
                                                <Clock className="w-3 h-3" />
                                                <span>{new Date(res.date).toLocaleDateString()}</span>
                                            </div>
                                            {/* Download only shown for actual files, not links */}
                                            {res.type !== 'Link' && (
                                                <a 
                                                    href={res.url} 
                                                    download 
                                                    className="text-[10px] font-black text-teal-500 uppercase tracking-widest hover:underline flex items-center"
                                                >
                                                    Download <Download className="w-3 h-3 ml-2" />
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>
            )}
        </div>
    );
}
