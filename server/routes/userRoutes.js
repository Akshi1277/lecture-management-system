import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { authUser, registerUser, bulkRegisterUsers, getUsers, getTeachers, getStudents, getStudentsByBatch, getSubjects, forgotPassword, resetPassword, updateUserProfile, updatePasswordWhileLoggedIn } from '../controllers/userController.js';
import { protect, admin, teacher } from '../middleware/authMiddleware.js';
import { uploadProfile } from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, registerUser);
router.get('/', protect, admin, getUsers);
router.post('/login', authUser);
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
    });
    res.cookie('csrfToken', '', {
        secure: true,
        sameSite: 'none',
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});
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
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, updatePasswordWhileLoggedIn);
router.post('/profile/photo', protect, uploadProfile.single('photo'), (req, res) => {
    if (req.file) {
        res.json({ url: req.file.path });
    } else {
        res.status(400);
        throw new Error('No image provided');
    }
});

export default router;
