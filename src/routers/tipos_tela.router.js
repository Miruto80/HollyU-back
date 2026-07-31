import express from "express";

import { getTipos_telaController } from "../controllers/tipos_tela.controller.js";


const router = express.Router();

router.get("/tipos_tela", getTipos_telaController);

export default router;