import { CustomError, HttpCode } from '../utils/customError.js';
import { Error } from 'mongoose';

const errorHandler = (err, req, res, next) => {
    let customError = {
        statusCode: HttpCode.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong try again later',
    };

    if (err instanceof CustomError) {
        customError.message = err.message;
        customError.statusCode = err.statusCode;
    }

    if (err instanceof Error.CastError) {
        customError.message = `Invalid ${err.path}: ${err.value}`;
        customError.statusCode = HttpCode.BAD_REQUEST;
    }

    if (err.isJoi) {
        const joiError = err;
        customError.message = joiError.details
            .map((detail) => detail.message)
            .join(', ');
        customError.statusCode = HttpCode.BAD_REQUEST;
    }

    if (err instanceof Error.ValidationError) {
        customError.message = Object.values(err.errors)
            .map((item) => item.message)
            .join(', ');
        customError.statusCode = HttpCode.BAD_REQUEST;
    }

    if (err.name === 'MongoServerError' && err.code === 11000) {
        const duplicateField = Object.keys(err.keyPattern)[0];
        customError.message = `${duplicateField} already exists`;
        customError.statusCode = HttpCode.CONFLICT;
    }

    if (err.name === 'MongoServerError') {
        customError.message = `Database error: ${err.message}`;
        customError.statusCode = HttpCode.BAD_REQUEST;
    }

    if (err.name === 'JsonWebTokenError') {
        customError.message = 'Invalid token. Please log in again!';
        customError.statusCode = HttpCode.UNAUTHORIZED;
    }

    if (err.name === 'TokenExpiredError') {
        customError.message = 'Your token has expired! Please log in again.';
        customError.statusCode = HttpCode.UNAUTHORIZED;
    }

    if (req?.url.startsWith('/api/v1/') && !req.route) {
        customError.statusCode = HttpCode.NOT_FOUND;
        customError.message = 'Not Found';
    }

    return res?.status(customError.statusCode).json({
        message: customError.message,
        statusCode: customError.statusCode,
    });
};

export default errorHandler;
