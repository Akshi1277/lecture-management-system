const mongoose = require('mongoose');

const examSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Theoretical Exam', 'Practical Exam', 'Viva Voce', 'Internal Assessment'],
        default: 'Theoretical Exam'
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
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Exam', examSchema);
