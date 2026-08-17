import express from "express";
import { getPagosController } from "../controllers/pagos.controller.js";

const router = express.Router();

router.get("/pagos", getPagosController);

export default router;