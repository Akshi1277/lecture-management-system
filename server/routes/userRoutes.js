const express = require('express');
const router = express.Router();
const { authUser, registerUser, getTeachers, getStudents, getStudentsByBatch } = require('../controllers/userController');
const { protect, admin, teacher } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/teachers', protect, admin, getTeachers);
router.get('/students', protect, teacher, getStudents);
router.get('/batch/:batchId', protect, teacher, getStudentsByBatch);

module.exports = router;
