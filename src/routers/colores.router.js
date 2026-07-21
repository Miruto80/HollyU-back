import express from "express";

import { getColoresController } from "../controllers/colores.controller.js";


const router = express.Router();

router.get("/colores", getColoresController);

export default router;