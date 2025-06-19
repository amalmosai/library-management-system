import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import errorhandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import { connectDB, PORT } from '../src/config/database.js';
dotenv.config();

const app = express();

import authRoute from './routes/auth.route.js';
import bookRoute from './routes/book.route.js';

app.use(cors());
app.use(helmet());
app.use(express.json());

// Logger for development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// API Routes
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/book', bookRoute);

// Error handler
app.use(errorhandler);

connectDB();
/**
 * Start the server
 **/
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
