import asyncHandler from 'express-async-handler';
import Attendance from '../models/attendanceModel.js';
import User from '../models/userModel.js';
import Lecture from '../models/lectureModel.js';
import Batch from '../models/batchModel.js';

// @desc    Get data for comprehensive attendance report by batch
// @route   GET /api/reports/attendance/:batchId
// @access  Private/Admin
export const getBatchAttendanceReport = asyncHandler(async (req, res) => {
    const { batchId } = req.params;

    const students = await User.find({ batch: batchId, role: 'student' }).select('name email');
    const lectures = await Lecture.find({ batch: batchId }).sort({ startTime: 1 });
    const attendances = await Attendance.find({ lecture: { $in: lectures.map(l => l._id) } });

    const reportData = students.map(student => {
        let attended = 0;
        let total = lectures.length;
        
        attendances.forEach(att => {
            const record = att.students.find(s => s.student.toString() === student._id.toString());
            if (record && record.status === 'present') attended++;
        });

        return {
            name: student.name,
            email: student.email,
            attended,
            total,
            percentage: total > 0 ? ((attended / total) * 100).toFixed(2) : 0
        };
    });

    res.json(reportData);
});

// @desc    Get overall faculty workload report
// @route   GET /api/reports/faculty-workload
// @access  Private/Admin
export const getFacultyWorkloadReport = asyncHandler(async (req, res) => {
    const teachers = await User.find({ role: 'teacher' }).select('name subjects');
    
    const workload = await Promise.all(teachers.map(async (t) => {
        const lectureCount = await Lecture.countDocuments({ teacher: t._id });
        const labCount = await Lecture.countDocuments({ teacher: t._id, type: 'Lab' });
        
        return {
            name: t.name,
            subjects: t.subjects,
            totalLectures: lectureCount,
            labs: labCount,
            theory: lectureCount - labCount
        };
    }));

    res.json(workload);
});

// @desc    Get system-wide summary for dashboard report
// @route   GET /api/reports/system-summary
// @access  Private/Admin
export const getSystemSummary = asyncHandler(async (req, res) => {
    const studentCount = await User.countDocuments({ role: 'student' });
    const teacherCount = await User.countDocuments({ role: 'teacher' });
    const batchCount = await Batch.countDocuments();
    const totalLectures = await Lecture.countDocuments();
    
    res.json({
        students: studentCount,
        teachers: teacherCount,
        batches: batchCount,
        totalLectures
    });
});
