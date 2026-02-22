const mongoose = require('mongoose');

const classroomSchema = mongoose.Schema({
    name: {
        type: String, // e.g., "Room 404", "Lab 2"
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    type: {
        type: String,
        enum: ['Lecture Hall', 'Computer Lab', 'Seminar Room'],
        default: 'Lecture Hall'
    },
    resources: [{
        type: String // e.g. "Projector", "Whiteboard", "30 PCs"
    }],
    department: { // Optional: if room belongs to specific dept
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Classroom', classroomSchema);
