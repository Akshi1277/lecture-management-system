import express from 'express';
import { getAdminStats, getSystemSettings, updateSystemSettings, sendAttendanceWarnings } from '../controllers/dashboardController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', protect, admin, getAdminStats);
router.route('/settings')
    .get(protect, admin, getSystemSettings)
    .put(protect, admin, updateSystemSettings);
router.post('/attendance-warnings', protect, admin, sendAttendanceWarnings);

export default router;
