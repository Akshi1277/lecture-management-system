import express from 'express';
import { getBatchAttendanceReport, getFacultyWorkloadReport, getSystemSummary } from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/attendance/:batchId', protect, admin, getBatchAttendanceReport);
router.get('/faculty-workload', protect, admin, getFacultyWorkloadReport);
router.get('/system-summary', protect, admin, getSystemSummary);

export default router;
