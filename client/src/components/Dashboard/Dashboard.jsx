"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Users, BookOpen, TrendingUp, Clock, FileText, CheckCircle, Calendar, BarChart3, Download, Award } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setActiveModal, clearToasts } from "@/redux/slices/uiSlice";
import { logout } from "@/redux/slices/authSlice";
import { fetchAdminDashboard, fetchMyLectures } from "@/redux/slices/dashboardSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { userInfo: user } = useSelector(state => state.auth);
  const { adminData: dashboardData, myLectures, loading } = useSelector(state => state.dashboard);
  
  const lectures = user?.role === "admin" ? (dashboardData?.todayLectures || []) : myLectures;

  const handleAction = (modalId) => {
    dispatch(setActiveModal(modalId));
  };

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (user.role === "admin") {
      dispatch(fetchAdminDashboard());
    } else {
      dispatch(fetchMyLectures());
    }
  }, [user, dispatch]);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-2xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 relative overflow-hidden py-12 px-6">
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              {user?.name}'s Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Welcome back! You are logged in as <b className="text-teal-400">{user?.role}</b></p>
          </div>
          <button
            onClick={() => {
              dispatch(logout());
              dispatch(clearToasts());
              window.location.href = "/login";
            }}
            className="mt-4 md:mt-0 px-6 py-2 bg-red-500/20 text-red-200 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all font-medium"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: user?.role === "admin" ? "Total Students" : "Active Lectures",
              value: user?.role === "admin" ? (dashboardData?.stats?.students || 0) : lectures.length,
              icon: user?.role === "admin" ? <Users className="text-teal-400" /> : <BookOpen className="text-teal-400" />,
              border: "border-teal-500/20"
            },
            {
              title: user?.role === "admin" ? "Total Teachers" : "User Role",
              value: user?.role === "admin" ? (dashboardData?.stats?.teachers || 0) : user?.role?.toUpperCase(),
              icon: <Users className="text-blue-400" />,
              border: "border-blue-500/20"
            },
            {
              title: user?.role === "admin" ? "Total Batches" : "Department",
              value: user?.role === "admin"
                ? (dashboardData?.stats?.batches || 0)
                : (Array.isArray(user?.department)
                  ? user.department.map(d => d.name || d).join(', ')
                  : (user?.department?.name || user?.department || "N/A")),
              icon: <FileText className="text-orange-400" />,
              border: "border-orange-500/20"
            },
            {
              title: user?.role === "admin" ? "Attendance Rate" : "Engagement",
              value: user?.role === "admin" ? `${dashboardData?.attendanceTrend || 0}%` : "94%",
              icon: <TrendingUp className="text-purple-400" />,
            }
          ].map((stat, i) => (
            <div key={i} className={`bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border ${stat.border}`}>
              <div className="flex items-center justify-between">
                <div>{stat.icon}</div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.title}</div>
                </div>
              </div>
              {stat.title === "Attendance Rate" && (
                <div className="mt-4 h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: stat.value }}
                    className="h-full bg-teal-500"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Actions & Lectures */}
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-teal-500/20 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {(user?.role === "admin" ? [
                  { title: "Schedule Lecture", icon: <Plus />, color: "bg-teal-500", modalId: "assignLecture" },
                  { title: "Enroll User", icon: <Users />, color: "bg-blue-500", modalId: "manageUsers" }
                ] : user?.role === "teacher" ? [
                  { title: "Mark Attendance", icon: <CheckCircle />, color: "bg-emerald-500", modalId: "markAttendance" },
                  { title: "Update Schedule", icon: <Calendar />, color: "bg-teal-500", modalId: "assignLecture" }
                ] : [
                  { title: "View Attendance", icon: <BarChart3 />, color: "bg-teal-500", modalId: null },
                  { title: "Learning Resources", icon: <Download />, color: "bg-blue-500", modalId: null }
                ]).map((action, i) => (
                  <button
                    key={i}
                    onClick={() => action.modalId && handleAction(action.modalId)}
                    className="flex flex-col items-center p-6 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-teal-400 hover:bg-slate-800 transition-all group"
                  >
                    <div className={`p-3 rounded-lg ${action.color} text-white mb-3 group-hover:scale-110 transition-transform`}>{action.icon}</div>
                    <span className="text-sm text-slate-300 font-medium">{action.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-teal-500/20">
              <h3 className="text-xl font-bold text-white mb-6">
                {user?.role === "admin" ? "Today's Schedule" : "Scheduled Lectures"}
              </h3>
              <div className="space-y-4">
                {lectures.map((l, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-700 bg-slate-900/40 hover:border-teal-500/50 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-white group-hover:text-teal-400 transition-colors">{l.title}</h4>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded-full font-bold uppercase tracking-widest">{l.status}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${l.type === 'Lab' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {l.type}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 mt-3">
                      <p className="text-xs text-slate-400 flex items-center font-bold">
                        <BookOpen className="w-3 h-3 mr-2 text-teal-400" /> {l.subject} • {l.batch?.name || "All Batches"}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center">
                        <Clock className="w-3 h-3 mr-2 text-slate-400" /> {new Date(l.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(l.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-teal-400/80 flex items-center font-medium">
                        <Users className="w-3 h-3 mr-2 text-teal-500" /> {l.teacher?.name || "Internal"}
                      </p>
                    </div>
                  </div>
                ))}
                {lectures.length === 0 && (
                  <p className="text-center text-slate-500 italic py-8 border-2 border-dashed border-slate-800 rounded-xl">
                    No lectures scheduled for {user?.role === "admin" ? "today" : "now"}.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Activity & Performance */}
          <div className="space-y-8">
            <div className="bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl border border-teal-500/20">
              <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
              <p className="text-sm text-slate-500 italic">No recent activity found. System is waiting for new updates.</p>
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-emerald-700 p-8 rounded-2xl text-white shadow-xl shadow-teal-500/10">
              <div className="flex items-center mb-4 text-white/90">
                <Award className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold">Top Performance</h3>
              </div>
              <p className="text-teal-100 leading-relaxed">
                Congratulations! You have maintained a 95% engagement rate this semester. You're among the top 10% of users on EduSync.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}