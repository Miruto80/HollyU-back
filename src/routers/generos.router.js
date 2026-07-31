import express from "express";

import { getGenerosController } from "../controllers/generos.controller.js";


const router = express.Router();

router.get("/generos", getGenerosController);

export default router;