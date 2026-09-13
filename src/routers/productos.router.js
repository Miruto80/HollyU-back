import express from "express";
import { upload } from '../middlewares/uploadImage.middleware.js';

import {getProductosController, getProductoByIdController, postProductoController, putProductoController, deleteProductoController, patchEstatusProductoController} from '../controllers/productos.controller.js';

const router = express.Router();

router.get("/productos", getProductosController);
router.get("/productos/:id", getProductoByIdController);
router.post("/productos", upload.array('imagenes', 8), postProductoController);
router.put("/productos/:id", upload.array('imagenes', 8), putProductoController);
router.delete("/productos/:id", deleteProductoController);
router.put("/productos/:id/estatus", patchEstatusProductoController);

export default router;