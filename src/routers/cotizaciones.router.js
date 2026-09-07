import express from 'express';
import {
	getCotizacionesController,
	pasarCotizacionAProduccionController
} from '../controllers/cotizaciones.controller.js';

const router = express.Router();

router.get('/cotizaciones', getCotizacionesController);
router.patch('/cotizaciones/:id/produccion', pasarCotizacionAProduccionController);

export default router;
