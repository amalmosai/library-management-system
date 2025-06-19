import express from 'express';
import MessageController from '../controllers/message.controller.js';
import { authenticateUser, authorize } from '../middlewares/auth.js';
import {
    validateMessage,
    validateUserIdParam,
} from '../middlewares/validate.js';

const router = express.Router();

router
    .route('/')
    .post(
        authenticateUser,
        authorize('admin', 'librarian'),
        validateMessage,
        MessageController.sendMessage
    );

router
    .route('/private/:userId')
    .get(
        authenticateUser,
        validateUserIdParam,
        MessageController.getPrivateMessages
    );

router
    .route('/group')
    .get(authenticateUser, MessageController.getGroupMessages);

export default router;
