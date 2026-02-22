const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Attendance = require('../models/attendanceModel');
const Lecture = require('../models/lectureModel');
const User = require('../models/userModel');

// @desc    Mark attendance for a lecture (Teacher only)
// @route   POST /api/attendance
// @access  Private/Teacher
const markAttendance = asyncHandler(async (req, res) => {
    const { lectureId, students } = req.body; // students: [{ studentId, status }]

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
        res.status(404);
        throw new Error('Lecture not found');
    }

    // Check if attendance already marked
    const attendanceExists = await Attendance.findOne({ lecture: lectureId });
    if (attendanceExists) {
        res.status(400);
        throw new Error('Attendance already marked for this lecture');
    }

    const attendance = await Attendance.create({
        lecture: lectureId,
        course: lecture.course,
        batch: lecture.batch,
        students: students.map(s => ({
            student: s.studentId,
            status: s.status
        })),
        markedBy: req.user._id
    });

    if (attendance) {
        res.status(201).json(attendance);
    } else {
        res.status(400);
        throw new Error('Invalid attendance data');
    }
});

// @desc    Get attendance stats for a specific course and batch
// @route   GET /api/attendance/stats/:courseId/:batchId
// @access  Private/Teacher
const getAttendanceStats = asyncHandler(async (req, res) => {
    const { courseId, batchId } = req.params;

    // Aggregate to calculate percentages
    const stats = await Attendance.aggregate([
        { $match: { course: new mongoose.Types.ObjectId(courseId), batch: new mongoose.Types.ObjectId(batchId) } },
        { $unwind: '$students' },
        {
            $group: {
                _id: '$students.student',
                totalLectures: { $sum: 1 },
                presentLectures: {
                    $sum: { $cond: [{ $eq: ['$students.status', 'present'] }, 1, 0] }
                }
            }
        },
        {
            $project: {
                student: '$_id',
                totalLectures: 1,
                presentLectures: 1,
                percentage: {
                    $multiply: [{ $divide: ['$presentLectures', '$totalLectures'] }, 100]
                }
            }
        }
    ]);

    // Populate student names
    const populatedStats = await User.populate(stats, { path: 'student', select: 'name email' });

    res.json(populatedStats);
});

// @desc    Get attendance for a specific lecture
// @route   GET /api/attendance/lecture/:lectureId
// @access  Private
const getAttendanceByLecture = asyncHandler(async (req, res) => {
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
const getLowAttendanceStudents = asyncHandler(async (req, res) => {
    // Find all lectures by this teacher
    const teacherId = req.user._id;

    const stats = await Attendance.aggregate([
        { $match: { markedBy: teacherId } },
        { $unwind: '$students' },
        {
            $group: {
                _id: { student: '$students.student', course: '$course' },
                totalLectures: { $sum: 1 },
                presentLectures: {
                    $sum: { $cond: [{ $eq: ['$students.status', 'present'] }, 1, 0] }
                }
            }
        },
        {
            $project: {
                student: '$_id.student',
                course: '$_id.course',
                percentage: {
                    $multiply: [{ $divide: ['$presentLectures', '$totalLectures'] }, 100]
                }
            }
        },
        { $match: { percentage: { $lt: 75 } } }
    ]);

    const populatedStats = await User.populate(stats, { path: 'student', select: 'name email' });
    const finalStats = await mongoose.model('Course').populate(populatedStats, { path: 'course', select: 'name code' });

    res.json(finalStats);
});

// @desc    Get faculty load stats (Total lectures per teacher)
// @route   GET /api/attendance/faculty-load
// @access  Private/Admin
const getFacultyLoad = asyncHandler(async (req, res) => {
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
const getMyAttendanceStats = asyncHandler(async (req, res) => {
    const stats = await Attendance.aggregate([
        { $unwind: '$students' },
        { $match: { 'students.student': req.user._id } },
        {
            $group: {
                _id: null,
                totalLectures: { $sum: 1 },
                presentLectures: {
                    $sum: { $cond: [{ $eq: ['$students.status', 'present'] }, 1, 0] }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalLectures: 1,
                presentLectures: 1,
                absentLectures: { $subtract: ['$totalLectures', '$presentLectures'] },
                percentage: {
                    $cond: [
                        { $eq: ['$totalLectures', 0] },
                        0,
                        { $multiply: [{ $divide: ['$presentLectures', '$totalLectures'] }, 100] }
                    ]
                }
            }
        }
    ]);
    res.json(stats[0] || { totalLectures: 0, presentLectures: 0, absentLectures: 0, percentage: 0 });
});

module.exports = { markAttendance, getAttendanceStats, getAttendanceByLecture, getLowAttendanceStudents, getFacultyLoad, getMyAttendanceStats };
