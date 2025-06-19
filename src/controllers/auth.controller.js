import { HttpCode } from '../utils/customError.js';
import asyncWrapper from '../utils/asynHandler.js';
import AuthService from '../services/auth.service.js';

class AuthController {
    register = asyncWrapper(async (req, res, next) => {
        const { user } = await AuthService.registerUser(req.body);

        res.status(HttpCode.CREATED).json({
            message: 'User registered successfully',
            data: user,
        });
    });

    login = asyncWrapper(async (req, res) => {
        const { email, password } = req.body;

        const { user, token } = await AuthService.loginUser(email, password);

        res.status(HttpCode.OK).json({
            message: 'Login successful',
            data: user,
            token,
        });
    });
}

export default new AuthController();
