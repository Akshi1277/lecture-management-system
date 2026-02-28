const mongoose = require('mongoose');

const lectureSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    subject: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    division: {
        type: String,
        enum: ['A', 'B', 'C', 'D', 'All'],
        default: 'A'
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    classroom: {
        type: String,
        required: true
    },
    type: {
        type: String, // 'Lecture' or 'Lab'
        enum: ['Lecture', 'Lab'],
        default: 'Lecture'
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled', 'Ongoing'],
        default: 'Scheduled'
    },
    resources: [{
        name: String,
        url: String,
        type: { type: String, default: 'PDF' }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Lecture', lectureSchema);
