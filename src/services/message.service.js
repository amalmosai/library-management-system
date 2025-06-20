import Message from '../models/Message.js';
import User from '../models/User.js';
import { createCustomError, HttpCode } from '../utils/customError.js';
import { getIO } from '../app.js';
class MessageService {
    async sendMessage(messageData) {
        if (messageData.type === 'private') {
            const user = await User.findById(messageData.receiverId);
            if (!user) {
                throw createCustomError(
                    'Receiver not found',
                    HttpCode.NOT_FOUND
                );
            }
        }
        const message = await Message.create(messageData);

        const receiverId = message.receiverId?.toString();
        const io = getIO();

        if (message.type === 'group') {
            io.to('main_group').emit('new_message', {
                senderId: message.senderId,
                text: message.text,
                type: 'group',
                createdAt: new Date(),
            });
        } else {
            io.to(receiverId).emit('new_message', {
                senderId: message.senderId,
                text: message.text,
                type: 'private',
                createdAt: new Date(),
            });
        }

        return message;
    }

    async getPrivateMessages(currentUserId, otherUserId) {
        const user = await User.findOne({ _id: otherUserId });
        if (!user) {
            throw createCustomError('User not found', HttpCode.NOT_FOUND);
        }
        return await Message.find({
            $or: [
                {
                    senderId: currentUserId,
                    receiverId: otherUserId,
                    type: 'private',
                },
                {
                    senderId: otherUserId,
                    receiverId: currentUserId,
                    type: 'private',
                },
            ],
        }).sort({ createdAt: 1 });
    }

    async getGroupMessages() {
        return await Message.find({
            type: 'group',
            groupId: 'main_group',
        }).sort({ createdAt: 1 });
    }
}

export default new MessageService();
