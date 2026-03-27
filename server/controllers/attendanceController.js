import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import Attendance from '../models/attendanceModel.js';
import Lecture from '../models/lectureModel.js';
import User from '../models/userModel.js';
import Settings from '../models/settingsModel.js';
import AuditLog from '../models/auditLogModel.js';
import { sendAttendanceWarningEmail } from '../utils/emailService.js';

// @desc    Mark attendance for a lecture (Teacher only)
// @route   POST /api/attendance
// @access  Private/Teacher
export const markAttendance = asyncHandler(async (req, res) => {
    const { lectureId, students } = req.body; // students: [{ studentId, status }]

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        res.status(404);
        throw new Error('Lecture not found');
    }

    // Security check: Teacher can only mark attendance for their own lectures
    if (req.user.role === 'teacher' && lecture.teacher.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to mark attendance for this lecture');
    }

    // Check if attendance already marked
    let attendance = await Attendance.findOne({ lecture: lectureId });
    
    if (attendance) {
        // Update existing attendance
        attendance.students = students.map(s => ({
            student: s.studentId,
            status: s.status
        }));
        attendance.markedBy = req.user._id;
        await attendance.save();
    } else {
        // Create new attendance
        attendance = await Attendance.create({
            lecture: lectureId,
            subject: lecture.subject,
            batch: lecture.batch,
            students: students.map(s => ({
                student: s.studentId,
                status: s.status
            })),
            markedBy: req.user._id
        });
    }

    if (attendance) {
        // Mark lecture as attendance processed
        lecture.attendanceMarked = true;
        lecture.status = 'Completed'; // Optionally update status!
        await lecture.save();

        // Audit Log
        await AuditLog.create({
            user: req.user._id,
            action: 'MARK_ATTENDANCE',
            entity: 'Attendance',
            entityId: attendance._id,
            details: { lectureId, studentCount: students.length, updated: !!attendance.isNew },
            ipAddress: req.ip
        });

        res.status(201).json(attendance);
    } else {
        res.status(400);
        throw new Error('Invalid attendance data');
    }
});

