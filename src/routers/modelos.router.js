import express from "express";

import { getModelosController } from "../controllers/modelos.controller.js";


const router = express.Router();

router.get("/modelos", getModelosController);

export default router;