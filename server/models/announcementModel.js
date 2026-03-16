import mongoose from 'mongoose';

const advertisementSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    targetBatch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch', // If null, it's global
    },
    targetAudience: {
        type: String,
        enum: ['all', 'teachers', 'students'],
        default: 'all'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    expiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

const Announcement = mongoose.model('Announcement', advertisementSchema);
export default Announcement;
