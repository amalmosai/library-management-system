import express from 'express';
import BookController from '../controllers/book.controller.js';
import { authenticateUser, authorize } from '../middlewares/auth.js';
import { validateBook, validateBookIdParam } from '../middlewares/validate.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateUser,
        authorize('admin', 'librarian'),
        validateBook,
        BookController.createBook
    );

router
    .route('/')
    .get(
        authenticateUser,
        authorize('admin', 'librarian'),
        BookController.getAllBooks
    );

router
    .route('/:id')
    .get(
        authenticateUser,
        authorize('admin', 'librarian'),
        validateBookIdParam,
        BookController.getBook
    );

router
    .route('/:id')
    .put(
        authenticateUser,
        authorize('admin', 'librarian'),
        validateBookIdParam,
        BookController.updateBook
    );

router
    .route('/:id')
    .delete(
        authenticateUser,
        authorize('admin'),
        validateBookIdParam,
        BookController.deleteBook
    );

export default router;
