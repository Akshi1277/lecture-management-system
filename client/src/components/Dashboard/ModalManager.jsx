"use client";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, BookOpen, Clock, CheckCircle, AlertCircle, Info, ShieldCheck, ShieldCheck as ShieldCheckIcon, FileText, AlertTriangle, Upload, FileSpreadsheet, Download, ArrowRight, Plus } from "lucide-react";
import { setActiveModal, removeToast, addToast } from "@/redux/slices/uiSlice";
import { createLecture } from "@/redux/slices/lectureSlice";
import { fetchBatches } from "@/redux/slices/hierarchySlice";
import { fetchExistingSubjects, enrollUser, bulkEnroll } from "@/redux/slices/userSlice";
import { useState, useEffect } from "react";
import BatchManager from "./BatchManager";
import ResourceUploadForm from "./ResourceUploadForm";
import SubstitutionFinder from "./SubstitutionFinder";
import ExamSchedulerForm from "./ExamSchedulerForm";
import AssignLectureForm from "./AssignLectureForm";
import RoomBlocker from "./RoomBlocker";
import ReportGenerator from "./ReportGenerator";
import AuditLogViewer from "./AuditLogViewer";

export default function ModalManager() {
    const { activeModal, activeModalData, toasts } = useSelector((state) => state.ui);
    const dispatch = useDispatch();

    const closeModal = () => dispatch(setActiveModal(null));

    const modals = {
        assignLecture: <AssignLectureForm lecture={activeModalData} onClose={closeModal} />,
        manageUsers: <EnrollUserForm onClose={closeModal} />,
        manageBatches: <BatchManager onClose={closeModal} />,
        uploadResource: <ResourceUploadForm lecture={activeModalData} onClose={closeModal} />,
        findSubstitute: <SubstitutionFinder lecture={activeModalData} onClose={closeModal} />,
        scheduleExam: <ExamSchedulerForm onClose={closeModal} />,
        blockRoom: <RoomBlocker onClose={closeModal} />,
        generateReport: <ReportGenerator onClose={closeModal} />,
        viewAuditLogs: <AuditLogViewer onClose={closeModal} />,
    };

    return (
        <>
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`relative w-full ${activeModal === 'manageBatches' || activeModal === 'assignLecture' || activeModal === 'viewAuditLogs' || activeModal === 'generateReport' ? 'max-w-5xl' : 'max-w-lg'} max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-300`}
                        >
                            <div className="absolute top-6 right-8 z-20">
                                <button onClick={closeModal} className="p-2 bg-slate-900/50 backdrop-blur-md hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white border border-slate-800">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-10 overflow-y-auto custom-scrollbar flex-1">
                                {modals[activeModal]}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast Notifications */}
            <div className="fixed bottom-8 right-8 z-[200] space-y-4">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <ToastItem key={toast.id} toast={toast} onClose={(id) => dispatch(removeToast(id))} />
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}

function ToastItem({ toast, onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, 2000); // 2 seconds
        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`p-4 rounded-2xl border shadow-xl flex items-center space-x-4 min-w-[300px] ${toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    'bg-slate-800 border-slate-700 text-slate-200'
                }`}
        >
            <div className="shrink-0">
                {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                    toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
                        <Info className="w-5 h-5" />}
            </div>
            <p className="text-sm font-bold flex-1">{toast.message}</p>
            <button onClick={() => onClose(toast.id)} className="text-slate-500 hover:text-white">
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

