import asyncHandler from 'express-async-handler';
import Exam from '../models/examModel.js';
import Lecture from '../models/lectureModel.js';

// @desc    Schedule new exam
// @route   POST /api/exams
// @access  Private/Admin
export const createExam = asyncHandler(async (req, res) => {
    const { course, batch, title, type, startTime, endTime, classroom, supervisor } = req.body;

    // 1. Check for conflicts with existing lectures
    const lectureConflict = await Lecture.findOne({
        $or: [
            { classroom, startTime: { $lt: endTime }, endTime: { $gt: startTime } },
            { teacher: supervisor, startTime: { $lt: endTime }, endTime: { $gt: startTime } },
            { batch, startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    });

    if (lectureConflict) {
        res.status(400);
        throw new Error('Conflict found: A lecture is already scheduled in this slot for the room, batch, or supervisor.');
    }

    // 2. Check for conflicts with other exams
    const examConflict = await Exam.findOne({
        $or: [
            { classroom, startTime: { $lt: endTime }, endTime: { $gt: startTime } },
            { supervisor, startTime: { $lt: endTime }, endTime: { $gt: startTime } },
            { batch, startTime: { $lt: endTime }, endTime: { $gt: startTime } }
        ]
    });

    if (examConflict) {
        res.status(400);
        throw new Error('Conflict found: Another exam is already scheduled in this slot.');
    }

    const exam = await Exam.create({
        course,
        batch,
        title,
        type,
        startTime,
        endTime,
        classroom,
        supervisor
    });

    res.status(201).json(exam);
});

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
export const getExams = asyncHandler(async (req, res) => {
    const exams = await Exam.find({})
        .populate('course', 'name code')
        .populate('batch', 'name')
        .populate('supervisor', 'name email');
    res.json(exams);
});
