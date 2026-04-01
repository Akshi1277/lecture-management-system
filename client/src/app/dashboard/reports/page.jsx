"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { 
    BarChart3, TrendingUp, PieChart, Users, AlertTriangle,
    Calendar, Download, ArrowUpRight, ArrowDownRight,
    Activity, ShieldCheck, Clock
} from "lucide-react";
import { addToast } from "@/redux/slices/uiSlice";
import { fetchLectures } from "@/redux/slices/lectureSlice";
import { fetchUsers, fetchFacultyLoad } from "@/redux/slices/dashboardSlice";
import { ReportCardSkeleton, ChartSkeleton } from "@/components/Shared/Skeleton";

export default function ReportsPage() {
    const { userInfo } = useSelector((state) => state.auth);
    const { list: lectures, loading: lectureLoading } = useSelector((state) => state.lecture);
    const { users, facultyLoad, securityStats, loading: dashboardLoading } = useSelector((state) => state.dashboard);
    const dispatch = useDispatch();

    const loading = lectureLoading || dashboardLoading;

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchLectures());
            dispatch(fetchUsers());
            if (userInfo.role === 'admin') {
                dispatch(fetchFacultyLoad());
            }
        }
    }, [userInfo, dispatch]);

    const stats = {
        totalLectures: lectures.length,
        completedLectures: lectures.filter(l => l.status === 'Completed').length,
        cancelledLectures: lectures.filter(l => l.status === 'Cancelled').length,
        facultyLoad: userInfo?.role === 'admin' ? facultyLoad : [],
        securityLockdowns: securityStats.lockdowns || 0,
        totalUsers: {
            students: users.filter(u => u.role === 'student').length,
            teachers: users.filter(u => u.role === 'teacher').length
        },
        averageAttendance: Math.round(lectures.filter(l => l.status === 'Completed').reduce((acc, curr) => acc + (curr.attendanceTrend || 82), 0) / (lectures.filter(l => l.status === 'Completed').length || 1))
    };

    if (userInfo?.role === 'student') {
        // Filter lectures for student's batch that are completed
        const studentBatchId = typeof userInfo.batch === 'object' ? userInfo.batch?._id : userInfo.batch;
        const relevantLectures = lectures.filter(l => 
            l.status === 'Completed' && 
            (typeof l.batch === 'object' ? l.batch?._id === studentBatchId : l.batch === studentBatchId)
        );

        // Calculate Subject-wise stats
        const subjectStats = {};
        let totalAttended = 0;

        relevantLectures.forEach(l => {
            if (!subjectStats[l.subject]) {
                subjectStats[l.subject] = { total: 0, attended: 0 };
            }
            subjectStats[l.subject].total += 1;
            const isPresent = l.attendance?.includes(userInfo._id);
            if (isPresent) {
                subjectStats[l.subject].attended += 1;
                totalAttended += 1;
            }
        });

        const overallPercentage = relevantLectures.length > 0 
            ? Math.round((totalAttended / relevantLectures.length) * 100) 
            : 0;

        return (
            <div className="space-y-10 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">Presence Report</h1>
                        <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-widest leading-none">Subject-Wise Performance & Compliance</p>
                    </div>
                    <div className="px-6 py-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl flex items-center space-x-6">
                        <div className="text-right">
                            <p className="text-[10px] text-slate-500 font-black uppercase mb-1">Overall Attendance</p>
                            <p className={`text-3xl font-black ${overallPercentage >= 75 ? 'text-teal-400' : 'text-rose-500'}`}>{overallPercentage}%</p>
                        </div>
                        <div className={`p-4 rounded-2xl ${overallPercentage >= 75 ? 'bg-teal-500/10' : 'bg-rose-500/10'}`}>
                            {overallPercentage >= 75 ? <ShieldCheck className="w-8 h-8 text-teal-500" /> : <AlertTriangle className="w-8 h-8 text-rose-500" />}
                        </div>
                    </div>
                </div>

                {/* Subject Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(subjectStats).map(([subject, data], idx) => {
                        const percentage = Math.round((data.attended / data.total) * 100);
                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={subject}
                                className="p-8 bg-slate-900 border border-slate-800 rounded-[32px] group hover:border-teal-500/30 transition-all shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Activity className="w-24 h-24 text-teal-400" />
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{subject}</h3>
                                            <p className="text-slate-500 text-[10px] font-black uppercase mt-1 tracking-widest">Academic Module</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${percentage >= 75 ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}`}>
                                            {percentage >= 75 ? 'Compliant' : 'Shortage'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                                            <span className="text-slate-500">Attendance</span>
                                            <span className="text-white">{percentage}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, ease: 'circOut' }}
                                                className={`h-full rounded-full ${percentage >= 75 ? 'bg-gradient-to-r from-teal-600 to-teal-400' : 'bg-gradient-to-r from-rose-600 to-rose-400'}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                                            <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Attended</p>
                                            <p className="text-lg font-black text-white">{data.attended}</p>
                                        </div>
                                        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                                            <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Total</p>
                                            <p className="text-lg font-black text-white">{data.total}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {relevantLectures.length === 0 && (
                    <div className="py-20 text-center bg-slate-900/40 border border-slate-800 rounded-[40px] border-dashed">
                        <Activity className="w-16 h-16 text-slate-800 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No attendance data recorded yet.</p>
                    </div>
                )}
            </div>
        );
    }

    const exportSnapshot = () => {
        const completionRate = stats.totalLectures ? Math.round((stats.completedLectures / stats.totalLectures) * 100) : 0;
        const scheduledLectures = stats.totalLectures - stats.completedLectures - stats.cancelledLectures;
        const totalPopulation = stats.totalUsers.students + stats.totalUsers.teachers;

        const facultyRows = stats.facultyLoad.map(f => `
            <tr>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-weight:700;color:#111827;">${f.teacher}</td>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;text-align:center;font-weight:900;color:#0d9488;">${f.count}</td>
                <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;">
                    <div style="background:#e5e7eb;border-radius:99px;height:8px;overflow:hidden;">
                        <div style="width:${Math.round((f.count / Math.max(...stats.facultyLoad.map(x => x.count))) * 100)}%;height:100%;background:linear-gradient(90deg,#0d9488,#14b8a6);border-radius:99px;"></div>
                    </div>
                </td>
            </tr>
        `).join('');

        const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>EduSync — Institutional Report Snapshot</title>
    <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#fff;color:#111827;padding:40px;}
        .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #111827;}
        .brand{font-size:22px;font-weight:900;letter-spacing:-0.5px;color:#111827;}
        .brand span{color:#0d9488;}
        .report-title{font-size:28px;font-weight:900;letter-spacing:-1px;text-transform:uppercase;font-style:italic;}
        .meta{font-size:11px;color:#6b7280;margin-top:4px;text-transform:uppercase;letter-spacing:1px;font-weight:700;}
        .timestamp{font-size:11px;color:#6b7280;text-align:right;}
        .section-title{font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#6b7280;margin:28px 0 12px;}
        .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px;}
        .card{border:1.5px solid #e5e7eb;border-radius:16px;padding:20px;}
        .card-label{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;margin-bottom:6px;}
        .card-value{font-size:32px;font-weight:900;color:#111827;line-height:1;}
        .card-trend{display:inline-block;margin-top:8px;font-size:10px;font-weight:900;text-transform:uppercase;padding:2px 8px;border-radius:99px;background:#f0fdf4;color:#0d9488;}
        .card-trend.down{background:#fff1f2;color:#e11d48;}
        table{width:100%;border-collapse:collapse;margin-bottom:32px;}
        th{background:#f9fafb;padding:10px 16px;text-align:left;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:1.5px;color:#6b7280;border-bottom:2px solid #e5e7eb;}
        .delivery-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
        .delivery-card{border:1.5px solid #e5e7eb;border-radius:12px;padding:16px;text-align:center;}
        .delivery-card-label{font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:2px;color:#9ca3af;margin-bottom:6px;}
        .delivery-card-value{font-size:28px;font-weight:900;}
        .v-teal{color:#0d9488;} .v-rose{color:#e11d48;} .v-blue{color:#3b82f6;} .v-indigo{color:#6366f1;}
        .anomaly{background:#fff7ed;border:1.5px solid #fed7aa;border-radius:12px;padding:16px;margin-top:20px;display:flex;gap:12px;align-items:flex-start;}
        .anomaly-stable{background:#f0fdf4;border:1.5px solid #d1fae5;border-radius:14px;padding:16px;margin-top:20px;display:flex;gap:12px;align-items:flex-start;}
        .anomaly-title{font-size:12px;font-weight:700;color:#92400e;margin-bottom:4px;}
        .stable-title{font-size:12px;font-weight:700;color:#065f46;margin-bottom:4px;}
        .anomaly-body{font-size:11px;color:#b45309;line-height:1.6;}
        .footer{margin-top:40px;padding-top:16px;border-top:1.5px solid #e5e7eb;display:flex;justify-content:space-between;font-size:10px;color:#9ca3af;font-weight:700;text-transform:uppercase;letter-spacing:1px;}
        @media print{body{padding:24px;}@page{margin:12mm;}}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="brand">Edu<span>Sync</span></div>
            <div class="report-title">Institutional Report</div>
            <div class="meta">Deep analytics on academic delivery &amp; behavioral trends</div>
        </div>
        <div class="timestamp">
            <div style="font-weight:900;font-size:13px;color:#111827;">SNAPSHOT</div>
            <div>${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
            <div>${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
            <div style="margin-top:6px;">Generated by: ${userInfo?.name || 'Admin'}</div>
        </div>
    </div>
    <div class="section-title">High-Level Metrics</div>
    <div class="grid">
        <div class="card"><div class="card-label">Completion Rate</div><div class="card-value">${completionRate}%</div><div class="card-trend">+2.4% ↑</div></div>
        <div class="card"><div class="card-label">Avg. Student Presence</div><div class="card-value">${stats.averageAttendance}%</div><div class="card-trend down">-0.8% ↓</div></div>
        <div class="card"><div class="card-label">Faculty Utilization</div><div class="card-value" style="font-size:22px;padding-top:4px;">${stats.facultyLoad.length > 0 ? 'High' : 'Low'}</div><div class="card-trend">Steady ↑</div></div>
        <div class="card"><div class="card-label">Security Lockdowns</div><div class="card-value">${String(stats.securityLockdowns).padStart(2, '0')}</div><div class="card-trend">Active ↑</div></div>
    </div>
    <div class="section-title">Faculty Execution Load</div>
    ${stats.facultyLoad.length > 0 ? `<table><thead><tr><th>Faculty Member</th><th style="text-align:center;">Sessions</th><th>Execution Ratio</th></tr></thead><tbody>${facultyRows}</tbody></table>` : `<p style="color:#9ca3af;font-size:12px;font-style:italic;margin-bottom:28px;">No faculty load data available.</p>`}
    <div class="section-title">Delivery Summary</div>
    <div class="delivery-grid">
        <div class="delivery-card"><div class="delivery-card-label">Completed</div><div class="delivery-card-value v-teal">${stats.completedLectures}</div></div>
        <div class="delivery-card"><div class="delivery-card-label">Cancelled</div><div class="delivery-card-value v-rose">${stats.cancelledLectures}</div></div>
        <div class="delivery-card"><div class="delivery-card-label">Scheduled</div><div class="delivery-card-value v-blue">${scheduledLectures}</div></div>
        <div class="delivery-card"><div class="delivery-card-label">Total Population</div><div class="delivery-card-value v-indigo">${totalPopulation}</div></div>
    </div>
    <div class="${stats.cancelledLectures > 0 ? 'anomaly' : 'anomaly-stable'}">
        <div style="font-size:20px;">${stats.cancelledLectures > 0 ? '⚠️' : '🛡️'}</div>
        <div>
            <div class="${stats.cancelledLectures > 0 ? 'anomaly-title' : 'stable-title'}">${stats.cancelledLectures > 0 ? 'Operational Anomaly Detected' : 'Institutional Protocols Stabilized'}</div>
            <div class="anomaly-body">${stats.cancelledLectures > 0 ? 'Cancellation rate is higher than the institutional baseline. Review room blocking protocols.' : 'No logistical deviations detected. Operational integrity is maintained at maximum efficiency.'}</div>
        </div>
    </div>
    <div class="footer"><span>EduSync Institutional Management Platform</span><span>Confidential — Internal Use Only</span></div>
    <script>window.onload=()=>{window.print();}<\/script>
</body>
</html>`;

        const win = window.open('', '_blank');
        win.document.write(html);
        win.document.close();
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tight">
                        {userInfo?.role === 'admin' ? "Institutional Reports" : "Performance Analytics"}
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {userInfo?.role === 'admin' 
                            ? "Deep analytics on academic delivery and behavioral trends."
                            : "Analyze your teaching efficiency and class engagement metrics."}
                    </p>
                </div>
                <button 
                    onClick={exportSnapshot}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-black transition-all border border-slate-700 flex items-center shadow-xl shadow-slate-950/20"
                >
                    <Download className="w-4 h-4 mr-2" /> Export Snapshot
                </button>
            </div>

            {/* High Level Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
                {loading ? (
                    Array(4).fill(0).map((_, i) => <ReportCardSkeleton key={i} />)
                ) : (
                    [
                        { label: "Completion Rate", value: `${stats.totalLectures ? Math.round((stats.completedLectures/stats.totalLectures)*100) : 0}%`, icon: <Activity className="text-teal-400" />, trend: "+2.4%", trendUp: true },
                        { label: "Avg. Student Presence", value: `${stats.averageAttendance}%`, icon: <Users className="text-blue-400" />, trend: "-0.8%", trendUp: false },
                        { label: "Faculty Utilization", value: stats.facultyLoad.length > 0 ? "High" : "Low", icon: <TrendingUp className="text-purple-400" />, trend: "Steady", trendUp: true },
                        { label: "Security/Lockdowns", value: stats.securityLockdowns.toString().padStart(2, '0'), icon: <ShieldCheck className="text-rose-500" />, trend: "Active", trendUp: true }
                    ].map((stat, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx} 
                            className="p-6 bg-slate-900 border border-slate-800 rounded-[32px] space-y-4 relative overflow-hidden group shadow-xl"
                        >
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform">{stat.icon}</div>
                                <div className={`flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg ${stat.trendUp ? 'bg-teal-500/10 text-teal-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                    {stat.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    <span>{stat.trend}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                                <p className="text-3xl font-black text-white">{stat.value}</p>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {userInfo?.role === 'admin' && (
                    loading ? <ChartSkeleton /> : (
                        <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-white italic">Faculty Execution Load</h3>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">Total Lectures Handled</p>
                                </div>
                                <div className="p-4 bg-slate-800/50 rounded-3xl"><PieChart className="w-6 h-6 text-slate-400" /></div>
                            </div>

                            <div className="space-y-6">
                                {stats.facultyLoad.map((faculty, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-bold text-slate-300">{faculty.teacher}</span>
                                            <span className="font-black text-white">{faculty.count} Sessions</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(faculty.count / Math.max(...stats.facultyLoad.map(f => f.count))) * 100}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {stats.facultyLoad.length === 0 && (
                                    <div className="p-8 text-center text-slate-500 italic text-sm">No secondary instructor metrics available.</div>
                                )}
                            </div>
                        </div>
                    )
                )}

                {/* Operations Summary */}
                <div className="bg-slate-900 border border-slate-800 rounded-[40px] p-8 shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black text-white italic">Delivery Summary</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">Session Outcome Distribution</p>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-3xl"><Activity className="w-6 h-6 text-slate-400" /></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Completed", value: stats.completedLectures, color: "teal", sub: "Delivered Sessions" },
                            { label: "Cancelled", value: stats.cancelledLectures, color: "rose", sub: "Nulled Executions" },
                            { label: "Scheduled", value: stats.totalLectures - stats.completedLectures - stats.cancelledLectures, color: "blue", sub: "Upcoming Load" },
                            { label: "Total Population", value: stats.totalUsers.students + stats.totalUsers.teachers, color: "indigo", sub: "Identity Count" }
                        ].map((item, idx) => (
                            <div key={idx} className={`p-6 bg-slate-950/50 border border-slate-800 rounded-3xl space-y-2`}>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</p>
                                <p className={`text-4xl font-black text-${item.color}-500`}>{loading ? '0' : item.value}</p>
                                <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">{item.sub}</p>
                            </div>
                        ))}
                    </div>

                    <div className={`mt-8 p-6 ${stats.cancelledLectures > 0 ? 'bg-rose-500/5 border-rose-500/20' : 'bg-teal-500/5 border-teal-500/20'} rounded-3xl border flex items-center space-x-4 transition-all duration-500`}>
                        {stats.cancelledLectures > 0 ? (
                            <AlertTriangle className="w-10 h-10 text-rose-500/50 shrink-0" />
                        ) : (
                            <ShieldCheck className="w-10 h-10 text-teal-500/50 shrink-0" />
                        )}
                        <div>
                            <p className={`text-sm font-bold ${stats.cancelledLectures > 0 ? 'text-rose-400' : 'text-teal-400'}`}>
                                {stats.cancelledLectures > 0 ? 'Operational Anomaly Detected' : 'Institutional Protocols Stabilized'}
                            </p>
                            <p className="text-xs text-slate-500 leading-relaxed mt-1">
                                {stats.cancelledLectures > 0 
                                    ? 'Cancellation rate has exceeded the institutional baseline. Review room blocking protocols immediately.'
                                    : 'No logistical deviations detected in the current academic cycle. Operational integrity is maintained at 100% efficiency.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
