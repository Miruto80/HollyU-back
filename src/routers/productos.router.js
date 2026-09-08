import express from "express";
import { upload } from '../middlewares/uploadImage.middleware.js';

import {getProductosController, getProductoByIdController, postProductoController} from '../controllers/productos.controller.js';

const router = express.Router();

router.get("/productos", getProductosController);
router.get("/productos/:id", getProductoByIdController);
router.post("/productos", upload.array('imagenes', 8), postProductoController);

export default router;