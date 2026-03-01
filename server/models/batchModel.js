import mongoose from 'mongoose';

const batchSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        // e.g. "FYCS", "SYIT", "TYBMM"
    },
    department: {
        type: String,
        enum: ['IT', 'CS'],
        required: true
    },
    year: {
        type: Number,
        required: true,
        default: new Date().getFullYear()
    },
    studentCount: {
        type: Number,
        default: 0
    },
    divisionType: { // To distinguish if batch is single or split
        type: String,
        enum: ['Combined', 'Divided'],
        default: 'Combined'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Batch = mongoose.model('Batch', batchSchema);
export default Batch;
