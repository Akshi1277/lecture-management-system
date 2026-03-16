import asyncHandler from 'express-async-handler';
import Department from '../models/departmentModel.js';

import Batch from '../models/batchModel.js';
import { departmentSchema } from '../utils/validators.js';

// @desc    Create new department
// @route   POST /api/departments
// @access  Private/Admin
export const createDepartment = asyncHandler(async (req, res) => {
    const { error } = departmentSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }
    const { name, code, description } = req.body;
    const department = await Department.create({ name, code, description });
    res.status(201).json(department);
});

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private
export const getDepartments = asyncHandler(async (req, res) => {
    const departments = await Department.find({});
    res.json(departments);
});



// @desc    Create new batch
// @route   POST /api/batches
// @access  Private/Admin
export const createBatch = asyncHandler(async (req, res) => {
    const { name, department, year, studentCount } = req.body;
    const batch = await Batch.create({ name, department, year, studentCount });
    res.status(201).json(batch);
});

// @desc    Get all batches
// @route   GET /api/batches
// @access  Private
export const getBatches = asyncHandler(async (req, res) => {
    const batches = await Batch.find({});
    res.json(batches);
});
