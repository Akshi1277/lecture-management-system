const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { userSchema } = require('../utils/validators');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('department', 'name code');

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { name, email, password, role, department, batch } = req.body;

    // Security: HOD/Admin cannot be created via public registration
    if (role === 'admin') {
        res.status(403);
        throw new Error('Admin registration is restricted.');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'student',
        department,
        batch
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Get all teachers (Admin only)
const getTeachers = asyncHandler(async (req, res) => {
    const teachers = await User.find({ role: 'teacher' }).populate('department', 'name code');
    res.json(teachers);
});

// @desc    Get students by batch
// @route   GET /api/users/batch/:batchId
// @access  Private
const getStudentsByBatch = asyncHandler(async (req, res) => {
    const students = await User.find({ role: 'student', batch: req.params.batchId }).select('name email');
    res.json(students);
});

// @desc    Get all students (Teacher/Admin access)
const getStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ role: 'student' }).populate('department', 'name code').populate('batch', 'name');
    res.json(students);
});

module.exports = { authUser, registerUser, getTeachers, getStudents, getStudentsByBatch };
