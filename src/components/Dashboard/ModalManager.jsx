"use client";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Users, BookOpen, Clock, CheckCircle, AlertCircle, Info } from "lucide-react";
import { setActiveModal, removeToast, addToast } from "@/redux/slices/uiSlice";
import { createLecture } from "@/redux/slices/lectureSlice";
import { useState, useEffect } from "react";
import axios from "axios";
import BatchManager from "./BatchManager";
import AttendanceMarker from "./AttendanceMarker";
import ResourceUploadForm from "./ResourceUploadForm";
import SubstitutionFinder from "./SubstitutionFinder";
import SyllabusManager from "./SyllabusManager";
import ExamSchedulerForm from "./ExamSchedulerForm";

export default function ModalManager() {
    const { activeModal, activeModalData, toasts } = useSelector((state) => state.ui);
    const dispatch = useDispatch();

    const closeModal = () => dispatch(setActiveModal(null));

    const modals = {
        assignLecture: <AssignLectureForm onClose={closeModal} />,
        manageUsers: <EnrollUserForm onClose={closeModal} />,
        manageBatches: <BatchManager onClose={closeModal} />,
        markAttendance: <AttendanceMarker lecture={activeModalData} onClose={closeModal} />,
        uploadResource: <ResourceUploadForm lecture={activeModalData} onClose={closeModal} />,
        findSubstitute: <SubstitutionFinder lecture={activeModalData} onClose={closeModal} />,
        viewSyllabus: <SyllabusManager courseId={activeModalData} onClose={closeModal} />,
        scheduleExam: <ExamSchedulerForm onClose={closeModal} />,
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
                            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-6 right-6">
                                <button onClick={closeModal} className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-10">
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
                        <motion.div
                            key={toast.id}
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
                            <button onClick={() => dispatch(removeToast(toast.id))} className="text-slate-500 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}

function AssignLectureForm({ onClose }) {
    const [formData, setFormData] = useState({
        title: "",
        course: "",
        teacher: "",
        classroom: "",
        startTime: "",
        endTime: "",
    });

    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                const [resCourses, resTeachers] = await Promise.all([
                    axios.get('http://localhost:5000/api/courses', config),
                    axios.get('http://localhost:5000/api/users/teachers', config)
                ]);
                setCourses(resCourses.data);
                setTeachers(resTeachers.data);
            } catch (err) {
                console.error("Fetch Data Error", err);
            }
        };
        if (userInfo) fetchData();
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(createLecture(formData));
        if (createLecture.fulfilled.match(resultAction)) {
            dispatch(addToast({ type: 'success', message: 'Lecture assigned successfully!' }));
            onClose();
        } else {
            dispatch(addToast({ type: 'error', message: resultAction.payload || 'Failed to assign lecture' }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-teal-500 rounded-2xl">
                    <Calendar className="text-white w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Assign Lecture</h2>
                    <p className="text-slate-400 text-sm">Scheduling System</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Lecture Title"
                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <select
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500 appearance-none"
                        required
                    >
                        <option value="">Course</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <select
                        value={formData.teacher}
                        onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                        className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500 appearance-none"
                        required
                    >
                        <option value="">Teacher</option>
                        {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="datetime-local"
                        className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        required
                    />
                    <input
                        type="datetime-local"
                        className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        required
                    />
                </div>
                <input
                    type="text"
                    placeholder="Classroom"
                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-teal-500"
                    value={formData.classroom}
                    onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                    required
                />
                <button type="submit" className="w-full py-4 bg-teal-500 text-slate-950 font-bold rounded-2xl">
                    Verify & Assign
                </button>
            </form>
        </div>
    );
}

function EnrollUserForm({ onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "student",
        department: "",
        batch: ""
    });
    const [batches, setBatches] = useState([]);
    const dispatch = useDispatch();
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchBatches = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                const res = await axios.get('http://localhost:5000/api/hierarchy/batches', config);
                setBatches(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        if (userInfo) fetchBatches();
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/users', formData);
            dispatch(addToast({ type: 'success', message: `${formData.name} enrolled!` }));
            onClose();
        } catch (err) {
            dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Enrollment failed' }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-500 rounded-2xl">
                    <Users className="text-white w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white leading-none">Enroll User</h2>
                    <p className="text-slate-400 text-sm mt-1">Registration</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <div className="grid grid-cols-2 gap-4">
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                    {formData.role === 'student' ? (
                        <select
                            value={formData.batch}
                            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                            className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500 appearance-none"
                            required
                        >
                            <option value="">Select Batch</option>
                            {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    ) : (
                        <input
                            type="text"
                            placeholder="Dept ID"
                            className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                    )}
                </div>
                <button type="submit" className="w-full py-4 bg-blue-500 text-white font-bold rounded-2xl">
                    Register
                </button>
            </form>
        </div>
    );
}
