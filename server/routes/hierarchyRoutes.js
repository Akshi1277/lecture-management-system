import express from 'express';
import {
    createDepartment,
    getDepartments,
    createBatch,
    getBatches,
    updateBatch,
    deleteBatch
} from '../controllers/hierarchyController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/departments')
    .post(protect, admin, createDepartment)
    .get(protect, getDepartments);



router.route('/batches')
    .post(protect, admin, createBatch)
    .get(protect, getBatches);

router.route('/batches/:id')
    .put(protect, admin, updateBatch)
    .delete(protect, admin, deleteBatch);

export default router;
