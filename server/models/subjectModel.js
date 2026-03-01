import mongoose from 'mongoose';

const subjectSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
});

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
