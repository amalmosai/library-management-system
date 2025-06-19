import Book from '../models/Book.js';
import { createCustomError, HttpCode } from '../utils/customError.js';
class BookService {
    async createBook(bookData) {
        const existingBook = await Book.findOne({ isbn: bookData.isbn });
        if (existingBook) {
            throw createCustomError('ISBN already exists', HttpCode.CONFLICT);
        }

        return await Book.create(bookData);
    }

    async getAllBooks({ category, search }) {
        const query = {};

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
            ];
        }

        return await Book.find(query).populate('userId', 'name email');
    }

    async getBookById(id) {
        const book = await Book.findById(id).populate('userId', 'name email');
        if (!book) {
            throw createCustomError('Book not found', HttpCode.NOT_FOUND);
        }
        return book;
    }

    async updateBook(id, updateData, userId, userRole) {
        const book = await Book.findById(id);
        if (!book) {
            throw createCustomError('Book not found', HttpCode.NOT_FOUND);
        }

        if (userRole !== 'admin' && book.userId.toString() !== userId) {
            throw createCustomError(
                'Not authorized to update this book',
                HttpCode.FORBIDDEN
            );
        }

        if (updateData.isbn) {
            const existingBook = await Book.findOne({ isbn: updateData.isbn });
            if (existingBook && existingBook._id.toString() !== id) {
                throw createCustomError(
                    'ISBN already exists',
                    HttpCode.CONFLICT
                );
            }
        }

        return await Book.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
    }

    async deleteBook(id) {
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            throw createCustomError('Book not found', HttpCode.NOT_FOUND);
        }
        return book;
    }
}

export default new BookService();
