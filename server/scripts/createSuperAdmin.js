import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

const createSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for SuperAdmin creation...');

        // Check if superadmin already exists
        const exists = await User.findOne({ email: 'superadmin@rizvi.edu' });
        if (exists) {
            console.log('SuperAdmin already exists. Cleaning up old record...');
            await User.deleteOne({ email: 'superadmin@rizvi.edu' });
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const superAdmin = await User.create({
            name: 'Master Super Admin',
            email: 'superadmin@rizvi.edu',
            password: hashedPassword,
            role: 'superadmin',
            department: ['GLOBAL'], // SuperAdmin has global access
            isMentor: false
        });

        console.log('--- SUPER ADMIN CREATED SUCCESSFULY ---');
        console.log('Email: superadmin@rizvi.edu');
        console.log('Password: admin123');
        console.log('Role: superadmin');
        console.log('---------------------------------------');

        process.exit();
    } catch (error) {
        console.error('Error creating SuperAdmin:', error);
        process.exit(1);
    }
};

createSuperAdmin();
