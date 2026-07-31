import express from "express";

import { getTallasController } from "../controllers/tallas.controller.js";


const router = express.Router();

router.get("/tallas", getTallasController);

export default router;