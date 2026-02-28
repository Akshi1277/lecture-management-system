const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Subject = require('../models/subjectModel');
const generateToken = require('../utils/generateToken');
const { userSchema } = require('../utils/validators');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            subjects: user.subjects,
            isMentor: user.isMentor,
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

    const { name, email, password, role, department, batch, isMentor, subjects } = req.body;

    const requester = req.user;

    // Security Logic:
    // 1. Admin can register anyone.
    // 2. Teacher with isMentor: true can ONLY register students.
    // 3. Regular teachers/students cannot register anyone.

    if (requester.role === 'admin') {
        // Admin can do anything (including making someone a mentor)
    } else if (requester.role === 'teacher' && requester.isMentor) {
        if (role !== 'student') {
            res.status(403);
            throw new Error('Mentors can only register students.');
        }
    } else {
        res.status(403);
        throw new Error('Not authorized to register users.');
    }

    // Security: Only admin can create other admins or mentors
    if (requester.role !== 'admin' && (role === 'admin' || isMentor === true)) {
        res.status(403);
        throw new Error('Only administrators can assign Admin or Mentor roles.');
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
        subjects: role === 'teacher' ? subjects : [],
        batch,
        isMentor: isMentor || false
    });

    // Save new subjects to Subject model if they don't exist
    if (role === 'teacher' && subjects && Array.isArray(subjects)) {
        for (const subjName of subjects) {
            await Subject.findOneAndUpdate(
                { name: subjName.trim() },
                { name: subjName.trim() },
                { upsert: true, new: true }
            );
        }
    }

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

const getTeachers = asyncHandler(async (req, res) => {
    const teachers = await User.find({ role: 'teacher' });
    res.json(teachers);
});

// @desc    Get students by batch
// @route   GET /api/users/batch/:batchId
// @access  Private
const getStudentsByBatch = asyncHandler(async (req, res) => {
    const students = await User.find({ role: 'student', batch: req.params.batchId }).select('name email');
    res.json(students);
});

const getStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ role: 'student' }).populate('batch', 'name');
    res.json(students);
});

// @desc    Get all unique subjects
// @route   GET /api/users/subjects
// @access  Private
const getSubjects = asyncHandler(async (req, res) => {
    const subjects = await Subject.find({}).sort({ name: 1 });
    res.json(subjects.map(s => s.name));
});

module.exports = { authUser, registerUser, getTeachers, getStudents, getStudentsByBatch, getSubjects };
