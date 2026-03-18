"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mail,
    Lock,
    ArrowLeft,
    Sparkles,
    ShieldCheck,
    CheckCircle,
    Loader2,
    Eye,
    EyeOff,
    AlertCircle
} from "lucide-react";
import { useDispatch } from "react-redux";
import { addToast } from "@/redux/slices/uiSlice";
import { requestOTP, resetPassword } from "@/redux/slices/authSlice";

export default function ForgotPasswordForm() {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const dispatch = useDispatch();
    const router = useRouter();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const resultAction = await dispatch(requestOTP(email));
        if (requestOTP.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: resultAction.payload.message || 'OTP sent successfully.' }));
            setStep(2);
        } else {
            const msg = resultAction.payload || "Failed to send OTP.";
            setError(msg);
            dispatch(addToast({ type: 'error', message: msg }));
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validation
        if (otp.length !== 6) {
            setError("OTP must be exactly 6 digits.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");
        const resultAction = await dispatch(resetPassword({ email, otp, newPassword }));
        if (resetPassword.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: resultAction.payload.message || 'Password reset successfully.' }));
            router.push("/login");
        } else {
            const msg = resultAction.payload || "Failed to reset password.";
            setError(msg);
            dispatch(addToast({ type: 'error', message: msg }));
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <div className="absolute inset-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] relative z-10"
            >
                <button
                    onClick={() => step === 1 ? router.push("/login") : setStep(1)}
                    className="group mb-8 flex items-center space-x-3 text-slate-500 hover:text-white transition-all"
                >
                    <div className="p-2 bg-slate-900/50 border border-slate-800 rounded-xl group-hover:border-teal-500/50 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest">Back to Login</span>
                </button>

                <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
                    <div className="p-8 pb-4 text-center">
                        <div className="inline-flex items-center px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full text-xs font-medium mb-6">
                            <Sparkles className="w-3 h-3 mr-2" />
                            Security Protocol
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                            {step === 1 ? "Reset Access" : "Verify Account"}
                        </h1>
                        <p className="text-slate-400 font-medium lowercase tracking-wider opacity-80">
                            {step === 1 ? "reclaim your administrative control" : "confirm identity with verification code"}
                        </p>
                    </div>

                    <div className="p-8 pt-4">
                        <AnimatePresence mode="wait">
                            {step === 1 ? (
                                <motion.form
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    onSubmit={handleRequestOTP}
                                    className="space-y-6"
                                >
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center text-red-400 text-sm font-medium"
                                        >
                                            <AlertCircle className="w-4 h-4 mr-3 shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                                        <input
                                            type="email"
                                            placeholder="university.edu"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <span>Send Verification Code</span>
                                                <ShieldCheck className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            ) : (
                                <motion.form
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    onSubmit={handleResetPassword}
                                    className="space-y-5"
                                >
                                    <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl text-center">
                                        <p className="text-[10px] text-teal-400 font-bold uppercase tracking-widest leading-relaxed">
                                            Verification code sent to<br />
                                            <span className="text-white text-xs">{email}</span>
                                        </p>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center text-red-400 text-sm font-medium"
                                        >
                                            <AlertCircle className="w-4 h-4 mr-3 shrink-0" />
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors flex items-center justify-center font-black text-xs italic">OTP</div>
                                        <input
                                            type="text"
                                            placeholder="6-Digit OTP"
                                            maxLength={6}
                                            required
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Numeric only
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-14 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all font-black tracking-[0.5em] text-center"
                                        />
                                    </div>

                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="New Secure Password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-teal-400 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors opacity-50" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirm New Password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <span>Update Password</span>
                                                <CheckCircle className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        <div className="mt-8 text-center pt-8 border-t border-slate-800/50">
                            <p className="text-slate-500 text-[13px] font-medium leading-relaxed">
                                Problems? <span className="text-teal-400 cursor-pointer hover:underline" onClick={() => { setStep(1); setError(""); }}>Try another email</span>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
