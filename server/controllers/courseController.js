const asyncHandler = require('express-async-handler');
const Course = require('../models/courseModel');

// @desc    Add syllabus unit to course
// @route   POST /api/courses/:id/syllabus
// @access  Private/Admin
const addSyllabusUnit = asyncHandler(async (req, res) => {
    const { unitNumber, title, description } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
        course.syllabus.push({ unitNumber, title, description });
        await course.save();
        res.status(201).json(course);
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// @desc    Update syllabus completion status
// @route   PUT /api/courses/:id/syllabus/:unitId
// @access  Private/Teacher
const updateSyllabusProgress = asyncHandler(async (req, res) => {
    const { isCompleted } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
        const unit = course.syllabus.id(req.params.unitId);
        if (unit) {
            unit.isCompleted = isCompleted;
            await course.save();
            res.json(course);
        } else {
            res.status(404);
            throw new Error('Syllabus unit not found');
        }
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

// @desc    Get syllabus status for a course
// @route   GET /api/courses/:id/syllabus
// @access  Private
const getSyllabusStatus = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
        res.json(course.syllabus);
    } else {
        res.status(404);
        throw new Error('Course not found');
    }
});

module.exports = { addSyllabusUnit, updateSyllabusProgress, getSyllabusStatus };
