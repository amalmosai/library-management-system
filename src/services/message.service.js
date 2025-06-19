import Message from '../models/Message.js';
import User from '../models/User.js';
import { createCustomError, HttpCode } from '../utils/customError.js';

class MessageService {
    async sendMessage(messageData) {
        const user = await User.findOne({ _id: messageData.receiverId });
        if (!user && messageData.type === 'private') {
            throw createCustomError('receiver not found', HttpCode.NOT_FOUND);
        }

        return await Message.create(messageData);
    }

    async getPrivateMessages(currentUserId, otherUserId) {
        console.log(currentUserId, otherUserId);

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
