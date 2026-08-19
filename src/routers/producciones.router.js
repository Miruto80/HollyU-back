import express from "express";
import { getProduccionesController, patchAvanzarController } from "../controllers/producciones.controller.js";

const router = express.Router();

router.get("/producciones", getProduccionesController);
router.patch("/producciones/:id/avanzar", patchAvanzarController);

export default router;