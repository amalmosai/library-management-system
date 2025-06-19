import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import errorhandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import { connectDB, PORT } from '../src/config/database.js';
dotenv.config();

const app = express();

const httpServer = createServer(app);

/**
 *
 * Initialize Socket.IO server
 *
 * */
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

/**
 *
 * Handle new socket connections
 *
 * */
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (!userId) {
        console.log('Anonymous connection attempted');
        return socket.disconnect(true);
    }

    socket.join(userId);
    socket.join('main_group');

    console.log(`User ${userId} connected with socket ID: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`);
    });
});

/**
 *
 *Get active Socket.IO instance (used in other modules to emit events)
 *
 * */

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

/**
 *
 * middlewares
 *
 * */
app.use(cors());
app.use(helmet());
app.use(express.json());

/**
 *
 * Logger for development
 *
 * */

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/**
 *
 * API Routes
 *
 * */
import authRoute from './routes/auth.route.js';
import bookRoute from './routes/book.route.js';
import messageRoute from './routes/message.route.js';

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/book', bookRoute);
app.use('/api/v1/messages', messageRoute);

/**
 *
 * global error handler
 *
 * */
app.use(errorhandler);

/**
 * database connection
 **/
connectDB();

/**
 * Start the server
 **/
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
