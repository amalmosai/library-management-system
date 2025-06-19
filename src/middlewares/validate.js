import Joi from 'joi';

export const userValidationSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .messages({
            'string.min': 'Name should have at least {#limit} characters',
            'string.max': 'Name cannot exceed {#limit} characters',
        })
        .trim(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .unique()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required',
            'string.unique': 'Email must be unique',
        }),

    password: Joi.string().min(6).max(20).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password should be at least {#limit} characters',
        'string.max': 'Password cannot exceed {#limit} characters',
        'any.required': 'Password is required',
    }),

    role: Joi.string()
        .valid('admin', 'librarian')
        .default('librarian')
        .messages({
            'any.only': 'Role must be either "admin" or "librarian"',
        })
        .optional(),
});

// Validation middleware
export const validateUser = (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) return next(error);
    next();
};
