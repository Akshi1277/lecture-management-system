import asyncHandler from 'express-async-handler';
import RoomBlock from '../models/roomBlockModel.js';
import Lecture from '../models/lectureModel.js';
import { getIO } from '../socket.js';

// @desc    Create a room block (Exam Lockdown)
// @route   POST /api/rooms/block
// @access  Private/Admin
export const blockRoom = asyncHandler(async (req, res) => {
    const { room, startTime, endTime, reason, action } = req.body;

    if (!room || !startTime || !endTime || !reason || !action) {
        res.status(400);
        throw new Error('Please provide room, startTime, endTime, reason, and action (cancel/relocate)');
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // 1. Create the RoomBlock
    const roomBlock = await RoomBlock.create({
        room,
        startTime: start,
        endTime: end,
        reason,
        createdBy: req.user._id
    });

    // 2. Find all affected lectures
    const affectedLectures = await Lecture.find({
        classroom: room,
        startTime: { $lt: end },
        endTime: { $gt: start },
        status: 'Scheduled'
    }).populate('teacher', 'name email').populate('batch', 'name');

    // 3. Process the action on affected lectures
    const updatedLectureIds = [];
    const notifications = [];

    for (const lecture of affectedLectures) {
        if (action === 'cancel') {
            lecture.status = 'Cancelled';
            lecture.conflictReason = reason;

            notifications.push({
                type: 'CANCELLATION',
                lectureId: lecture._id,
                message: `Lecture scheduled in ${room} at ${start.toLocaleTimeString()} has been CANCELLED due to: ${reason}.`,
                teacherId: lecture.teacher._id,
                batchId: lecture.batch._id
            });

        } else if (action === 'relocate') {
            const { newRoom } = req.body;
            if (!newRoom) {
                res.status(400);
                throw new Error('newRoom is required when action is relocate');
            }
            lecture.status = 'Relocated';
            lecture.relocatedTo = newRoom;
            lecture.conflictReason = reason;

            notifications.push({
                type: 'RELOCATION',
                lectureId: lecture._id,
                message: `Lecture scheduled in ${room} at ${start.toLocaleTimeString()} has been RELOCATED to ${newRoom} due to: ${reason}.`,
                teacherId: lecture.teacher._id,
                batchId: lecture.batch._id
            });
        }

        await lecture.save();
        updatedLectureIds.push(lecture._id);
    }

    // 4. Emit WebSocket events for real-time updates
    const io = getIO();

    // Broadcast to everyone that the schedule has changed (admin dashboard refresh)
    io.emit('scheduleUpdated', {
        roomId: room,
        action,
        affectedCount: affectedLectures.length
    });

    // Depending on your socket setup, you might want to target specific users
    // For now, we emit the specific notifications
    notifications.forEach(notif => {
        io.emit('lectureNotification', notif);
    });

    res.status(201).json({
        message: 'Room blocked successfully',
        roomBlock,
        affectedCount: affectedLectures.length,
        actionTaken: action
    });
});

// @desc    Get all active room blocks
// @route   GET /api/rooms/blocks
// @access  Private/Admin
export const getActiveBlocks = asyncHandler(async (req, res) => {
    const activeBlocks = await RoomBlock.find({
        endTime: { $gte: new Date() }
    }).populate('createdBy', 'name');

    res.json(activeBlocks);
});
