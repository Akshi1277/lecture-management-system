import asyncHandler from 'express-async-handler';
import Settings from '../models/settingsModel.js';

// @desc    Get system settings
// @route   GET /api/settings
// @access  Private/Admin
export const getSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({});
    }
    res.json(settings);
});

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
    const { attendanceThreshold, labWeight, systemName } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings();
    }

    if (attendanceThreshold !== undefined) settings.attendanceThreshold = attendanceThreshold;
    if (labWeight !== undefined) settings.labWeight = labWeight;
    if (systemName !== undefined) settings.systemName = systemName;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
});
