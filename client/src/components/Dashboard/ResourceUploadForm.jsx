"use client";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FilePlus, Link, Send, UploadCloud, FileText, Image, File, X } from "lucide-react";
import { addToast } from "@/redux/slices/uiSlice";
import { motion, AnimatePresence } from "framer-motion";
import { uploadResource } from "@/redux/slices/lectureSlice";

export default function ResourceUploadForm({ lecture, onClose }) {
    const [mode, setMode] = useState("file"); // "file" | "url"
    const [selectedFile, setSelectedFile] = useState(null);
    const [resourceName, setResourceName] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const ALLOWED_TYPES = [
        "application/pdf",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/png", "image/jpeg", "image/jpg",
        "text/plain", "application/zip",
    ];

    const getFileIcon = (mimeType) => {
        if (!mimeType) return <File className="w-5 h-5" />;
        if (mimeType === "application/pdf") return <FileText className="w-5 h-5 text-red-400" />;
        if (mimeType.startsWith("image/")) return <Image className="w-5 h-5 text-blue-400" />;
        return <File className="w-5 h-5 text-teal-400" />;
    };

    const formatBytes = (bytes) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const handleFileSelect = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            dispatch(addToast({ type: "error", message: "File type not supported. Use PDF, PPT, DOC, images or ZIP." }));
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            dispatch(addToast({ type: "error", message: "File too large. Maximum size is 10 MB." }));
            return;
        }
        setSelectedFile(file);
        if (!resourceName) setResourceName(file.name.replace(/\.[^/.]+$/, ""));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let payload;
            let isFile = false;

            if (mode === "file" && selectedFile) {
                payload = new FormData();
                payload.append("file", selectedFile);
                payload.append("name", resourceName || selectedFile.name);
                isFile = true;
            } else if (mode === "url" && url) {
                payload = { name: resourceName, url };
            } else {
                dispatch(addToast({ type: "error", message: "Please select a file or enter a URL." }));
                setLoading(false);
                return;
            }

            const resultAction = await dispatch(uploadResource({ lectureId: lecture._id, payload, isFile }));
            if (uploadResource.fulfilled.match(resultAction)) {
                dispatch(addToast({ type: "success", message: "Resource shared with students!" }));
                onClose();
            } else {
                dispatch(addToast({ type: "error", message: resultAction.payload || "Upload failed" }));
            }
        } catch (error) {
            dispatch(addToast({ type: "error", message: "Upload failed. Please try again." }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-400">
                    <FilePlus className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Share Resource</h2>
                    <p className="text-slate-500 text-sm">{lecture.title}</p>
                </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-slate-800/60 rounded-2xl p-1">
                <button
                    type="button"
                    onClick={() => setMode("file")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                        mode === "file" ? "bg-teal-500 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                >
                    <UploadCloud className="w-4 h-4" /> Upload File
                </button>
                <button
                    type="button"
                    onClick={() => setMode("url")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                        mode === "url" ? "bg-teal-500 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                >
                    <Link className="w-4 h-4" /> Share Link
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Resource Name */}
                <input
                    type="text"
                    placeholder="Resource Name (e.g. Unit 1 Notes)"
                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                    value={resourceName}
                    onChange={(e) => setResourceName(e.target.value)}
                    required
                />

                <AnimatePresence mode="wait">
                    {mode === "file" ? (
                        <motion.div
                            key="file"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                        >
                            {/* Drop Zone */}
                            {!selectedFile ? (
                                <div
                                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current.click()}
                                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                                        dragOver ? "border-teal-400 bg-teal-500/10" : "border-slate-700 hover:border-slate-500"
                                    }`}
                                >
                                    <UploadCloud className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                                    <p className="text-slate-300 font-medium">Drag & drop or click to browse</p>
                                    <p className="text-slate-500 text-xs mt-1">PDF, PPT, DOCX, Images, ZIP — Max 10 MB</p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt,.zip"
                                        onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-between bg-slate-800 rounded-2xl p-4">
                                    <div className="flex items-center gap-3">
                                        {getFileIcon(selectedFile.type)}
                                        <div>
                                            <p className="text-white text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                                            <p className="text-slate-500 text-xs">{formatBytes(selectedFile.size)}</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setSelectedFile(null)} className="text-slate-500 hover:text-red-400 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="url"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="relative"
                        >
                            <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="url"
                                placeholder="Google Drive / YouTube / Any URL"
                                className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-teal-500 outline-none"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required={mode === "url"}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    type="submit"
                    disabled={loading || (mode === "file" && !selectedFile) || (mode === "url" && !url)}
                    className="w-full py-4 bg-teal-500 text-slate-950 font-black rounded-2xl transition-all hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                            Uploading...
                        </span>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Upload & Share with Batch</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
