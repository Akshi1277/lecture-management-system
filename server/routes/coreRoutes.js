import express from 'express';
import { createLecture, getLectures, getMyLectures, uploadResource, updateLecture } from '../controllers/lectureController.js';
import { suggestSubstitutes, getPendingSubstitutions, requestSubstitution } from '../controllers/substitutionController.js';
import { createExam, getExams } from '../controllers/examController.js';
// Exam Routes
import { blockRoom, getActiveBlocks } from '../controllers/roomController.js';
import {
    markAttendance,
    getAttendanceByLecture,
    getAttendanceStats,
    getLowAttendanceStudents,
    getFacultyLoad,
    getMyAttendanceStats,
    getSubjectWiseAttendance,
    getGlobalDefaulters,
    sendAttendanceWarning
} from '../controllers/attendanceController.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { createAnnouncement, getAnnouncements, deleteAnnouncement } from '../controllers/announcementController.js';
import { protect, admin, teacher } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lecture Routes
router.route('/lectures')
    .post(protect, admin, createLecture)
    .get(protect, getLectures);

router.put('/lectures/:id', protect, admin, updateLecture);

router.get('/lectures/my', protect, getMyLectures);
router.post('/lectures/:id/resources', protect, teacher, uploadResource);
router.get('/lectures/substitutes/:lectureId', protect, admin, suggestSubstitutes);
router.get('/lectures/substitutions/pending', protect, admin, getPendingSubstitutions);
router.post('/lectures/:id/request-substitution', protect, teacher, requestSubstitution);

// Attendance Routes
router.post('/attendance', protect, teacher, markAttendance);
router.get('/attendance/global-defaulters', protect, admin, getGlobalDefaulters);
router.get('/attendance/low-stats', protect, teacher, getLowAttendanceStudents);
router.get('/attendance/faculty-load', protect, admin, getFacultyLoad);
router.get('/attendance/my-stats', protect, getMyAttendanceStats);
router.get('/attendance/subject-wise', protect, getSubjectWiseAttendance);
router.get('/attendance/stats/:subject/:batchId', protect, teacher, getAttendanceStats);
router.post('/attendance/send-warnings', protect, admin, sendAttendanceWarning);
router.get('/attendance/:lectureId', protect, getAttendanceByLecture);

// Settings Routes
router.route('/settings')
    .get(protect, admin, getSettings)
    .put(protect, admin, updateSettings);

// Exam Routes
router.route('/exams')
    .post(protect, admin, createExam)
    .get(protect, getExams);

// Room Block Routes (Exams/Lockdowns)
router.post('/rooms/block', protect, admin, blockRoom);
router.get('/rooms/blocks', protect, admin, getActiveBlocks);

// Announcement Routes
router.route('/announcements')
    .post(protect,createAnnouncement)
    .get(protect, getAnnouncements);
router.delete('/announcements/:id', protect,teacher, deleteAnnouncement);

export default router;
