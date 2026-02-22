const Joi = require('joi');

const userSchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid('teacher', 'student').default('student'),
    department: Joi.string().hex().length(24) // MongoDB ObjectId
});

const lectureSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    course: Joi.string().required().hex().length(24),
    teacher: Joi.string().required().hex().length(24),
    batch: Joi.string().required().hex().length(24), // New
    division: Joi.string().valid('A', 'B', 'C', 'D', 'All').default('A'), // New
    type: Joi.string().valid('Lecture', 'Lab').default('Lecture'), // New
    startTime: Joi.date().required(),
    endTime: Joi.date().required().greater(Joi.ref('startTime')),
    classroom: Joi.string().required()
});

const departmentSchema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    code: Joi.string().required().uppercase().min(2).max(10),
    description: Joi.string().max(500)
});

module.exports = {
    userSchema,
    lectureSchema,
    departmentSchema
};
