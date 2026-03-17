import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { authUser, registerUser, bulkRegisterUsers, getUsers, getTeachers, getStudents, getStudentsByBatch, getSubjects, forgotPassword, resetPassword } from '../controllers/userController.js';
import { protect, admin, teacher } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, registerUser);
router.get('/', protect, admin, getUsers);
router.post('/login', authUser);
const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: 'Too many password reset requests from this IP, please try again after an hour'
});

router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/bulk', protect, upload.single('file'), bulkRegisterUsers);
router.get('/teachers', protect, admin, getTeachers);
router.get('/students', protect, teacher, getStudents);
router.get('/batch/:batchId', protect, teacher, getStudentsByBatch);
router.get('/subjects', protect, getSubjects);

export default router;
