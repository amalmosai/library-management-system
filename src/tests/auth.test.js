import AuthService from '../services/auth.service.js';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePasswords } from '../utils/password.js';

jest.mock('../models/User.js');
jest.mock('../utils/jwt.js');
jest.mock('../utils/password.js');

describe('AuthService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('registerUser ', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'librarian',
            };

            User.findOne.mockResolvedValue(null); // No existing user
            hashPassword.mockResolvedValue('hashedPassword');
            User.create.mockResolvedValue(userData);

            const result = await AuthService.registerUser(userData);

            expect(result).toEqual({ user: userData });
            expect(User.findOne).toHaveBeenCalledWith({
                email: userData.email,
            });
            expect(hashPassword).toHaveBeenCalledWith(userData.password);
            expect(User.create).toHaveBeenCalledWith({
                name: userData.name,
                email: userData.email,
                password: 'hashedPassword',
                role: userData.role,
            });
        });

        it('should throw an error if the email is already in use', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            User.findOne.mockResolvedValue(userData);

            await expect(AuthService.registerUser(userData)).rejects.toThrow(
                'Email already in use'
            );
            expect(User.findOne).toHaveBeenCalledWith({
                email: userData.email,
            });
        });
    });

    describe('loginUser ', () => {
        it('should log in a user successfully', async () => {
            const email = 'john@example.com';
            const password = 'password123';
            const user = {
                _id: 'userId',
                email,
                password: 'hashedPassword',
                role: 'librarian',
            };

            User.findOne.mockResolvedValue(user);
            comparePasswords.mockResolvedValue(true);
            generateToken.mockResolvedValue('token');

            const result = await AuthService.loginUser(email, password);

            expect(result).toEqual({ user, token: 'token' });
            expect(User.findOne).toHaveBeenCalledWith({ email });
            expect(comparePasswords).toHaveBeenCalledWith(
                password,
                user.password
            );
            expect(generateToken).toHaveBeenCalledWith({
                id: user._id,
                role: user.role,
            });
        });

        it('should throw an error if the user does not exist', async () => {
            const email = 'john@example.com';
            const password = 'password123';

            User.findOne.mockResolvedValue(null);

            await expect(
                AuthService.loginUser(email, password)
            ).rejects.toThrow('Invalid credentials');
            expect(User.findOne).toHaveBeenCalledWith({ email });
        });

        it('should throw an error if the password is incorrect', async () => {
            const email = 'john@example.com';
            const password = 'password123';
            const user = {
                _id: 'userId',
                email,
                password: 'hashedPassword',
                role: 'librarian',
            };

            User.findOne.mockResolvedValue(user);
            comparePasswords.mockResolvedValue(false);

            await expect(
                AuthService.loginUser(email, password)
            ).rejects.toThrow('Invalid credentials');
            expect(User.findOne).toHaveBeenCalledWith({ email });
        });

        it('should throw if the user is missing a password field', async () => {
            const email = 'john@example.com';
            const password = 'password123';
            const user = { _id: 'userId', email, role: 'librarian' };

            User.findOne.mockResolvedValue(user);

            await expect(
                AuthService.loginUser(email, password)
            ).rejects.toThrow('Invalid credentials');
        });

        it('should throw if token generation fails', async () => {
            const email = 'john@example.com';
            const password = 'password123';
            const user = {
                _id: 'userId',
                email,
                password: 'hashedPassword',
                role: 'librarian',
            };

            User.findOne.mockResolvedValue(user);
            comparePasswords.mockResolvedValue(true);
            generateToken.mockImplementation(() => {
                throw new Error('Token generation failed');
            });

            await expect(
                AuthService.loginUser(email, password)
            ).rejects.toThrow('Token generation failed');
        });
    });
});
