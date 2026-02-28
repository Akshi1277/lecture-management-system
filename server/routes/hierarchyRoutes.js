const express = require('express');
const router = express.Router();
const {
    createDepartment,
    getDepartments,
    createCourse,
    getCourses,
    createBatch,
    getBatches
} = require('../controllers/hierarchyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/departments')
    .post(protect, admin, createDepartment)
    .get(protect, getDepartments);

router.route('/courses')
    .post(protect, admin, createCourse)
    .get(protect, getCourses);

router.route('/batches')
    .post(protect, admin, createBatch)
    .get(getBatches);

module.exports = router;
