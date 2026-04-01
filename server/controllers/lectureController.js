import asyncHandler from 'express-async-handler';
import Lecture from '../models/lectureModel.js';
import Batch from '../models/batchModel.js';
import Classroom from '../models/classroomModel.js';
import AuditLog from '../models/auditLogModel.js';
import { lectureSchema } from '../utils/validators.js';
import cloudinary from '../config/cloudinary.js';

// Helper to check for scheduling conflicts
const checkForConflicts = async (data, excludeId = null) => {
    const { teacher, classroom, batch, division, startTime, endTime } = data;
    
    const query = {
        $and: [
            {
                $or: [
                    { teacher, startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                    { classroom, startTime: { $lt: endTime }, endTime: { $gt: startTime } },
                    { batch, division, startTime: { $lt: endTime }, endTime: { $gt: startTime } }
                ]
            }
        ]
    };

    if (excludeId) {
        query.$and.push({ _id: { $ne: excludeId } });
    }

    return await Lecture.findOne(query);
};

// @desc    Create new lecture (Admin only)
// @route   POST /api/lectures
// @access  Private/Admin
export const createLecture = asyncHandler(async (req, res) => {
    // Basic validation from Joi (still kept simple)
    const { error } = lectureSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { title, subject, teacher, startTime, endTime, classroom, batch, division, type } = req.body;

    const conflict = await checkForConflicts({ teacher, classroom, batch, division, startTime, endTime });

    if (conflict) {
        res.status(400);
        throw new Error(`Scheduling conflict detected for slot: ${new Date(startTime).toLocaleString()}`);
    }

    // Capacity Check
    const batchData = await Batch.findById(batch);
    if (!batchData) {
        res.status(404);
        throw new Error('Batch not found');
    }

    const isRecurring = req.body.recurring !== 'none';
    let lecturesToCreate = [];

    if (isRecurring) {
        const recurringType = req.body.recurring || 'weekly';
        let currentStart = new Date(startTime);
        let currentEnd = new Date(endTime);
        
        let untilDate = req.body.repeatUntil ? new Date(req.body.repeatUntil) : null;
        if (!untilDate) {
            untilDate = new Date(currentStart);
            untilDate.setDate(untilDate.getDate() + (12 * 7)); // Default 12 weeks
        }

        while (currentStart <= untilDate) {
            lecturesToCreate.push({
                title, subject, teacher, classroom, batch, division, type,
                department: batchData.department,
                startTime: new Date(currentStart),
                endTime: new Date(currentEnd)
            });

            if (recurringType === 'daily') {
                currentStart.setDate(currentStart.getDate() + 1);
                currentEnd.setDate(currentEnd.getDate() + 1);
            } else {
                currentStart.setDate(currentStart.getDate() + 7);
                currentEnd.setDate(currentEnd.getDate() + 7);
            }
        }
    } else {
        lecturesToCreate.push({
            title, subject, teacher, startTime, endTime, classroom, batch, division, type, 
            department: batchData.department
        });
    }

    // Check conflicts for all generated slots
    for (const data of lecturesToCreate) {
        const conflict = await checkForConflicts(data);
        if (conflict) {
            res.status(400);
            throw new Error(`Conflict detected for recurring slot: ${new Date(data.startTime).toLocaleString()}`);
        }
    }

    const createdLectures = await Lecture.insertMany(lecturesToCreate);

    // Audit Log
    await AuditLog.create({
        user: req.user._id,
        action: 'CREATE_LECTURE',
        entity: 'Lecture',
        details: { count: createdLectures.length, subject, recurring: req.body.recurring || 'weekly' },
        ipAddress: req.ip
    });

    res.status(201).json(createdLectures);
});

// @desc    Get all lectures
// @route   GET /api/lectures
// @access  Private
// @access  Private
export const getLectures = asyncHandler(async (req, res) => {
    const isAdmin = req.user.role === 'admin';
    const filter = isAdmin ? {} : { department: { $in: req.user.department } };
    
    const lectures = await Lecture.find(filter)
        .populate('teacher', 'name email profileImage')
        .populate('batch', 'name')
        .sort({ startTime: 1 });
    res.json(lectures);
});

// @desc    Get lectures for logged in teacher/student
// @route   GET /api/lectures/my
// @access  Private
export const getMyLectures = asyncHandler(async (req, res) => {
    let query = {};
    if (req.user.role === 'teacher') {
        query = { teacher: req.user._id };
    } else if (req.user.role === 'admin') {
        query = { department: { $in: req.user.department } };
    } else if (req.user.role === 'student') {
        query = { batch: req.user.batch };
    }
    // superadmin sees everything naturally if query remains {}

    const lectures = await Lecture.find(query)
        .populate('teacher', 'name email profileImage')
        .populate('batch', 'name');
    res.json(lectures);
});

// @desc    Get single lecture details
// @route   GET /api/lectures/:id
// @access  Private
export const getLectureById = asyncHandler(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id)
        .populate('teacher', 'name email profileImage')
        .populate('batch', 'name studentCount');

    if (lecture) {
        res.json(lecture);
    } else {
        res.status(404);
        throw new Error('Lecture not found');
    }
});

