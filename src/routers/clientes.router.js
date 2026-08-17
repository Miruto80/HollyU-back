import express from "express";
import authMiddleware from '../middlewares/auth.midd.js';
import {
  getClientesController,
  getMeController,
  postBuscarOCrearController
} from "../controllers/clientes.controller.js";

const router = express.Router();

router.get("/clientes/me", authMiddleware, getMeController);
router.get("/clientes", getClientesController);
router.post("/clientes/buscar-o-crear", postBuscarOCrearController);

export default router;