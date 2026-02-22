const asyncHandler = require('express-async-handler');
const Department = require('../models/departmentModel');
const Course = require('../models/courseModel');
const Batch = require('../models/batchModel');
const { departmentSchema } = require('../utils/validators');

// @desc    Create new department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = asyncHandler(async (req, res) => {
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
const getDepartments = asyncHandler(async (req, res) => {
    const departments = await Department.find({});
    res.json(departments);
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
    const { name, code, department, credits, semester } = req.body;
    const course = await Course.create({ name, code, department, credits, semester });
    res.status(201).json(course);
});

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({}).populate('department', 'name text');
    res.json(courses);
});

// @desc    Create new batch
// @route   POST /api/batches
// @access  Private/Admin
const createBatch = asyncHandler(async (req, res) => {
    const { name, department, year, studentCount } = req.body;
    const batch = await Batch.create({ name, department, year, studentCount });
    res.status(201).json(batch);
});

// @desc    Get all batches
// @route   GET /api/batches
// @access  Private
const getBatches = asyncHandler(async (req, res) => {
    const batches = await Batch.find({}).populate('department', 'name code');
    res.json(batches);
});

module.exports = {
    createDepartment,
    getDepartments,
    createCourse,
    getCourses,
    createBatch,
    getBatches
};
