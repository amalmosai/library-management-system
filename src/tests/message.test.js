import MessageService from '../services/message.service.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { createCustomError, HttpCode } from '../utils/customError.js';
import { getIO, httpServer } from '../app.js';

jest.mock('../models/Message.js');
jest.mock('../models/User.js');
jest.mock('../app.js');
jest.mock('../utils/customError.js', () => ({
    createCustomError: jest.fn((message) => {
        const error = new Error(message);
        error.message = message;
        return error;
    }),
    HttpCode: {
        NOT_FOUND: 404,
    },
}));

jest.mock('../app.js', () => ({
    getIO: jest.fn(),
}));

describe('MessageService', () => {
    const mockEmit = jest.fn();
    const mockTo = jest.fn(() => ({ emit: mockEmit }));

    beforeEach(() => {
        jest.clearAllMocks();
        getIO.mockReturnValue({ to: mockTo });
    });

    describe('sendMessage', () => {
        it('should send a private message and emit to receiver', async () => {
            const messageData = {
                senderId: 'sender1',
                receiverId: 'receiver1',
                text: 'Hello',
                type: 'private',
            };

            User.findById.mockResolvedValue({ _id: 'receiver1' });
            Message.create.mockResolvedValue(messageData);

            const result = await MessageService.sendMessage(messageData);

            expect(User.findById).toHaveBeenCalledWith('receiver1');
            expect(Message.create).toHaveBeenCalledWith(messageData);
            expect(getIO).toHaveBeenCalled();
            expect(mockTo).toHaveBeenCalledWith('receiver1');
            expect(mockEmit).toHaveBeenCalledWith(
                'new_message',
                expect.objectContaining({
                    senderId: 'sender1',
                    text: 'Hello',
                    type: 'private',
                })
            );
            expect(result).toEqual(messageData);
        });

        it('should throw error if private message receiver does not exist', async () => {
            const messageData = {
                senderId: 'sender1',
                receiverId: 'receiver1',
                text: 'Hello',
                type: 'private',
            };

            User.findById.mockResolvedValue(null);

            await expect(
                MessageService.sendMessage(messageData)
            ).rejects.toThrow('Receiver not found');
            expect(User.findById).toHaveBeenCalledWith('receiver1');
        });

        it('should send a group message and emit to main_group', async () => {
            const messageData = {
                senderId: 'sender1',
                text: 'Hello Group',
                type: 'group',
                groupId: 'main_group',
            };

            Message.create.mockResolvedValue(messageData);

            const result = await MessageService.sendMessage(messageData);

            expect(Message.create).toHaveBeenCalledWith(messageData);
            expect(getIO).toHaveBeenCalled();
            expect(mockTo).toHaveBeenCalledWith('main_group');
            expect(mockEmit).toHaveBeenCalledWith(
                'new_message',
                expect.objectContaining({
                    senderId: 'sender1',
                    text: 'Hello Group',
                    type: 'group',
                })
            );
            expect(result).toEqual(messageData);
        });
    });

    describe('getPrivateMessages', () => {
        it('should return private messages between two users', async () => {
            const currentUserId = 'user1';
            const otherUserId = 'user2';

            User.findOne.mockResolvedValue({ _id: otherUserId });

            const messages = [
                {
                    senderId: 'user1',
                    receiverId: 'user2',
                    text: 'Hi',
                    type: 'private',
                },
                {
                    senderId: 'user2',
                    receiverId: 'user1',
                    text: 'Hello',
                    type: 'private',
                },
            ];

            const mockSort = jest.fn().mockResolvedValue(messages);
            Message.find.mockReturnValue({ sort: mockSort });

            const result = await MessageService.getPrivateMessages(
                currentUserId,
                otherUserId
            );

            expect(User.findOne).toHaveBeenCalledWith({ _id: otherUserId });
            expect(Message.find).toHaveBeenCalledWith({
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
            });
            expect(mockSort).toHaveBeenCalledWith({ createdAt: 1 });
            expect(result).toEqual(messages);
        });

        it('should throw error if other user not found', async () => {
            User.findOne.mockResolvedValue(null);

            await expect(
                MessageService.getPrivateMessages('user1', 'user2')
            ).rejects.toThrow('User not found');
        });
    });

    describe('getGroupMessages', () => {
        it('should return group messages for main_group', async () => {
            const messages = [
                {
                    text: 'Group message 1',
                    type: 'group',
                    groupId: 'main_group',
                },
                {
                    text: 'Group message 2',
                    type: 'group',
                    groupId: 'main_group',
                },
            ];

            const mockSort = jest.fn().mockResolvedValue(messages);
            Message.find.mockReturnValue({ sort: mockSort });

            const result = await MessageService.getGroupMessages();

            expect(Message.find).toHaveBeenCalledWith({
                type: 'group',
                groupId: 'main_group',
            });
            expect(mockSort).toHaveBeenCalledWith({ createdAt: 1 });
            expect(result).toEqual(messages);
        });
    });
});
