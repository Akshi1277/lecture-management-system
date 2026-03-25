import asyncHandler from 'express-async-handler';
import Lecture from '../models/lectureModel.js';
import Batch from '../models/batchModel.js';
import Classroom from '../models/classroomModel.js';
import AuditLog from '../models/auditLogModel.js';
import { lectureSchema } from '../utils/validators.js';

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
    // In a real system you'd also fetch the classroom doc to check capacity. 
    // For now we assume the frontend passes the room name string, but to be robust
    // we should really be passing a Classroom ID. 
    // However, sticking to the current string 'classroom' implementation for MVP speed:
    const roomDoc = await Classroom.findOne({ name: classroom });

    if (batchData && roomDoc) {
        if (batchData.studentCount > roomDoc.capacity) {
            res.status(400);
            throw new Error(`Capacity Warning: Room ${classroom} (Cap: ${roomDoc.capacity}) is too small for ${batchData.name} (${batchData.studentCount} students).`);
        }
    }

    const { recurring, repeatUntil } = req.body;
    let lecturesToCreate = [];

    if (recurring && recurring !== 'none' && repeatUntil) {
        let currentStart = new Date(startTime);
        let currentEnd = new Date(endTime);
        const untilDate = new Date(repeatUntil);

        while (currentStart <= untilDate) {
            lecturesToCreate.push({
                title, subject, teacher, classroom, batch, division, type,
                startTime: new Date(currentStart),
                endTime: new Date(currentEnd)
            });

            if (recurring === 'daily') {
                currentStart.setDate(currentStart.getDate() + 1);
                currentEnd.setDate(currentEnd.getDate() + 1);
            } else if (recurring === 'weekly') {
                currentStart.setDate(currentStart.getDate() + 7);
                currentEnd.setDate(currentEnd.getDate() + 7);
            }
        }
    } else {
        lecturesToCreate.push({
            title, subject, teacher, startTime, endTime, classroom, batch, division, type
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
        details: { count: createdLectures.length, subject, recurring },
        ipAddress: req.ip
    });

    res.status(201).json(createdLectures);
});

// @desc    Get all lectures
// @route   GET /api/lectures
// @access  Private
export const getLectures = asyncHandler(async (req, res) => {
    const lectures = await Lecture.find({})
        .populate('teacher', 'name email')
        .populate('batch', 'name')
        .sort({ startTime: 1 });
    res.json(lectures);
});

// @desc    Get lectures for logged in teacher/student
// @route   GET /api/lectures/my
// @access  Private
export const getMyLectures = asyncHandler(async (req, res) => {
    const query = req.user.role === 'teacher' ? { teacher: req.user._id } : {};
    const lectures = await Lecture.find(query)
        .populate('teacher', 'name email')
        .populate('batch', 'name');
    res.json(lectures);
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
