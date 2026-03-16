import express from 'express';
import {
    createDepartment,
    getDepartments,
    createBatch,
    getBatches
} from '../controllers/hierarchyController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/departments')
    .post(protect, admin, createDepartment)
    .get(protect, getDepartments);



router.route('/batches')
    .post(protect, admin, createBatch)
    .get(getBatches);

export default router;
