import express from "express";

import { getMetodos_pagoController } from "../controllers/metodos_pago.controller.js";

const router = express.Router();

router.get("/metodos_pago", getMetodos_pagoController);

export default router;