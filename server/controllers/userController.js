import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Subject from '../models/subjectModel.js';
import generateToken from '../utils/generateToken.js';
import { userSchema } from '../utils/validators.js';
import generateRandomPassword from '../utils/passGenerator.js';
import { sendEnrollmentEmail } from '../utils/emailService.js';
import xlsx from 'xlsx';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
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
// @access  Private (Admin/Mentor)
export const registerUser = asyncHandler(async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { name, email, role, department, batch, isMentor, subjects } = req.body;
    let { password } = req.body;

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

    // Generate pattern-based temporary password
    const generatedPassword = generateRandomPassword(name);
    password = password || generatedPassword;

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'student',
        department,
        subjects: role === 'teacher' ? subjects : [],
        batch: batch || undefined,
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
        // Send email with credentials
        await sendEnrollmentEmail(email, name, password, role);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailSent: true,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Bulk Register students from Excel
// @route   POST /api/users/bulk
// @access  Private (Admin/Mentor)
export const bulkRegisterUsers = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload an Excel file');
    }

    const requester = req.user;
    const { batchId } = req.body;

    if (!batchId) {
        res.status(400);
        throw new Error('Please specify a batch for the students');
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const studentsData = xlsx.utils.sheet_to_json(sheet);

    let createdCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const student of studentsData) {
        try {
            const { FullName, Email } = student;

            if (!FullName || !Email) {
                errorCount++;
                errors.push(`Row ${createdCount + errorCount}: Missing name or email`);
                continue;
            }

            const exists = await User.findOne({ email: Email.toLowerCase().trim() });
            if (exists) {
                errorCount++;
                errors.push(`${Email}: Already exists`);
                continue;
            }

            const password = generateRandomPassword(FullName);
            await User.create({
                name: FullName,
                email: Email.toLowerCase().trim(),
                password,
                role: 'student',
                batch: batchId
            });

            // Send notification
            await sendEnrollmentEmail(Email.toLowerCase().trim(), FullName, password, 'student');
            createdCount++;
        } catch (err) {
            errorCount++;
            errors.push(err.message);
        }
    }

    res.status(201).json({
        message: `Processed ${studentsData.length} records. Successfully enrolled ${createdCount} students.`,
        createdCount,
        errorCount,
        errors
    });
});

export const getTeachers = asyncHandler(async (req, res) => {
    const teachers = await User.find({ role: 'teacher' });
    res.json(teachers);
});

// @desc    Get students by batch
// @route   GET /api/users/batch/:batchId
// @access  Private
export const getStudentsByBatch = asyncHandler(async (req, res) => {
    const students = await User.find({ role: 'student', batch: req.params.batchId }).select('name email');
    res.json(students);
});

export const getStudents = asyncHandler(async (req, res) => {
    const students = await User.find({ role: 'student' }).populate('batch', 'name');
    res.json(students);
});

// @desc    Get all unique subjects
// @route   GET /api/users/subjects
// @access  Private
export const getSubjects = asyncHandler(async (req, res) => {
    const subjects = await Subject.find({}).sort({ name: 1 });
    res.json(subjects.map(s => s.name));
});
