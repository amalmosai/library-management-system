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
