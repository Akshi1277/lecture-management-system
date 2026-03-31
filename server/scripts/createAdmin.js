import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = await User.findOneAndUpdate(
            { email: 'admin@rizvi.edu' },
            {
                name: 'Super Admin',
                email: 'admin@rizvi.edu',
                password: hashedPassword,
                role: 'admin',
                department: ['IT', 'CS']
            },
            { upsert: true, new: true }
        );

        console.log('Admin account ready!');
        console.log('Email: admin@rizvi.edu');
        console.log('Password: admin123');
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