function EnrollUserForm({ onClose }) {
    const [regMethod, setRegMethod] = useState("individual"); // 'individual' or 'bulk'
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "student",
        department: [],
        subjects: [],
        batch: "",
        isMentor: false,
        parentEmail: ""
    });
    const [file, setFile] = useState(null);
    const { batches } = useSelector(state => state.hierarchy);
    const { subjects: existingSubjects, enrollLoading: isProcessing } = useSelector(state => state.users);
    const [subjectInput, setSubjectInput] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const departments = ['IT', 'CS'];
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchBatches());
            dispatch(fetchExistingSubjects());
        }
    }, [userInfo, dispatch]);

    const handleSubjectInput = (e) => {
        setSubjectInput(e.target.value);
        setShowSuggestions(true);
    };

    const addSubject = (subj) => {
        const s = subj.trim();
        if (s && !formData.subjects.includes(s)) {
            setFormData({ ...formData, subjects: [...formData.subjects, s] });
        }
        setSubjectInput("");
        setShowSuggestions(false);
    };

    const removeSubject = (subj) => {
        setFormData({ ...formData, subjects: formData.subjects.filter(s => s !== subj) });
    };

    const handleDeptToggle = (deptId) => {
        const currentDepts = Array.isArray(formData.department) ? formData.department : [];
        if (currentDepts.includes(deptId)) {
            setFormData({ ...formData, department: currentDepts.filter(id => id !== deptId) });
        } else {
            setFormData({ ...formData, department: [...currentDepts, deptId] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (regMethod === "bulk") {
            if (!file) {
                dispatch(addToast({ type: 'error', message: 'Please select an Excel file' }));
                return;
            }
            if (!formData.batch) {
                dispatch(addToast({ type: 'error', message: 'Please select a batch for bulk registration' }));
                return;
            }

            const bulkFormData = new FormData();
            bulkFormData.append('file', file);
            bulkFormData.append('batchId', formData.batch);

            const resultAction = await dispatch(bulkEnroll(bulkFormData));
            if (bulkEnroll.fulfilled.match(resultAction)) {
                dispatch(addToast({ type: 'success', message: resultAction.payload.message || 'Bulk registration successful' }));
                onClose();
            } else {
                dispatch(addToast({ type: 'error', message: resultAction.payload || 'Bulk registration failed' }));
            }
            return;
        }

        // Individual registration
        const payload = { ...formData };
        if (payload.role !== 'student') {
            delete payload.batch;
        }
        if (payload.role !== 'teacher') {
            delete payload.subjects;
        }
        if (payload.role === 'student' && !payload.batch) {
            dispatch(addToast({ type: 'error', message: 'Please select a batch for the student' }));
            return;
        }

        const resultAction = await dispatch(enrollUser(payload));
        if (enrollUser.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: `${formData.name} enrolled! Credentials sent via email.` }));
            onClose();
        } else {
            dispatch(addToast({ type: 'error', message: resultAction.payload || 'Enrollment failed' }));
        }
    };

    const downloadTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8,FullName,Email,ParentEmail\nJohn Doe,john@university.edu,parent.doe@gmail.com\nJane Smith,jane@university.edu,parent.smith@gmail.com";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "student_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500 rounded-2xl shadow-lg shadow-blue-500/20">
                        <Users className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white leading-none tracking-tight italic">Enroll User</h2>
                        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Registration Portal</p>
                    </div>
                </div>
            </div>

            {/* Registration Method Tabs */}
            <div className="flex p-1 bg-slate-950/50 rounded-2xl border border-slate-800">
                {["individual", "bulk"].map((method) => (
                    <button
                        key={method}
                        onClick={() => {
                            setRegMethod(method);
                            setFormData({ ...formData, role: method === 'bulk' ? 'student' : formData.role });
                        }}
                        className={`flex-1 py-3 text-xs font-black rounded-xl uppercase tracking-wider transition-all duration-300 ${regMethod === method ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                    >
                        {method} Registration
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {regMethod === "individual" ? (
                    <>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="University Email"
                                className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                            {formData.role === 'student' && (
                                <input
                                    type="email"
                                    placeholder="Parent's Email Address"
                                    className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-teal-500 outline-none font-medium"
                                    value={formData.parentEmail}
                                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <select
                                value={formData.role}
                                disabled={userInfo?.role !== 'admin'}
                                onChange={(e) => {
                                    const newRole = e.target.value;
                                    setFormData({
                                        ...formData,
                                        role: newRole,
                                        department: [],
                                        subjects: [],
                                        batch: "",
                                        isMentor: false
                                    });
                                }}
                                className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 appearance-none font-medium outline-none"
                            >
                                <option value="student">Student Account</option>
                                <option value="teacher">Faculty Account</option>
                                <option value="admin">System Admin</option>
                            </select>

                            {formData.role === 'student' ? (
                                <select
                                    value={formData.batch}
                                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 appearance-none outline-none font-medium"
                                    required
                                >
                                    <option value="">Select Batch</option>
                                    {batches.map(b => <option key={b._id} value={b._id}>{b.name} ({b.department})</option>)}
                                </select>
                            ) : formData.role === 'teacher' ? (
                                <div className="relative">
                                    <select
                                        value=""
                                        onChange={(e) => {
                                            if (e.target.value) addSubject(e.target.value);
                                        }}
                                        className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 appearance-none font-medium outline-none"
                                    >
                                        <option value="">Quick Add Subject</option>
                                        {existingSubjects.filter(s => !formData.subjects.includes(s)).map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center space-x-2">
                                        <div className="w-px h-4 bg-slate-700/50 mx-1" />
                                        <FileText className="w-4 h-4 text-slate-500" />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl p-4 text-slate-500 text-sm flex items-center justify-between font-medium">
                                    <span>{formData.role === 'admin' ? 'Select Depts' : 'Add Subjects'}</span>
                                    {formData.role === 'admin' ? <BookOpen className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                </div>
                            )}
                        </div>

                        {formData.role === 'teacher' && (
                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Add Subject (e.g. Java, Python)"
                                        value={subjectInput}
                                        onChange={handleSubjectInput}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubject(subjectInput); } }}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                                        onFocus={() => setShowSuggestions(true)}
                                        className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                    />
                                    {showSuggestions && subjectInput && (
                                        <div className="absolute z-10 w-full mt-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl max-h-40 overflow-y-auto custom-scrollbar">
                                            {existingSubjects.filter(s => s.toLowerCase().includes(subjectInput.toLowerCase()) && !formData.subjects.includes(s)).map(s => (
                                                <button key={s} type="button" onClick={() => addSubject(s)} className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-800 transition-colors text-xs font-bold uppercase tracking-tight">
                                                    {s}
                                                </button>
                                            ))}
                                            <button type="button" onClick={() => addSubject(subjectInput)} className="w-full px-4 py-3 text-left text-blue-400 hover:bg-slate-800 transition-colors text-xs font-black italic">
                                                + Create "{subjectInput}"
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {formData.subjects.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.subjects.map(s => (
                                            <span key={s} className="flex items-center space-x-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">
                                                <span>{s}</span>
                                                <button type="button" onClick={() => removeSubject(s)} className="p-0.5 hover:bg-blue-500/20 rounded-md transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {formData.role === 'admin' && (
                            <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-800/50 space-y-4">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Select Jurisdiction</p>
                                <div className="flex flex-wrap gap-3">
                                    {departments.map((dept) => (
                                        <button
                                            key={dept}
                                            type="button"
                                            onClick={() => handleDeptToggle(dept)}
                                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${Array.isArray(formData.department) && formData.department.includes(dept) ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-900 text-slate-500 border border-slate-800 hover:border-slate-700'}`}
                                        >
                                            {dept} Dept
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {formData.role === 'teacher' && userInfo?.role === 'admin' && (
                            <div className="flex items-center justify-between p-5 bg-slate-900/60 rounded-3xl border border-slate-800">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-2.5 rounded-xl ${formData.isMentor ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'}`}>
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white italic">Assign as Mentor</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Privileged Academic Management</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, isMentor: !formData.isMentor })}
                                    className={`w-14 h-7 rounded-full relative transition-colors ${formData.isMentor ? 'bg-amber-500' : 'bg-slate-800'}`}
                                >
                                    <motion.div animate={{ x: formData.isMentor ? 32 : 4 }} className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg" />
                                </button>
                            </div>
                        )}

                        <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl flex items-start space-x-3">
                            <AlertTriangle className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-teal-400 font-bold uppercase leading-relaxed tracking-tight">Credentials will be auto-generated and dispatched via encrypted email notification.</p>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="p-8 bg-slate-900/50 border border-slate-800 border-dashed rounded-[32px] text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-400">
                                <Upload className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white italic">Upload Payload</h3>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Excel (xlsx) or CSV format</p>
                            </div>
                            <input
                                type="file"
                                id="bulkUpload"
                                className="hidden"
                                accept=".xlsx, .xls, .csv"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <label
                                htmlFor="bulkUpload"
                                className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-800 text-white font-bold rounded-xl cursor-pointer hover:bg-slate-700 transition-all border border-slate-700"
                            >
                                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                                <span>{file ? file.name : "Select Document"}</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Target Batch for Enrollment</label>
                            <select
                                value={formData.batch}
                                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700/50 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 appearance-none font-medium outline-none"
                                required
                            >
                                <option value="">Select Destination Batch</option>
                                {batches.map(b => <option key={b._id} value={b._id}>{b.name} ({b.department})</option>)}
                            </select>
                        </div>

                        <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-[24px] space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Download className="w-4 h-4 text-teal-400" />
                                    <span className="text-xs font-black text-slate-300 uppercase italic">Document Template</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={downloadTemplate}
                                    className="text-[10px] text-teal-400 font-black uppercase hover:underline"
                                >
                                    Download Sample
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Col 1</p>
                                    <p className="text-xs font-bold text-white">FullName</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Col 2</p>
                                    <p className="text-xs font-bold text-white">Email</p>
                                </div>
                                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Col 3</p>
                                    <p className="text-xs font-bold text-white">ParentEmail</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-[24px] shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processing Enrollment...</span>
                        </>
                    ) : (
                        <>
                            <span>{regMethod === 'individual' ? 'Initialize Registration' : 'Execute Bulk Enrollment'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
