// src/routers/auth.router.js
import express from 'express';
import { loginController, registerController } from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/auth/login', loginController);
router.post('/auth/register', registerController);

export default router;