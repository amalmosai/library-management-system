import Jwt from 'jsonwebtoken';

export const generateToken = async (payload) => {
    if (process.env.JWT_SECRET !== undefined) {
        const token = Jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        return token;
    }
};
