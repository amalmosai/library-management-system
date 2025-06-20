import Joi from 'joi';
import mongoose from 'mongoose';

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

const bookIdParamSchema = Joi.object({
    id: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required()
        .messages({
            'any.invalid': 'Invalid book ID format',
            'any.required': 'Book ID is required',
        }),
});

/**
 *
 * book validation middleware
 */
export const validateBook = (req, res, next) => {
    const { error } = bookValidationSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) return next(error);

    next();
};

/**
 *
 * book id param validation middleware
 */
export const validateBookIdParam = async (req, res, next) => {
    const { error } = bookIdParamSchema.validate({ id: req.params.id });
    if (error) return next(error);
    next();
};
