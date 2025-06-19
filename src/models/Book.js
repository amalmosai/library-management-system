import { Schema, model } from 'mongoose';

const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
        },
        isbn: {
            type: String,
            required: [true, 'ISBN is required'],
            unique: true,
            trim: true,
            index: true,
        },
        category: {
            type: String,
            enum: ['fiction', 'non-fiction', 'science', 'history', 'other'],
            required: [true, 'Category is required'],
            default: 'other',
            index: true,
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [0, 'Quantity cannot be negative'],
            default: 1,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true, versionKey: false }
);

const Book = model('Book', bookSchema);
export default Book;
