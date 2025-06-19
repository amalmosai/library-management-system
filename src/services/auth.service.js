import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePasswords } from '../utils/password.js';
import { createCustomError, HttpCode } from '../utils/customError.js';
import { userValidationSchema } from '../middlewares/validate.js';

class AuthService {
    async registerUser(userData) {
        const { name, email, password, role } = userData;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw createCustomError(
                'Email already in use',
                HttpCode.BAD_REQUEST
            );
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'librarian',
        });

        return {
            user: newUser,
        };
    }

    async loginUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw createCustomError(
                'Invalid credentials',
                HttpCode.UNAUTHORIZED
            );
        }

        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
            throw createCustomError(
                'Invalid credentials',
                HttpCode.UNAUTHORIZED
            );
        }

        const token = await generateToken({
            id: user._id,
            role: user.role,
        });

        return { user, token };
    }
}

export default new AuthService();
