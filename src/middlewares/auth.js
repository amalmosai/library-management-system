import Jwt from 'jsonwebtoken';
import { createCustomError, HttpCode } from '../errors/customError.js';

export const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(
            createCustomError('No token provided', HttpCode.UNAUTHORIZED)
        );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(
            createCustomError(
                'Authorization token not found',
                HttpCode.UNAUTHORIZED
            )
        );
    }

    try {
        const decoded = Jwt.verify(token, process.env.JWT_SECRET);
        req.body.user = decoded;
        next();
    } catch (error) {
        return next(
            createCustomError(
                'Not authorized to access this route',
                HttpCode.UNAUTHORIZED
            )
        );
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.body.user || !roles.includes(req.body.user.role)) {
            return next(
                createCustomError(
                    'Unauthorized to access this route',
                    HttpCode.UNAUTHORIZED
                )
            );
        }
        next();
    };
};
