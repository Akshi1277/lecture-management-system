import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Lecture from './models/lectureModel.js';
import Attendance from './models/attendanceModel.js';

dotenv.config();

const patchLectures = async () => {
    try {
        await connectDB();
        
        // Find all attendances
        const attendances = await Attendance.find().lean();
        console.log(`Found ${attendances.length} attendance records.`);
        
        const markedLectureIds = attendances.map(a => a.lecture);
        
        // Update all corresponding lectures
        const result = await Lecture.updateMany(
            { _id: { $in: markedLectureIds } },
            { $set: { attendanceMarked: true, status: 'Completed' } }
        );
        
        console.log(`Updated ${result.modifiedCount} lectures to marked status.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

patchLectures();
