import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Batch from '../models/batchModel.js';
import Lecture from '../models/lectureModel.js';
import Attendance from '../models/attendanceModel.js';
import Department from '../models/departmentModel.js';
import Settings from '../models/settingsModel.js';
import { sendAttendanceWarningEmail } from '../utils/emailService.js';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req, res) => {
    const userDepts = req.user.department || [];
    const isSuperAdmin = req.user.role === 'superadmin';

    // Build filters
    const userFilter = isSuperAdmin ? {} : { department: { $in: userDepts } };
    const batchFilter = isSuperAdmin ? {} : { department: { $in: userDepts } };
    const lectureFilter = isSuperAdmin ? {} : { department: { $in: userDepts } };

    // 1. Stats Cards
    const studentCount = await User.countDocuments({ ...userFilter, role: 'student' });
    const teacherCount = await User.countDocuments({ ...userFilter, role: 'teacher' });
    const batchCount = await Batch.countDocuments(batchFilter);
    const departmentCount = isSuperAdmin ? await Department.countDocuments() : userDepts.length;
    const totalUsers = studentCount + teacherCount;

    // 2. Today's Schedule
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLectures = await Lecture.find({
        ...lectureFilter,
        startTime: { $gte: today, $lt: tomorrow }
    })
        .populate('teacher', 'name')
        .populate('batch', 'name')
        .sort({ startTime: 1 });

    // 3. Attendance Trends
    const attendanceRecords = await Attendance.find(lectureFilter).limit(50); 

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
            batches: batchCount,
            departments: departmentCount,
            totalUsers: totalUsers
        },
        todayLectures,
        attendanceTrend: Math.round(totalAttendancePercentage) || 0
    });
});

// @desc    Get system settings
// @route   GET /api/dashboard/settings
// @access  Private/Admin
export const getSystemSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({});
    }
    res.json(settings);
});

// @desc    Update system settings
// @route   PUT /api/dashboard/settings
// @access  Private/Admin
export const updateSystemSettings = asyncHandler(async (req, res) => {
    // ONLY Super Admin can change global institutional parameters
    if (req.user.role !== 'superadmin') {
        res.status(403);
        throw new Error('Only Super Admin can change global system parameters');
    }

    const { attendanceThreshold, labWeight, systemName } = req.body;
    let settings = await Settings.findOne();
    
    if (settings) {
        settings.attendanceThreshold = attendanceThreshold ?? settings.attendanceThreshold;
        settings.labWeight = labWeight ?? settings.labWeight;
        settings.systemName = systemName ?? settings.systemName;
        await settings.save();
    } else {
        settings = await Settings.create({ attendanceThreshold, labWeight, systemName });
    }
    
    res.json(settings);
});

// @desc    Send attendance warnings to parents (Departmental for HODs, Global for Super Admin)
// @route   POST /api/dashboard/attendance-warnings
// @access  Private/Admin
export const sendAttendanceWarnings = asyncHandler(async (req, res) => {
    const isSuperAdmin = req.user.role === 'superadmin';
    const settings = await Settings.findOne() || { attendanceThreshold: 75, labWeight: 4 };
    const { attendanceThreshold, labWeight } = settings;

    // Filter students: Super Admin gets all, HOD gets only their department
    const studentFilter = isSuperAdmin 
        ? { role: 'student' } 
        : { role: 'student', department: { $in: req.user.department } };

    const students = await User.find(studentFilter).select('name email parentEmail department');
    
    let sentCount = 0;
    const errors = [];

    for (const student of students) {
        // Calculate student's weighted attendance
        const attendanceRecords = await Attendance.find({ 'students.student': student._id })
            .populate('lecture', 'type');

        if (attendanceRecords.length === 0) continue;

        let totalWeightedSlots = 0;
        let presentWeightedSlots = 0;

        attendanceRecords.forEach(record => {
            const weight = record.lecture?.type === 'Lab' ? labWeight : 1;
            totalWeightedSlots += weight;

            const studentEntry = record.students.find(s => s.student.toString() === student._id.toString());
            if (studentEntry && studentEntry.status === 'present') {
                presentWeightedSlots += weight;
            }
        });

        const attendancePercentage = (presentWeightedSlots / totalWeightedSlots) * 100;

        if (attendancePercentage < attendanceThreshold && student.parentEmail) {
            try {
                await sendAttendanceWarningEmail(
                    student.parentEmail, 
                    student.name, 
                    attendancePercentage, 
                    attendanceThreshold
                );
                sentCount++;
            } catch (err) {
                errors.push(`${student.name}: ${err.message}`);
            }
        }
    }

    res.json({ 
        message: isSuperAdmin 
            ? `Global analysis complete. Warning emails dispatched to ${sentCount} parents.`
            : `${req.user.department} analysis complete. Warning emails dispatched to ${sentCount} students.`,
        sentCount,
        analyzedCount: students.length
    });
});
