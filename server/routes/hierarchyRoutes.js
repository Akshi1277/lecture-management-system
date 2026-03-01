import express from 'express';
import {
    createDepartment,
    getDepartments,
    createCourse,
    getCourses,
    createBatch,
    getBatches
} from '../controllers/hierarchyController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/departments')
    .post(protect, admin, createDepartment)
    .get(protect, getDepartments);

router.route('/courses')
    .post(protect, admin, createCourse)
    .get(protect, getCourses);

router.route('/batches')
    .post(protect, admin, createBatch)
    .get(getBatches);

export default router;
