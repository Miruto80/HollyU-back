import express from 'express';
import { upload } from '../middlewares/uploadFile.middleware.js';
import { postPersonalizacionController } from '../controllers/personalizaciones.controller.js';

const router = express.Router();

router.post('/personalizaciones', upload.single('imagen_referencia'), postPersonalizacionController);

export default router;