import asyncWrapper from '../utils/asynHandler.js';
import BookService from '../services/book.service.js';
import { HttpCode } from '../utils/customError.js';

class BookController {
    createBook = asyncWrapper(async (req, res) => {
        const bookData = { ...req.body, userId: req.user.id };
        const book = await BookService.createBook(bookData);

        res.status(HttpCode.CREATED).json({
            message: 'Book created successfully',
            data: book,
        });
    });

    getAllBooks = asyncWrapper(async (req, res) => {
        const { category, search } = req.query;
        const books = await BookService.getAllBooks({ category, search });
        res.status(HttpCode.OK).json({
            count: books.length,
            data: books,
        });
    });

    getBook = asyncWrapper(async (req, res) => {
        const book = await BookService.getBookById(req.params.id);
        res.status(HttpCode.OK).json({
            success: true,
            data: book,
        });
    });

    updateBook = asyncWrapper(async (req, res) => {
        const updatedBook = await BookService.updateBook(
            req.params.id,
            req.body,
            req.user.id,
            req.user.role
        );
        res.status(HttpCode.OK).json({
            message: 'Book updated successfully',
            data: updatedBook,
        });
    });

    deleteBook = asyncWrapper(async (req, res) => {
        await BookService.deleteBook(req.params.id);

        res.status(HttpCode.OK).json({
            message: 'Book deleted successfully',
            data: null,
        });
    });
}

export default new BookController();
