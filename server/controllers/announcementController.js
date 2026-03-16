import asyncHandler from 'express-async-handler';
import Announcement from '../models/announcementModel.js';
import { getIO } from '../socket.js';

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private/Admin
export const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, content, targetBatch, targetAudience, priority, expiresAt } = req.body;

    const announcement = await Announcement.create({
        title,
        content,
        author: req.user._id,
        targetBatch: targetBatch || null,
        targetAudience: targetAudience || 'all',
        priority: priority || 'medium',
        expiresAt
    });

    if (announcement) {
        const io = getIO();
        // Emit real-time notification
        io.emit('new_announcement', {
            title: announcement.title,
            priority: announcement.priority,
            targetAudience: announcement.targetAudience,
            targetBatch: announcement.targetBatch
        });

        res.status(201).json(announcement);
    } else {
        res.status(400);
        throw new Error('Invalid announcement data');
    }
});

// @desc    Get announcements based on role/batch
// @route   GET /api/announcements
// @access  Private
export const getAnnouncements = asyncHandler(async (req, res) => {
    const user = req.user;
    let query = {};

    // Logic to filter based on role/batch
    if (user.role === 'student') {
        query = {
            $and: [
                { $or: [{ targetAudience: 'all' }, { targetAudience: 'students' }] },
                { $or: [{ targetBatch: null }, { targetBatch: user.batch }] }
            ]
        };
    } else if (user.role === 'teacher') {
        query = {
            targetAudience: { $in: ['all', 'teachers'] }
        };
    }
    // Admin sees everything

    const announcements = await Announcement.find(query)
        .populate('author', 'name')
        .populate('targetBatch', 'name')
        .sort({ createdAt: -1 });

    res.json(announcements);
});

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
export const deleteAnnouncement = asyncHandler(async (req, res) => {
    const announcement = await Announcement.findById(req.params.id);

    if (announcement) {
        await announcement.deleteOne();
        res.json({ message: 'Announcement removed' });
    } else {
        res.status(404);
        throw new Error('Announcement not found');
    }
});
