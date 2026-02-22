"use client";
import { useSelector } from "react-redux";
import AdminDashboard from "./admin/page";
import TeacherDashboard from "./teacher/page";
import StudentDashboard from "./student/page";

export default function DashboardSummary() {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) return null;

  // Render the appropriate dashboard based on user role
  switch (userInfo.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return (
        <div className="flex items-center justify-center h-full text-slate-400">
          Select a menu item from the sidebar to begin.
        </div>
      );
  }
}
