const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8 // Assuming 4-year degree max, or 6 for 3-year
    },
    syllabus: [{
        unitNumber: Number,
        title: String,
        description: String,
        isCompleted: { type: Boolean, default: false }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
