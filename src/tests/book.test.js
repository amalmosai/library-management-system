import BookService from '../services/book.service.js';
import Book from '../models/Book.js';
import { getIO } from '../app.js';

jest.mock('../models/Book.js');
jest.mock('../app.js');
jest.mock('../utils/customError.js', () => ({
    createCustomError: jest.fn((message) => {
        const error = new Error(message);
        error.message = message;
        return error;
    }),
    HttpCode: {
        CONFLICT: 409,
        NOT_FOUND: 404,
        FORBIDDEN: 403,
    },
}));

jest.mock('../app.js', () => ({
    getIO: jest.fn(),
}));

describe('BookService', () => {
    const mockEmit = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        getIO.mockReturnValue({ emit: mockEmit });
    });

    describe('createBook', () => {
        it('should create a new book and emit socket event', async () => {
            const bookData = {
                isbn: '12345',
                title: 'Test Book',
                userId: 'user1',
            };
            Book.findOne.mockResolvedValue(null);
            Book.create.mockResolvedValue({ ...bookData, _id: 'bookId' });

            const result = await BookService.createBook(bookData);

            expect(Book.findOne).toHaveBeenCalledWith({ isbn: bookData.isbn });
            expect(Book.create).toHaveBeenCalledWith(bookData);
            expect(mockEmit).toHaveBeenCalledWith(
                'new_book',
                expect.objectContaining({
                    message: expect.stringContaining(bookData.title),
                    bookId: 'bookId',
                })
            );
            expect(result).toEqual({ ...bookData, _id: 'bookId' });
        });

        it('should throw error if ISBN already exists', async () => {
            const bookData = { isbn: '12345' };
            Book.findOne.mockResolvedValue(bookData);

            await expect(BookService.createBook(bookData)).rejects.toThrow(
                'ISBN already exists'
            );
            expect(Book.findOne).toHaveBeenCalledWith({ isbn: bookData.isbn });
        });
    });

    describe('getAllBooks', () => {
        it('should query books with category and search filters', async () => {
            const books = [{ title: 'Book1' }];
            Book.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(books),
            });

            const result = await BookService.getAllBooks({
                category: 'fiction',
                search: 'book',
            });

            expect(Book.find).toHaveBeenCalledWith({
                category: 'fiction',
                $or: [
                    { title: { $regex: 'book', $options: 'i' } },
                    { author: { $regex: 'book', $options: 'i' } },
                ],
            });
            expect(result).toEqual(books);
        });

        it('should query books with no filters', async () => {
            const books = [{ title: 'Book1' }];
            Book.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(books),
            });

            const result = await BookService.getAllBooks({});

            expect(Book.find).toHaveBeenCalledWith({});
            expect(result).toEqual(books);
        });
    });

    describe('getBookById', () => {
        it('should return book if found', async () => {
            const book = { _id: 'id', title: 'Book1' };
            Book.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(book),
            });

            const result = await BookService.getBookById('id');

            expect(Book.findById).toHaveBeenCalledWith('id');
            expect(result).toEqual(book);
        });

        it('should throw error if book not found', async () => {
            Book.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(null),
            });

            await expect(BookService.getBookById('id')).rejects.toThrow(
                'Book not found'
            );
        });
    });

    describe('updateBook', () => {
        const id = 'bookId';
        const userId = 'user1';

        it('should update book if authorized and valid', async () => {
            const book = { _id: id, userId: userId };
            const updateData = { title: 'New Title' };
            Book.findById.mockResolvedValue(book);
            Book.findOne.mockResolvedValue(null); // No conflicting ISBN
            Book.findByIdAndUpdate.mockResolvedValue({
                ...book,
                ...updateData,
            });

            const result = await BookService.updateBook(
                id,
                updateData,
                userId,
                'librarian'
            );

            expect(Book.findById).toHaveBeenCalledWith(id);
            expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(
                id,
                updateData,
                { new: true, runValidators: true }
            );
            expect(result).toEqual({ ...book, ...updateData });
        });

        it('should allow admin to update any book', async () => {
            const book = { _id: id, userId: 'otherUser' };
            const updateData = { title: 'New Title' };
            Book.findById.mockResolvedValue(book);
            Book.findOne.mockResolvedValue(null);
            Book.findByIdAndUpdate.mockResolvedValue({
                ...book,
                ...updateData,
            });

            const result = await BookService.updateBook(
                id,
                updateData,
                userId,
                'admin'
            );

            expect(result).toEqual({ ...book, ...updateData });
        });

        it('should throw if book not found', async () => {
            Book.findById.mockResolvedValue(null);

            await expect(
                BookService.updateBook(id, {}, userId, 'librarian')
            ).rejects.toThrow('Book not found');
        });

        it('should throw if unauthorized user tries to update', async () => {
            const book = { _id: id, userId: 'otherUser' };
            Book.findById.mockResolvedValue(book);

            await expect(
                BookService.updateBook(id, {}, userId, 'librarian')
            ).rejects.toThrow('Not authorized to update this book');
        });

        it('should throw if updating to an existing ISBN', async () => {
            const book = { _id: id, userId };
            const conflictingBook = { _id: 'otherId' };
            const updateData = { isbn: 'newIsbn' };

            Book.findById.mockResolvedValue(book);
            Book.findOne.mockResolvedValue(conflictingBook);

            await expect(
                BookService.updateBook(id, updateData, userId, 'admin')
            ).rejects.toThrow('ISBN already exists');
        });
    });

    describe('deleteBook', () => {
        it('should delete a book if found', async () => {
            const book = { _id: 'id' };
            Book.findByIdAndDelete.mockResolvedValue(book);

            const result = await BookService.deleteBook('id');

            expect(Book.findByIdAndDelete).toHaveBeenCalledWith('id');
            expect(result).toEqual(book);
        });

        it('should throw error if book not found', async () => {
            Book.findByIdAndDelete.mockResolvedValue(null);

            await expect(BookService.deleteBook('id')).rejects.toThrow(
                'Book not found'
            );
        });
    });
});
