import asyncWrapper from '../utils/asynHandler.js';
import MessageService from '../services/message.service.js';
import { HttpCode } from '../utils/customError.js';

class MessageController {
    sendMessage = asyncWrapper(async (req, res) => {
        const messageData = {
            ...req.body,
            senderId: req.user.id,
        };
        const message = await MessageService.sendMessage(messageData);

        res.status(HttpCode.CREATED).json({
            message: 'Message sent successfully',
            data: message,
        });
    });

    getPrivateMessages = asyncWrapper(async (req, res) => {
        const messages = await MessageService.getPrivateMessages(
            req.user.id,
            req.params.userId
        );
        res.status(HttpCode.OK).json({
            count: messages.length,
            data: messages,
        });
    });

    getGroupMessages = asyncWrapper(async (req, res) => {
        const messages = await MessageService.getGroupMessages();
        res.status(HttpCode.OK).json({
            count: messages.length,
            data: messages,
        });
    });
}

export default new MessageController();
