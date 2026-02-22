"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Users,
  BookOpen,
  AlertCircle
} from "lucide-react";
import { login, register, clearError } from "@/redux/slices/authSlice";
import axios from "axios";

export default function LoginForm() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    department: "",
    batch: ""
  });
  const [batches, setBatches] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      router.push("/dashboard");
    }
    const fetchBatches = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/hierarchy/batches');
        setBatches(res.data);
      } catch (err) { console.error(err); }
    };
    if (activeTab === "signup") fetchBatches();
    return () => dispatch(clearError());
  }, [userInfo, router, dispatch, activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === "login") {
      dispatch(login({ email: formData.email, password: formData.password }));
    } else {
      dispatch(register(formData));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] relative z-10"
      >
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="p-8 pb-4 text-center">
            <div className="inline-flex items-center px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full text-xs font-medium mb-6">
              <Sparkles className="w-3 h-3 mr-2" />
              World Class Management
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">EduSync</h1>
            <p className="text-slate-400 font-medium">Elevating academic logistics</p>
          </div>

          <div className="p-8 pt-4">
            <div className="flex p-1 bg-slate-950/50 rounded-2xl mb-8 border border-slate-800">
              {["login", "signup"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); dispatch(clearError()); }}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${activeTab === tab ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center text-red-400 text-sm font-medium"
              >
                <AlertCircle className="w-4 h-4 mr-3 shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                {activeTab === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 overflow-hidden"
                  >
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative group">
                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-teal-500/50 transition-all font-medium"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                        </select>
                      </div>
                      <div className="relative group">
                        {formData.role === 'student' ? (
                          <>
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                            <select
                              name="batch"
                              value={formData.batch}
                              onChange={handleChange}
                              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white appearance-none focus:outline-none focus:border-teal-500/50 transition-all font-medium"
                              required
                            >
                              <option value="">Select Batch</option>
                              {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                            </select>
                          </>
                        ) : (
                          <>
                            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                            <input
                              type="text"
                              name="department"
                              placeholder="Dept ID"
                              value={formData.department}
                              onChange={handleChange}
                              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 transition-all font-medium"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="university.edu"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-4 focus:ring-teal-500/10 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-black py-4 rounded-2xl transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? "Processing..." : (activeTab === "login" ? "Sign In" : "Create Account")}
              </button>
            </form>

            <div className="mt-8 text-center pt-8 border-t border-slate-800/50">
              <p className="text-slate-500 text-sm font-medium">
                <button
                  onClick={() => { setActiveTab(activeTab === "login" ? "signup" : "login"); dispatch(clearError()); }}
                  className="text-teal-400 hover:text-teal-300 ml-2 font-bold underline transition-colors"
                >
                  {activeTab === "login" ? "Join EduSync" : "Login here"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}