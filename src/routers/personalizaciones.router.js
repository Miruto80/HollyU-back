import express from 'express';
import { upload } from '../middlewares/uploadFile.middleware.js';
import {
	cotizarPersonalizacionController,
	getPersonalizacionesController,
	postPersonalizacionController,
	rechazarPersonalizacionController
} from '../controllers/personalizaciones.controller.js';

const router = express.Router();

router.post('/personalizaciones', upload.single('imagen_referencia'), postPersonalizacionController);
router.get('/personalizaciones', getPersonalizacionesController);
router.post('/personalizaciones/:id/cotizar', cotizarPersonalizacionController);
router.patch('/personalizaciones/:id/rechazar', rechazarPersonalizacionController);

export default router;