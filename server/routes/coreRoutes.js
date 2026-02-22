const express = require('express');
const router = express.Router();
const { createLecture, getLectures, getMyLectures, uploadResource, updateLecture } = require('../controllers/lectureController');
const { suggestSubstitutes } = require('../controllers/substitutionController');
const { addSyllabusUnit, updateSyllabusProgress, getSyllabusStatus } = require('../controllers/courseController');
const { createExam, getExams } = require('../controllers/examController');
const { markAttendance, getAttendanceByLecture, getAttendanceStats, getLowAttendanceStudents, getFacultyLoad, getMyAttendanceStats } = require('../controllers/attendanceController');
const { protect, admin, teacher } = require('../middleware/authMiddleware');

// Lecture Routes
router.route('/lectures')
    .post(protect, admin, createLecture)
    .get(protect, getLectures);

router.put('/lectures/:id', protect, admin, updateLecture);

router.get('/lectures/my', protect, getMyLectures);
router.post('/lectures/:id/resources', protect, teacher, uploadResource);
router.get('/lectures/substitutes/:lectureId', protect, admin, suggestSubstitutes);

// Attendance Routes
router.post('/attendance', protect, teacher, markAttendance);
router.get('/attendance/low-stats', protect, teacher, getLowAttendanceStudents);
router.get('/attendance/faculty-load', protect, admin, getFacultyLoad);
router.get('/attendance/my-stats', protect, getMyAttendanceStats);
router.get('/attendance/stats/:courseId/:batchId', protect, teacher, getAttendanceStats);
router.get('/attendance/:lectureId', protect, getAttendanceByLecture);

// Course Syllabus Routes
router.post('/courses/:id/syllabus', protect, admin, addSyllabusUnit);
router.put('/courses/:id/syllabus/:unitId', protect, teacher, updateSyllabusProgress);
router.get('/courses/:id/syllabus', protect, getSyllabusStatus);

// Exam Routes
router.route('/exams')
    .post(protect, admin, createExam)
    .get(protect, getExams);

module.exports = router;
