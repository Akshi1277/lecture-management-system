const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const createAdmin = async () => {
    // Connect to database
    await connectDB();

    const adminData = {
        name: 'System Admin',
        email: 'admin@lms.com',
        password: 'adminPassword123', // This will be hashed by the userModel pre-save hook
        role: 'admin'
    };

    try {
        // Check if admin already exists
        const adminExists = await User.findOne({ email: adminData.email });

        if (adminExists) {
            console.log('Admin user with this email already exists.');
            process.exit();
        }

        const user = await User.create(adminData);

        if (user) {
            console.log('-----------------------------------');
            console.log('SUCCESS: Admin User Created!');
            console.log(`Email: ${adminData.email}`);
            console.log(`Password: ${adminData.password}`);
            console.log('-----------------------------------');
            console.log('IMPORTANT: Please delete this script after use for security.');
        }

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
