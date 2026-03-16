import Joi from 'joi';

export const userSchema = Joi.object({
    name: Joi.string().required().min(3).max(50),
    email: Joi.string().required().email(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid('teacher', 'student').default('student'),
    department: Joi.alternatives().try(
        Joi.array().items(Joi.string().valid('IT', 'CS')),
        Joi.string().valid('IT', 'CS')
    ),
    batch: Joi.string().hex().length(24).allow('', null),
    subjects: Joi.array().items(Joi.string()).optional(),
    isMentor: Joi.boolean().default(false),
    parentEmail: Joi.string().email().allow('', null).optional()
});

export const lectureSchema = Joi.object({
    title: Joi.string().required().min(3).max(100),
    subject: Joi.string().required(),
    teacher: Joi.string().required().hex().length(24),
    batch: Joi.string().required().hex().length(24), // New
    division: Joi.string().valid('A', 'B', 'C', 'D', 'All').default('A'), // New
    type: Joi.string().valid('Lecture', 'Lab').default('Lecture'), // New
    startTime: Joi.date().required(),
    endTime: Joi.date().required().greater(Joi.ref('startTime')),
    classroom: Joi.string().required()
});

export const departmentSchema = Joi.object({
    name: Joi.string().required().min(2).max(100),
    code: Joi.string().required().uppercase().min(2).max(10),
    description: Joi.string().max(500)
});
