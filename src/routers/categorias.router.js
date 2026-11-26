import express from "express";
import { upload } from "../middlewares/uploadImage.middleware.js";

import { getCategoriasController, 
    postCategoriasController, 
    getCategoriasByIdController, 
    putCategoriasController, 
    deleteCategoriasController } from "../controllers/categorias.controller.js";


const router = express.Router();

router.get("/categorias", getCategoriasController);
router.get("/categorias/:id", getCategoriasByIdController);
router.post("/categorias", upload.single("imagen"), postCategoriasController);
router.put("/categorias/:id", upload.single("imagen"), putCategoriasController);
router.delete("/categorias/:id", deleteCategoriasController);

export default router;