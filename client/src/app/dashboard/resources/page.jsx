"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
    BookOpen, Search, Download, FileText, 
    ExternalLink, Eye, FolderKanban, Clock, Trash2, X, AlertTriangle
} from "lucide-react";
import { fetchLectures, deleteResource } from "@/redux/slices/lectureSlice";
import { addToast } from "@/redux/slices/uiSlice";

// Returns the correct file extension from a URL
function getExtensionFromUrl(url) {
    if (!url) return 'file';
    try {
        const path = url.split('?')[0];
        const lastSegment = path.split('/').pop();
        const parts = lastSegment.split('.');
        if (parts.length > 1) return parts.pop().toLowerCase();
    } catch {}
    return 'file';
}

// Determines if a file can be previewed natively or via Google Docs
function canPreview(url, fileType) {
    const ext = getExtensionFromUrl(url);
    const previewable = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'txt'];
    if (previewable.includes(ext)) return true;
    if (fileType && (fileType.startsWith('image/') || fileType === 'application/pdf' || fileType === 'text/plain')) return true;
    return false;
}

function isImageFile(url, fileType) {
    const ext = getExtensionFromUrl(url);
    return ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext) || (fileType && fileType.startsWith('image/'));
}

export default function ResourcesPage() {
    const { userInfo } = useSelector((state) => state.auth);
    const { list: lectures, loading } = useSelector((state) => state.lecture);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");
    const [previewResource, setPreviewResource] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

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

    const handleDelete = async () => {
        if (!deleteTarget) return;
        const { lectureId, resourceId } = deleteTarget;
        const resultAction = await dispatch(deleteResource({ lectureId, resourceId }));
        if (deleteResource.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: 'Resource permanently removed from the vault.' }));
            setDeleteTarget(null);
        } else {
            dispatch(addToast({ type: 'error', message: resultAction.payload || 'Failed to delete resource' }));
            setDeleteTarget(null);
        }
    };

    const handleDownload = (res) => {
        window.open(res.url, '_blank');
    };

    // Grouping by Subject
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
                                {resources.map((res, ridx) => {
                                    const ext = getExtensionFromUrl(res.url);
                                    const previable = res.type !== 'Link' && canPreview(res.url, res.fileType);
                                    return (
                                        <motion.div 
                                            whileHover={{ y: -5 }}
                                            key={ridx}
                                            className="bg-slate-900 border border-slate-800 rounded-[32px] p-6 group hover:border-teal-500/30 transition-all shadow-xl shadow-black/20"
                                        >
                                            <div className="flex items-start justify-between mb-6">
                                                <div className={`p-4 rounded-2xl border text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all ${res.type === 'Link' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 group-hover:bg-orange-500' : 'bg-slate-950 border-slate-800'}`}>
                                                    <FileText className="w-6 h-6" />
                                                </div>

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
                                                    ) : previable ? (
                                                        <button
                                                            onClick={() => setPreviewResource(res)}
                                                            className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-teal-400 transition-colors border border-slate-800"
                                                            title="Preview"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <a
                                                            href={res.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-teal-400 transition-colors border border-slate-800"
                                                            title="Open File"
                                                        >
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    )}

                                                    {(userInfo?.role === 'admin' || userInfo?._id === res.teacherId) && (
                                                        <button
                                                            onClick={() => setDeleteTarget({ lectureId: res.lectureId, resourceId: res.resourceId, name: res.name })}
                                                            className="p-3 bg-slate-950 rounded-xl text-slate-500 hover:text-red-400 transition-colors border border-slate-800 shadow-lg"
                                                            title="Delete Resource"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-lg font-black text-white leading-tight mb-1 group-hover:text-teal-400 transition-colors uppercase italic">{res.name}</h3>
                                            <div className="flex items-center space-x-2 mb-3">
                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md inline-block ${res.type === 'Link' ? 'bg-orange-500/10 text-orange-400' : 'bg-teal-500/10 text-teal-400'}`}>
                                                    {res.type === 'Link' ? 'Link' : ext.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-6">Shared by {res.teacher}</p>
                                            
                                            <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
                                                <div className="flex items-center space-x-2 text-[10px] text-slate-600 font-black uppercase">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{new Date(res.date).toLocaleDateString()}</span>
                                                </div>
                                                {res.type !== 'Link' && (
                                                    <button 
                                                        onClick={() => handleDownload(res)}
                                                        className="text-[10px] font-black text-teal-500 uppercase tracking-widest hover:underline flex items-center"
                                                    >
                                                        Download <Download className="w-3 h-3 ml-2" />
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.section>
                    ))}
                </div>
            )}

            {/* Inline Preview Modal */}
            <AnimatePresence>
                {previewResource && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setPreviewResource(null)}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-slate-700 rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
                                <div>
                                    <p className="text-white font-black text-sm uppercase italic tracking-tight">{previewResource.name}</p>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">
                                        {getExtensionFromUrl(previewResource.url).toUpperCase()} · Shared by {previewResource.teacher}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleDownload(previewResource)}
                                        className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center space-x-2"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Download</span>
                                    </button>
                                    <button
                                        onClick={() => setPreviewResource(null)}
                                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-hidden bg-slate-950 flex flex-col">
                                {isImageFile(previewResource.url, previewResource.fileType) ? (
                                    <div className="w-full h-full flex items-center justify-center p-8">
                                        <img
                                            src={previewResource.url}
                                            alt={previewResource.name}
                                            className="max-w-full max-h-full object-contain rounded-2xl"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-slate-900 px-6 py-2 border-b border-slate-800 text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center space-x-2">
                                            <span>Trouble viewing the document inline?</span>
                                            <a 
                                                href={previewResource.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-teal-500 hover:underline flex items-center"
                                            >
                                                Open in New Tab <ExternalLink className="w-2.5 h-2.5 ml-1" />
                                            </a>
                                        </div>
                                        <iframe
                                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(previewResource.url)}&embedded=true`}
                                            title={previewResource.name}
                                            className="flex-1 w-full border-0"
                                            allow="fullscreen"
                                        />
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Confirmation Modal */}
            <AnimatePresence>
                {deleteTarget && (
                    <div className="fixed inset-0 z-[2001] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 max-w-sm w-full text-center space-y-6 shadow-2xl relative"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Confirm Deletion</h3>
                                <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                                    Are you sure you want to permanently remove <span className="text-white font-bold">"{deleteTarget.name}"</span>? This action cannot be reversed.
                                </p>
                            </div>

                            <div className="flex flex-col space-y-3 pt-2">
                                <button
                                    onClick={handleDelete}
                                    className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 transition-all uppercase tracking-widest text-[10px]"
                                >
                                    Permanently Delete
                                </button>
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-2xl transition-all uppercase tracking-widest text-[10px]"
                                >
                                    Cancel & Retain
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
