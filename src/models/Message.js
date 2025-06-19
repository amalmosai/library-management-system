import { Schema, model } from 'mongoose';

const MessageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Sender ID is required'],
            index: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
            default: null,
        },
        groupId: {
            type: String,
            enum: ['main_group'],
            index: true,
            default: null,
        },
        type: {
            type: String,
            enum: ['private', 'group'],
            required: [true, 'Message type is required'],
            index: true,
        },
        text: {
            type: String,
            required: [true, 'Message text is required'],
            trim: true,
            maxlength: [1000, 'Message cannot exceed 1000 characters'],
        },
    },
    { timestamps: true, versionKey: false }
);

const Message = model('Message', MessageSchema);
export default Message;
