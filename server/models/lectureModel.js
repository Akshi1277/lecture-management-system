import mongoose from 'mongoose';

const lectureSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
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
        enum: ['Scheduled', 'Completed', 'Cancelled', 'Ongoing', 'Relocated'],
        default: 'Scheduled'
    },
    relocatedTo: {
        type: String
    },
    conflictReason: {
        type: String
    },
    resources: [{
        name: String,
        url: String,
        type: { type: String, default: 'PDF' }
    }],
    isSubstitutionRequested: {
        type: Boolean,
        default: false
    },
    substitutionReason: {
        type: String
    }
}, {
    timestamps: true
});

const Lecture = mongoose.model('Lecture', lectureSchema);
export default Lecture;
