import express from "express";

import { getProduccionesController } from "../controllers/producciones.controller.js";

const router = express.Router();

router.get("/producciones", getProduccionesController);

export default router;