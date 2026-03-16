import mongoose from 'mongoose';

const attendanceSchema = mongoose.Schema({
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    students: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['present', 'absent'],
            default: 'present'
        }
    }],
    markedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Teacher
        required: true
    }
}, {
    timestamps: true
});

attendanceSchema.index({ 'students.student': 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
