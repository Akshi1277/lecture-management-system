import mongoose from 'mongoose';

const settingsSchema = mongoose.Schema({
    attendanceThreshold: {
        type: Number,
        default: 75
    },
    labWeight: {
        type: Number,
        default: 4
    },
    systemName: {
        type: String,
        default: 'EduSync'
    }
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