// @desc    Get attendance stats for a specific subject and batch
// @route   GET /api/attendance/stats/:subject/:batchId
// @access  Private/Teacher
export const getAttendanceStats = asyncHandler(async (req, res) => {
    const { subject, batchId } = req.params;

    // Aggregate to calculate percentages (with weight: Lab=4, Lecture=1)
    const stats = await Attendance.aggregate([
        { $match: { subject: subject, batch: new mongoose.Types.ObjectId(batchId) } },
        {
            $lookup: {
                from: 'lectures',
                localField: 'lecture',
                foreignField: '_id',
                as: 'lectureInfo'
            }
        },
        { $unwind: '$lectureInfo' },
        { $unwind: '$students' },
        {
            $group: {
                _id: { student: '$students.student', batch: '$batch' },
                totalWeight: { $sum: { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] } },
                presentWeight: {
                    $sum: {
                        $cond: [
                            { $eq: ['$students.status', 'present'] },
                            { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] },
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                student: '$_id.student',
                batch: '$_id.batch',
                totalLectures: '$totalWeight',
                presentLectures: '$presentWeight',
                percentage: {
                    $cond: [
                        { $eq: ['$totalWeight', 0] },
                        0,
                        { $multiply: [{ $divide: ['$presentWeight', '$totalWeight'] }, 100] }
                    ]
                }
            }
        }
    ]);

    // Populate student names and batches
    const populatedStats = await mongoose.model('User').populate(stats, { path: 'student', select: 'name email' });
    const finalStats = await mongoose.model('Batch').populate(populatedStats, { path: 'batch', select: 'name' });

    res.json(finalStats);
});

// @desc    Get attendance for a specific lecture
// @route   GET /api/attendance/lecture/:lectureId
// @access  Private
export const getAttendanceByLecture = asyncHandler(async (req, res) => {
    const attendance = await Attendance.findOne({ lecture: req.params.lectureId })
        .populate('students.student', 'name email');

    if (attendance) {
        res.json(attendance);
    } else {
        res.status(404);
        throw new Error('Attendance records not found');
    }
});

// @desc    Get students with < 75% attendance for a teacher's courses
// @route   GET /api/attendance/low-attendance
// @access  Private/Teacher
export const getLowAttendanceStudents = asyncHandler(async (req, res) => {
    // Find all lectures by this teacher
    const teacherId = req.user._id;

    const stats = await Attendance.aggregate([
        { $match: { markedBy: teacherId } },
        {
            $lookup: {
                from: 'lectures',
                localField: 'lecture',
                foreignField: '_id',
                as: 'lectureInfo'
            }
        },
        { $unwind: '$lectureInfo' },
        { $unwind: '$students' },
        {
            $group: {
                _id: { student: '$students.student', subject: '$subject' },
                totalWeight: { $sum: { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] } },
                presentWeight: {
                    $sum: {
                        $cond: [
                            { $eq: ['$students.status', 'present'] },
                            { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] },
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                student: '$_id.student',
                subject: '$_id.subject',
                percentage: {
                    $cond: [
                        { $eq: ['$totalWeight', 0] },
                        0,
                        { $multiply: [{ $divide: ['$presentWeight', '$totalWeight'] }, 100] }
                    ]
                }
            }
        },
        { $match: { percentage: { $lt: 75 } } }
    ]);

    const populatedStats = await User.populate(stats, { path: 'student', select: 'name email' });

    res.json(populatedStats);
});

// @desc    Get all students with < X% attendance globally
// @route   GET /api/attendance/global-defaulters
// @access  Private/Admin
export const getGlobalDefaulters = asyncHandler(async (req, res) => {
    const threshold = parseInt(req.query.threshold) || 75;

    const stats = await Attendance.aggregate([
        {
            $lookup: {
                from: 'lectures',
                localField: 'lecture',
                foreignField: '_id',
                as: 'lectureInfo'
            }
        },
        { $unwind: '$lectureInfo' },
        { $unwind: '$students' },
        {
            $group: {
                _id: { student: '$students.student', batch: '$batch' },
                totalWeight: { $sum: { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] } },
                presentWeight: {
                    $sum: {
                        $cond: [
                            { $eq: ['$students.status', 'present'] },
                            { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] },
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                student: '$_id.student',
                batch: '$_id.batch',
                percentage: {
                    $cond: [
                        { $eq: ['$totalWeight', 0] },
                        0,
                        { $multiply: [{ $divide: ['$presentWeight', '$totalWeight'] }, 100] }
                    ]
                },
                totalLectures: '$totalWeight',
                presentLectures: '$presentWeight'
            }
        },
        { $match: { percentage: { $lt: threshold } } },
        { $sort: { percentage: 1 } }
    ]);

    const populatedStats = await User.populate(stats, { path: 'student', select: 'name email' });
    const finalStats = await mongoose.model('Batch').populate(populatedStats, { path: 'batch', select: 'name division' });

    res.json(finalStats);
});

// @desc    Get faculty load stats (Total lectures per teacher)
// @route   GET /api/attendance/faculty-load
// @access  Private/Admin
export const getFacultyLoad = asyncHandler(async (req, res) => {
    const stats = await Lecture.aggregate([
        {
            $group: {
                _id: '$teacher',
                lectureCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'teacherInfo'
            }
        },
        { $unwind: '$teacherInfo' },
        {
            $project: {
                teacher: '$teacherInfo.name',
                count: '$lectureCount'
            }
        }
    ]);
    res.json(stats);
});

// @desc    Get logged in student attendance stats
// @route   GET /api/attendance/my-stats
// @access  Private
export const getMyAttendanceStats = asyncHandler(async (req, res) => {
    const stats = await Attendance.aggregate([
        {
            $lookup: {
                from: 'lectures',
                localField: 'lecture',
                foreignField: '_id',
                as: 'lectureInfo'
            }
        },
        { $unwind: '$lectureInfo' },
        { $unwind: '$students' },
        { $match: { 'students.student': req.user._id } },
        {
            $group: {
                _id: null,
                totalWeight: { $sum: { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] } },
                presentWeight: {
                    $sum: {
                        $cond: [
                            { $eq: ['$students.status', 'present'] },
                            { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] },
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalLectures: '$totalWeight',
                presentLectures: '$presentWeight',
                absentLectures: { $subtract: ['$totalWeight', '$presentWeight'] },
                percentage: {
                    $cond: [
                        { $eq: ['$totalWeight', 0] },
                        0,
                        { $multiply: [{ $divide: ['$presentWeight', '$totalWeight'] }, 100] }
                    ]
                }
            }
        }
    ]);
    res.json(stats[0] || { totalLectures: 0, presentLectures: 0, absentLectures: 0, percentage: 0 });
});
// @desc    Get logged in student attendance stats by subject
// @route   GET /api/attendance/subject-wise
// @access  Private
export const getSubjectWiseAttendance = asyncHandler(async (req, res) => {
    const stats = await Attendance.aggregate([
        {
            $lookup: {
                from: 'lectures',
                localField: 'lecture',
                foreignField: '_id',
                as: 'lectureInfo'
            }
        },
        { $unwind: '$lectureInfo' },
        { $unwind: '$students' },
        { $match: { 'students.student': req.user._id } },
        {
            $group: {
                _id: '$subject',
                totalWeight: { $sum: { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] } },
                presentWeight: {
                    $sum: {
                        $cond: [
                            { $eq: ['$students.status', 'present'] },
                            { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] },
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                subject: '$_id',
                totalLectures: '$totalWeight',
                presentLectures: '$presentWeight',
                absentLectures: { $subtract: ['$totalWeight', '$presentWeight'] },
                percentage: {
                    $cond: [
                        { $eq: ['$totalWeight', 0] },
                        0,
                        { $multiply: [{ $divide: ['$presentWeight', '$totalWeight'] }, 100] }
                    ]
                }
            }
        },
        { $sort: { subject: 1 } }
    ]);
    res.json(stats);
});

// @desc    Send attendance warning emails to parents
// @route   POST /api/attendance/send-warnings
// @access  Private/Admin
export const sendAttendanceWarning = asyncHandler(async (req, res) => {
    const { batchId } = req.body;

    // Get current threshold from settings
    const currentSettings = await Settings.findOne() || { attendanceThreshold: 75 };
    const threshold = currentSettings.attendanceThreshold;

    // 1. Get stats for students (potentially filtered by batch)
    const matchStage = batchId ? { batch: new mongoose.Types.ObjectId(batchId) } : {};

    const stats = await Attendance.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: 'lectures',
                localField: 'lecture',
                foreignField: '_id',
                as: 'lectureInfo'
            }
        },
        { $unwind: '$lectureInfo' },
        { $unwind: '$students' },
        {
            $group: {
                _id: '$students.student',
                totalWeight: { $sum: { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] } },
                presentWeight: {
                    $sum: {
                        $cond: [
                            { $eq: ['$students.status', 'present'] },
                            { $cond: [{ $eq: ['$lectureInfo.type', 'Lab'] }, 4, 1] },
                            0
                        ]
                    }
                }
            }
        },
        {
            $project: {
                student: '$_id',
                percentage: {
                    $cond: [
                        { $eq: ['$totalWeight', 0] },
                        0,
                        { $multiply: [{ $divide: ['$presentWeight', '$totalWeight'] }, 100] }
                    ]
                }
            }
        },
        { $match: { percentage: { $lt: threshold } } }
    ]);

    // 2. Populate student info (including parentEmail)
    const populatedStats = await User.populate(stats, { 
        path: 'student', 
        select: 'name email parentEmail' 
    });

    // 3. Send emails
    let sentCount = 0;
    let failedCount = 0;
    let noEmailCount = 0;

    for (const stat of populatedStats) {
        if (stat.student.parentEmail) {
            try {
                await sendAttendanceWarningEmail(
                    stat.student.parentEmail,
                    stat.student.name,
                    stat.percentage,
                    threshold
                );
                sentCount++;
            } catch (error) {
                console.error(`Failed to send warning email to ${stat.student.parentEmail}:`, error);
                failedCount++;
            }
        } else {
            noEmailCount++;
        }
    }

    res.json({
        message: `Processed ${populatedStats.length} defaulters. Emails sent: ${sentCount}, Failed: ${failedCount}, No parent email: ${noEmailCount}`,
        defaultersCount: populatedStats.length,
        sentCount,
        failedCount,
        noEmailCount
    });
});

