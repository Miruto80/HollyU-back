import express from "express";

import { getCategoriasController, 
    postCategoriasController, 
    getCategoriasByIdController, 
    putCategoriasController, 
    deleteCategoriasController } from "../controllers/categorias.controller.js";


const router = express.Router();

router.get("/categorias", getCategoriasController);
router.get("/categorias/:id", getCategoriasByIdController);
router.post("/categorias", postCategoriasController);
router.put("/categorias/:id", putCategoriasController);
router.delete("/categorias/:id", deleteCategoriasController);

export default router;