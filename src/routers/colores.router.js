import express from "express";

import { getColoresController, postColoresController } from "../controllers/colores.controller.js";


const router = express.Router();

router.get("/colores", getColoresController);
router.post("/colores", postColoresController);

export default router;