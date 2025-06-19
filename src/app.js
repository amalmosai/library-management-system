import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import errorhandler from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import { connectDB, PORT } from '../src/config/database.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Logger for development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Error handler
app.use(errorhandler);

connectDB();
/**
 * Start the server
 **/
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
