import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Subject from '../models/subjectModel.js';
import generateToken from '../utils/generateToken.js';
import AuditLog from '../models/auditLogModel.js';
import { userSchema } from '../utils/validators.js';
import generateRandomPassword from '../utils/passGenerator.js';
import { sendEnrollmentEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import xlsx from 'xlsx';
import crypto from 'crypto';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department,
            subjects: user.subjects,
            isMentor: user.isMentor,
            token, // Keep sending for now to avoid breaking existing frontend logic immediately
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

    const { name, email, role, department, batch, isMentor, subjects, parentEmail } = req.body;
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
        isMentor: isMentor || false,
        parentEmail
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

        // Audit Log
        await AuditLog.create({
            user: requester._id,
            action: 'CREATE_USER',
            entity: 'User',
            entityId: user._id,
            details: `Enrolled ${name} as ${role}`,
            ipAddress: req.ip
        });

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isEmailSent: true,
            token,
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

    if (studentsData.length > 200) {
        res.status(400);
        throw new Error('Maximum 200 students can be registered at once to prevent server timeout.');
    }

    let createdCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const student of studentsData) {
        try {
            const { FullName, Email, ParentEmail } = student;

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
                batch: batchId,
                parentEmail: ParentEmail ? ParentEmail.toLowerCase().trim() : undefined
            });

            // Send notification asynchronously in background (prevent DoS)
            sendEnrollmentEmail(Email.toLowerCase().trim(), FullName, password, 'student')
                .catch(err => console.error(`Failed to send email to ${Email}:`, err));
                
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

    // Audit Log for Bulk
    if (createdCount > 0) {
        await AuditLog.create({
            user: requester._id,
            action: 'BULK_REGISTER',
            entity: 'User',
            details: `Bulk enrolled ${createdCount} students into batch ${batchId}`,
            ipAddress: req.ip
        });
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
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

// @desc    Forgot Password - Send OTP
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        // Generates cryptographically strong 6-digit OTP
        const otp = crypto.randomInt(100000, 1000000).toString();
        
        user.resetPasswordToken = otp;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        await sendPasswordResetEmail(user.email, user.name, otp);
        res.json({ message: 'Verification code sent to your email.' });
    } else {
        res.status(404);
        throw new Error('User not found with this email.');
    }
});

// @desc    Reset Password using OTP
// @route   POST /api/users/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({
        email,
        resetPasswordToken: otp,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (user) {
        if (newPassword.length < 6) {
            res.status(400);
            throw new Error('Password must be at least 6 characters long.');
        }

        const isMatch = await user.matchPassword(newPassword);
        if (isMatch) {
            res.status(400);
            throw new Error('New password cannot be the same as the old password.');
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: 'Password reset successful. You can now login.' });
    } else {
        res.status(400);
        throw new Error('Invalid or expired verification code.');
    }
});

// @desc    Update user profile (Name)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        if (req.body.profileImage) user.profileImage = req.body.profileImage;
        
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
            profileImage: updatedUser.profileImage
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Change password while logged in
// @route   PUT /api/users/change-password
// @access  Private
export const updatePasswordWhileLoggedIn = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(currentPassword))) {
        if (newPassword?.length < 6) {
            res.status(400);
            throw new Error('New password must be at least 6 characters long.');
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(401);
        throw new Error('Incorrect current password');
    }
});
