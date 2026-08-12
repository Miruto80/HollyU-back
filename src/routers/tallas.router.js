import express from "express";

import { getTallasController, postTallasController } from "../controllers/tallas.controller.js";


const router = express.Router();

router.get("/tallas", getTallasController);
router.post("/tallas", postTallasController);

export default router;