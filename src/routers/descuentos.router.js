import express from 'express';
import {
  getDescuentosController,
  getDescuentoByIdController,
  postDescuentoController,
  putDescuentoController,
  deleteDescuentoController
} from '../controllers/descuentos.controller.js';

const router = express.Router();

router.get('/descuentos', getDescuentosController);
router.get('/descuentos/:id', getDescuentoByIdController);
router.post('/descuentos', postDescuentoController);
router.put('/descuentos/:id', putDescuentoController);
router.delete('/descuentos/:id', deleteDescuentoController);

export default router;
