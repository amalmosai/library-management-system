import Joi from 'joi';
import mongoose from 'mongoose';

const userValidationSchema = Joi.object({
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
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required',
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

const userIdParamSchema = Joi.object({
    userId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.invalid': 'Invalid user ID format',
            'any.required': 'User ID is required',
        }),
});

/**
 *
 * user validation middleware
 */
export const validateUser = (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) return next(error);
    next();
};

/**
 *
 * user id param validation middleware
 */
export const validateUserIdParam = (req, res, next) => {
    const { error } = userIdParamSchema.validate({ userId: req.params.userId });
    if (error) return next(error);
    next();
};