// @desc    Add resource to lecture (file OR url)
// @route   POST /api/lectures/:id/resources
// @access  Private/Teacher
export const uploadResource = asyncHandler(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
        res.status(404);
        throw new Error('Lecture not found');
    }

    // Security check: only the assigned teacher can add resources
    if (req.user.role === 'teacher' && lecture.teacher.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to upload resources for this lecture');
    }

    let resourceData;

    if (req.file) {
        // File was uploaded to Cloudinary via multer middleware
        resourceData = {
            name: req.body.name || req.file.originalname,
            url: req.file.path,           // Cloudinary secure URL
            publicId: req.file.filename,  // Cloudinary public_id (for deletion later)
            fileType: req.file.mimetype,
            type: req.file.mimetype.startsWith('image/') ? 'Image' : 'File',
        };
    } else if (req.body.url) {
        // Fallback: URL-only mode (Google Drive, YouTube, etc.)
        resourceData = {
            name: req.body.name || 'Shared Link',
            url: req.body.url,
            type: 'Link',
        };
    } else {
        res.status(400);
        throw new Error('Please provide a file or a URL');
    }

    lecture.resources.push(resourceData);
    await lecture.save();
    res.status(201).json(lecture);
});

// @desc    Update lecture
// @route   PUT /api/lectures/:id
// @access  Private/Admin
export const updateLecture = asyncHandler(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);

    if (lecture) {
        if (req.body.teacher && req.body.teacher.toString() !== lecture.teacher.toString()) {
            lecture.isSubstitutionRequested = false;
            lecture.substitutionReason = undefined;
        }

        lecture.title = req.body.title || lecture.title;
        lecture.teacher = req.body.teacher || lecture.teacher;
        lecture.classroom = req.body.classroom || lecture.classroom;
        lecture.startTime = req.body.startTime || lecture.startTime;
        lecture.endTime = req.body.endTime || lecture.endTime;
        lecture.status = req.body.status || lecture.status;
        lecture.batch = req.body.batch || lecture.batch;
        lecture.division = req.body.division || lecture.division;

        // Perform conflict check on update
        const conflict = await checkForConflicts({
            teacher: lecture.teacher,
            classroom: lecture.classroom,
            batch: lecture.batch,
            division: lecture.division,
            startTime: lecture.startTime,
            endTime: lecture.endTime
        }, lecture._id);

        if (conflict) {
            res.status(400);
            throw new Error('Updating this lecture would cause a scheduling conflict.');
        }

        const updatedLecture = await lecture.save();

        await AuditLog.create({
            user: req.user._id,
            action: 'UPDATE_LECTURE',
            entity: 'Lecture',
            entityId: updatedLecture._id,
            details: { updatedFields: Object.keys(req.body) },
            ipAddress: req.ip
        });

        res.json(updatedLecture);
    } else {
        res.status(404);
        throw new Error('Lecture not found');
    }
});

// @desc    Delete lecture
// @route   DELETE /api/lectures/:id
// @access  Private/Admin
export const deleteLecture = asyncHandler(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
    if (lecture) {
        await lecture.deleteOne();

        await AuditLog.create({
            user: req.user._id,
            action: 'DELETE_LECTURE',
            entity: 'Lecture',
            entityId: req.params.id,
            details: { subject: lecture.subject },
            ipAddress: req.ip
        });

        res.json({ message: 'Lecture removed' });
    } else {
        res.status(404);
        throw new Error('Lecture not found');
    }
});

// @desc    Delete resource from lecture
// @route   DELETE /api/lectures/:id/resources/:resourceId
// @access  Private (Teacher who owns lecture OR Admin)
export const deleteResource = asyncHandler(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);

    if (!lecture) {
        res.status(404);
        throw new Error('Lecture not found');
    }

    // Security Check: Admin OR Owner Teacher
    const isOwner = lecture.teacher.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        res.status(403);
        throw new Error('Not authorized to delete resources for this lecture');
    }

    const resource = lecture.resources.id(req.params.resourceId);
    if (!resource) {
        res.status(404);
        throw new Error('Resource not found');
    }

    // Delete from Cloudinary if it's a file with publicId
    if (resource.publicId) {
        try {
            await cloudinary.uploader.destroy(resource.publicId);
        } catch (error) {
            console.error('Cloudinary Deletion Error:', error);
        }
    }

    lecture.resources.pull(req.params.resourceId);
    await lecture.save();

    res.json({ message: 'Resource deleted successfully' });
});
