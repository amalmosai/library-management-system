import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { validateUser } from '../middlewares/user.validation.js';

const router = express.Router();

router.route('/register').post(validateUser, AuthController.register);

router.route('/login').post(validateUser, AuthController.login);

export default router;
