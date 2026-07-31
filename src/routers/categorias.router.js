import express from "express";

import { getCategoriasController } from "../controllers/categorias.controller.js";


const router = express.Router();

router.get("/categorias", getCategoriasController);

export default router;