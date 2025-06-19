import { Schema, model } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            validate: {
                validator: (value) => {
                    let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                    return pattern.test(value);
                },
                message: 'Please fill a valid email address',
            },
            index: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        role: {
            type: String,
            enum: ['admin', 'librarian'],
            default: 'librarian',
        },
    },
    { timestamps: true, versionKey: false }
);

const User = model('User', userSchema);
export default User;
