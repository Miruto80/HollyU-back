import express from "express";

import { getClientesController } from "../controllers/clientes.controller.js";


const router = express.Router();

router.get("/clientes", getClientesController);

export default router;