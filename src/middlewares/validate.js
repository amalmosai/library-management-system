import Joi from 'joi';
import mongoose from 'mongoose';

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

// Validation middleware
export const validateUser = (req, res, next) => {
    const { error } = userValidationSchema.validate(req.body, {
        abortEarly: false,
    });
    if (error) return next(error);
    next();
};

const bookValidationSchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(200)
        .messages({
            'string.min': 'Title should be at least {#limit} characters',
            'string.max': 'Title cannot exceed {#limit} characters',
        })
        .trim(),

    author: Joi.string()
        .min(2)
        .max(100)
        .messages({
            'string.min': 'Author name should be at least {#limit} characters',
            'string.max': 'Author name cannot exceed {#limit} characters',
        })
        .trim(),

    isbn: Joi.string().trim(),

    category: Joi.string()
        .valid('fiction', 'non-fiction', 'science', 'history', 'other')
        .default('other')
        .messages({
            'any.only':
                'Category must be one of: fiction, non-fiction, science, history, other',
        }),

    quantity: Joi.number().integer().min(0).default(1).messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity cannot be negative',
    }),
});

// Validation middleware
export const validateBook = (req, res, next) => {
    const { error } = bookValidationSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) return next(error);

    next();
};

export const messageValidationSchema = Joi.object({
    type: Joi.string().valid('private', 'group').required().messages({
        'any.only': 'Message type must be either "private" or "group"',
        'string.empty': 'Message type is required',
        'any.required': 'Message type is required',
    }),

    text: Joi.string().required().min(1).max(1000).trim().messages({
        'string.empty': 'Message text is required',
        'string.min': 'Message text cannot be empty',
        'string.max': 'Message cannot exceed {#limit} characters',
        'any.required': 'Message text is required',
    }),
}).when('.type', {
    switch: [
        {
            is: 'private',
            then: Joi.object({
                receiverId: Joi.string()
                    .custom((value, helpers) => {
                        if (!mongoose.isValidObjectId(value)) {
                            return helpers.error('any.invalid');
                        }
                        return value;
                    })
                    .required()
                    .messages({
                        'any.invalid': 'Invalid receiver ID format',
                        'any.required':
                            'Receiver ID is required for private messages',
                    }),
                groupId: Joi.forbidden().messages({
                    'any.unknown':
                        'Group ID must not be provided for private messages',
                }),
            }),
        },
        {
            is: 'group',
            then: Joi.object({
                groupId: Joi.string()
                    .valid('main_group')
                    .default('main_group')
                    .required()
                    .messages({
                        'any.only': 'Group ID must be "main_group"',
                        'any.required':
                            'Group ID is required for group messages',
                    }),
                receiverId: Joi.forbidden().messages({
                    'any.unknown':
                        'Receiver ID must not be provided for group messages',
                }),
            }),
        },
    ],
});

// Validation middleware
export const validateMessage = (req, res, next) => {
    const { error } = messageValidationSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return next(error);
    }

    next();
};

export const userIdParamSchema = Joi.object({
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

export const validateUserIdParam = (req, res, next) => {
    const { error } = userIdParamSchema.validate({ userId: req.params.userId });
    if (error) return next(error);
    next();
};
