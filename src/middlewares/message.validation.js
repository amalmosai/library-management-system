import Joi from 'joi';
import mongoose from 'mongoose';

const messageValidationSchema = Joi.object({
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
                        'any.only': 'Group ID must be main_group',
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

/**
 *
 * message validation middleware
 */
export const validateMessage = (req, res, next) => {
    const { error } = messageValidationSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) return next(error);

    next();
};
