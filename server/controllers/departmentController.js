import asyncHandler from 'express-async-handler';
import Department from '../models/departmentModel.js';
import AuditLog from '../models/auditLogModel.js';

// @desc    Get all departments (Filtered by user role)
// @route   GET /api/departments
// @access  Private
export const getDepartments = asyncHandler(async (req, res) => {
    const isSuperAdmin = req.user.role === 'superadmin';
    
    // Filter: Super Admin gets all, others get only their assigned departments
    const query = isSuperAdmin ? {} : { code: { $in: req.user.department } };
    
    const departments = await Department.find(query).sort({ name: 1 });
    res.json(departments);
});

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private (Admin)
export const createDepartment = asyncHandler(async (req, res) => {
    const { name, code, description } = req.body;

    const exists = await Department.findOne({ $or: [{ name }, { code: code.toUpperCase() }] });
    if (exists) {
        res.status(400);
        throw new Error('Department name or code already exists');
    }

    const dept = await Department.create({
        name,
        code: code.toUpperCase(),
        description
    });

    if (dept) {
        // Audit log
        await AuditLog.create({
            user: req.user._id,
            action: 'CREATE_DEPARTMENT',
            entity: 'Department',
            entityId: dept._id,
            details: `Created department: ${name} (${code.toUpperCase()})`,
            ipAddress: req.ip
        });

        res.status(201).json(dept);
    } else {
        res.status(400);
        throw new Error('Invalid department data');
    }
});

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
export const deleteDepartment = asyncHandler(async (id_or_req, res_or_next) => {
    // Handling both potential express formats
    const req = id_or_req;
    const res = res_or_next;
    const { id } = req.params;

    const dept = await Department.findById(id);
    if (dept) {
        await Department.deleteOne({ _id: id });
        
        // Audit log
        await AuditLog.create({
            user: req.user._id,
            action: 'DELETE_DEPARTMENT',
            entity: 'Department',
            details: `Deleted department: ${dept.name}`,
            ipAddress: req.ip
        });

        res.json({ message: 'Department removed' });
    } else {
        res.status(404);
        throw new Error('Department not found');
    }
});
