import express from 'express';
import multer from 'multer';
import { authUser, registerUser, bulkRegisterUsers, getTeachers, getStudents, getStudentsByBatch, getSubjects, forgotPassword, resetPassword } from '../controllers/userController.js';
import { protect, admin, teacher } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, registerUser);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/bulk', protect, upload.single('file'), bulkRegisterUsers);
router.get('/teachers', protect, admin, getTeachers);
router.get('/students', protect, teacher, getStudents);
router.get('/batch/:batchId', protect, teacher, getStudentsByBatch);
router.get('/subjects', protect, getSubjects);

export default router;
