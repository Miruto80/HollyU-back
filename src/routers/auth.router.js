// src/routers/auth.router.js
import express from 'express';
import { loginController } from '../controllers/auth.controller.js';

const router = express.Router();
router.post('/auth/login', loginController);

export default router;