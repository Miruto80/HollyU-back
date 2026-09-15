import express from "express";
import { upload } from '../middlewares/uploadImage.middleware.js';

import {getProductosController, 
    getProductoByIdController, 
    postProductoController, 
    putProductoController, deleteProductoController, patchEstatusProductoController,deleteImagenController,putImagenController, patchImagenPrincipalController } from '../controllers/productos.controller.js';

const router = express.Router();

router.get("/productos", getProductosController);
router.get("/productos/:id", getProductoByIdController);
router.post("/productos", upload.array('imagenes', 8), postProductoController);
router.put("/productos/:id", upload.array('imagenes', 8), putProductoController);
router.delete("/productos/:id", deleteProductoController);
router.put("/productos/:id/estatus", patchEstatusProductoController);
router.delete("/productos/:id/imagenes/:imagenId", deleteImagenController);
router.put("/productos/:id/imagenes/:imagenId", upload.single('imagen'), putImagenController);
router.put("/productos/:id/imagenes/:imagenId/principal", patchImagenPrincipalController);

export default router;