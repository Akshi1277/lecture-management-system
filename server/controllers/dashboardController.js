import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import Batch from '../models/batchModel.js';
import Lecture from '../models/lectureModel.js';
import Attendance from '../models/attendanceModel.js';
import Department from '../models/departmentModel.js';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req, res) => {
    // 1. Stats Cards
    const studentCount = await User.countDocuments({ role: 'student' });
    const teacherCount = await User.countDocuments({ role: 'teacher' });
    const courseCount = await Course.countDocuments();
    const batchCount = await Batch.countDocuments();
    const departmentCount = await Department.countDocuments();
    const totalUsers = studentCount + teacherCount;

    // 2. Today's Schedule
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLectures = await Lecture.find({
        startTime: {
            $gte: today,
            $lt: tomorrow
        }
    })
        .populate('teacher', 'name')
        .populate('course', 'name')
        .populate('batch', 'name')
        .sort({ startTime: 1 });

    // 3. Attendance Trends (Simplified average for now)
    // We'll calculate average attendance for the last 7 days or any recent records
    const attendanceRecords = await Attendance.find().limit(50); // Get recent records

    let totalAttendancePercentage = 0;
    if (attendanceRecords.length > 0) {
        attendanceRecords.forEach(record => {
            const presentCount = record.students.filter(s => s.status === 'present').length;
            const percentage = (presentCount / record.students.length) * 100;
            totalAttendancePercentage += percentage;
        });
        totalAttendancePercentage = totalAttendancePercentage / attendanceRecords.length;
    }

    res.json({
        stats: {
            students: studentCount,
            teachers: teacherCount,
            courses: courseCount,
            batches: batchCount,
            departments: departmentCount,
            totalUsers: totalUsers
        },
        todayLectures,
        attendanceTrend: Math.round(totalAttendancePercentage) || 0
    });
});
