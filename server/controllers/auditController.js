import asyncHandler from 'express-async-handler';
import AuditLog from '../models/auditLogModel.js';

// @desc    Get all audit logs
// @route   GET /api/audit
// @access  Private/SuperAdmin
export const getAuditLogs = asyncHandler(async (req, res) => {
    if (req.user.role !== 'superadmin') {
        res.status(403);
        throw new Error('Not authorized to view system logs');
    }

    const logs = await AuditLog.find({})
        .populate('user', 'name email role')
        .sort({ createdAt: -1 })
        .limit(100);
    res.json(logs);
});
