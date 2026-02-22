"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FilePlus, Link, Send } from "lucide-react";
import axios from "axios";
import { addToast } from "@/redux/slices/uiSlice";

export default function ResourceUploadForm({ lecture, onClose }) {
    const [formData, setFormData] = useState({ name: "", url: "" });
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            await axios.post(`http://localhost:5000/api/lectures/${lecture._id}/resources`, formData, config);
            dispatch(addToast({ type: 'success', message: 'Resource shared with students!' }));
            onClose();
        } catch (error) {
            dispatch(addToast({ type: 'error', message: error.response?.data?.message || 'Upload failed' }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-400">
                    <FilePlus className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Share Resource</h2>
                    <p className="text-slate-500 text-sm">{lecture.title}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Resource Name (e.g. Unit 1 Notes)"
                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <div className="relative">
                    <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="url"
                        placeholder="PDF Link / Google Drive URL"
                        className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-teal-500"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        required
                    />
                </div>
                <button type="submit" className="w-full py-4 bg-teal-500 text-slate-950 font-black rounded-2xl transition-all hover:bg-teal-400 flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Upload & Notify Batch</span>
                </button>
            </form>
        </div>
    );
}
