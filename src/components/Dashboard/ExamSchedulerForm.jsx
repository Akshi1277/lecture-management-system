"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FileText, Calendar, Clock, MapPin, User, ShieldCheck } from "lucide-react";
import axios from "axios";
import { addToast } from "@/redux/slices/uiSlice";

export default function ExamSchedulerForm({ onClose }) {
    const [formData, setFormData] = useState({
        course: "",
        batch: "",
        title: "",
        type: "Theoretical Exam",
        startTime: "",
        endTime: "",
        classroom: "",
        supervisor: ""
    });

    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
                const [resCourses, resBatches, resTeachers] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/hierarchy/courses`, config),
                        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/hierarchy/batches`, config),
                            axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/teachers`, config)
                ]);
                setCourses(resCourses.data);
                setBatches(resBatches.data);
                setTeachers(resTeachers.data);
            } catch (err) {
                console.error("Fetch Data Error", err);
            }
        };
        if (userInfo) fetchData();
    }, [userInfo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/exams`, formData, config);
                dispatch(addToast({ type: 'success', message: 'Exam scheduled successfully!' }));
            onClose();
        } catch (error) {
            dispatch(addToast({ type: 'error', message: error.response?.data?.message || 'Scheduling failed' }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Schedule Assessment</h2>
                    <p className="text-slate-500 text-sm">Exam & Viva Logistics</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Assessment Title (e.g. Mid-Sem Statistics)"
                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-rose-500"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <select
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-rose-500 appearance-none"
                        required
                    >
                        <option value="">Select Course</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <select
                        value={formData.batch}
                        onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                        className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-rose-500 appearance-none"
                        required
                    >
                        <option value="">Select Batch</option>
                        {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                </div>

                <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-rose-500 appearance-none"
                >
                    <option value="Theoretical Exam">Theoretical Exam</option>
                    <option value="Practical Exam">Practical Exam</option>
                    <option value="Viva Voce">Viva Voce</option>
                    <option value="Internal Assessment">Internal Assessment</option>
                </select>

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

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Classroom"
                        className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-rose-500"
                        value={formData.classroom}
                        onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
                        required
                    />
                    <select
                        value={formData.supervisor}
                        onChange={(e) => setFormData({ ...formData, supervisor: e.target.value })}
                        className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-rose-500 appearance-none"
                        required
                    >
                        <option value="">Supervisor</option>
                        {teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                    </select>
                </div>

                <button type="submit" className="w-full py-4 bg-rose-500 text-white font-black rounded-2xl transition-all hover:bg-rose-400 shadow-xl shadow-rose-500/20">
                    Authorize & Schedule
                </button>
            </form>
        </div>
    );
}
