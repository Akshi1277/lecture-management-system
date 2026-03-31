import express from 'express';
import { getDepartments, createDepartment, deleteDepartment } from '../controllers/departmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDepartments);
router.post('/', protect, admin, createDepartment);
router.delete('/:id', protect, admin, deleteDepartment);

export default router;
