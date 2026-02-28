const asyncHandler = require('express-async-handler');
const Lecture = require('../models/lectureModel');
const User = require('../models/userModel');
const Course = require('../models/courseModel');

// @desc    Suggest substitutes for a lecture slot
// @route   GET /api/lectures/substitutes/:lectureId
// @access  Private/Admin
const suggestSubstitutes = asyncHandler(async (req, res) => {
    const lecture = await Lecture.findById(req.params.lectureId).populate('course');

    if (!lecture) {
        res.status(404);
        throw new Error('Lecture not found');
    }

    const { startTime, endTime, teacher: originalTeacher } = lecture;
    // 1. Find all teachers
    const potentialSubstitutes = await User.find({
        role: 'teacher',
        _id: { $ne: originalTeacher } // Exclude the original teacher
    }).select('name email subjects');

    // 2. Filter out teachers who have a conflicting lecture
    const availableSubstitutes = [];

    for (const teacher of potentialSubstitutes) {
        const hasConflict = await Lecture.findOne({
            teacher: teacher._id,
            status: { $ne: 'Cancelled' },
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        });

        if (!hasConflict) {
            availableSubstitutes.push(teacher);
        }
    }

    res.json(availableSubstitutes);
});

module.exports = { suggestSubstitutes };
