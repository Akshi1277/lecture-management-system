import asyncHandler from 'express-async-handler';
import Lecture from '../models/lectureModel.js';
import User from '../models/userModel.js';


// @desc    Suggest substitutes for a lecture slot
// @route   GET /api/lectures/substitutes/:lectureId
// @access  Private/Admin
export const suggestSubstitutes = asyncHandler(async (req, res) => {
    const lecture = await Lecture.findById(req.params.lectureId);

    if (!lecture) {
        res.status(404);
        throw new Error('Lecture not found');
    }

    const { startTime, endTime, teacher: originalTeacher, batch } = lecture;

    // 1. Identify all teachers who have ever been scheduled for this specific batch
    const batchTeachers = await Lecture.distinct('teacher', { batch: batch });

    // 2. Find all teachers who are in this batch set, excluding the original teacher
    const potentialSubstitutes = await User.find({
        role: 'teacher',
        _id: { $in: batchTeachers, $ne: originalTeacher } // Exclude the original teacher
    }).select('name email subjects');

    // 3. Filter out teachers who have a conflicting lecture
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

// @desc    Get all pending substitution requests
// @route   GET /api/lectures/substitutions/pending
// @access  Private/Admin
export const getPendingSubstitutions = asyncHandler(async (req, res) => {
    const pendingRequests = await Lecture.find({
        isSubstitutionRequested: true,
        status: 'Scheduled'
    }).populate('teacher', 'name email').populate('batch', 'name');

    res.json(pendingRequests);
});

// @desc    Request a substitution for a lecture
// @route   POST /api/lectures/:id/request-substitution
// @access  Private/Teacher
export const requestSubstitution = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
        res.status(404);
        throw new Error('Lecture not found');
    }

    if (lecture.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to request proxy for this lecture');
    }

    lecture.isSubstitutionRequested = true;
    lecture.substitutionReason = reason || 'Emergency Leave';

    await lecture.save();

    // Optionally emit a socket event to admins here

    res.json({ message: 'Substitution requested successfully', lecture });
});
