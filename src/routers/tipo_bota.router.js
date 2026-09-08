import express from "express";
import { getTipos_botaController } from "../controllers/tipo_bota.controller.js";

const router = express.Router();

router.get("/tipo_bota", getTipos_botaController);

export default router;
