import asyncHandler from 'express-async-handler';
import AuditLog from '../models/auditLogModel.js';

// @desc    Get all audit logs
// @route   GET /api/audit
// @access  Private/Admin
export const getAuditLogs = asyncHandler(async (req, res) => {
    const logs = await AuditLog.find({})
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .limit(100);
    res.json(logs);
});
