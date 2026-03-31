"use client";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { removeToast } from "@/redux/slices/uiSlice";
import { useEffect } from "react";

export default function GlobalToast() {
    const { toasts } = useSelector((state) => state.ui);
    const dispatch = useDispatch();

    return (
        <div className="fixed bottom-8 right-8 z-[9999] space-y-4 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={(id) => dispatch(removeToast(id))} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function ToastItem({ toast, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, 5000); // 5 seconds for better readability
        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    const getToastStyle = () => {
        switch(toast.type) {
            case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
            case 'error': return 'bg-red-500/10 border-red-500/20 text-red-400';
            case 'warning': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
            case 'info': return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
            default: return 'bg-slate-900 border-slate-800 text-slate-200';
        }
    };

    const getIcon = () => {
        switch(toast.type) {
            case 'success': return <CheckCircle className="w-5 h-5" />;
            case 'error': return <AlertCircle className="w-5 h-5" />;
            case 'warning': return <AlertTriangle className="w-5 h-5" />;
            case 'info': return <Info className="w-5 h-5" />;
            default: return <Info className="w-5 h-5" />;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`p-5 rounded-2xl border shadow-2xl flex items-center space-x-4 min-w-[320px] max-w-md pointer-events-auto backdrop-blur-xl ${getToastStyle()}`}
        >
            <div className="shrink-0">
                {getIcon()}
            </div>
            <p className="text-sm font-bold flex-1 leading-relaxed tracking-tight tracking-wide">{toast.message}</p>
            <button onClick={() => onClose(toast.id)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
