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
    },
    batchDurations: [
        {
            batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch' },
            batchName: { type: String },
            lectureDuration: { type: Number, default: 60 },  // minutes
            labDuration: { type: Number, default: 120 },      // minutes
            startTime: { type: String, default: "07:30" },   // e.g. "07:30"
            endTime: { type: String, default: "17:00" },     // e.g. "17:00"
            breaks: [
                {
                    label: { type: String, default: "Lunch Break" },
                    startTime: { type: String }, // e.g. "09:30"
                    duration: { type: Number, default: 30 } // minutes
                }
            ]
        }
    ]
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
