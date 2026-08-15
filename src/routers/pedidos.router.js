import express from "express";

import { getPedidosController, getPedidosByClienteController, getPedidoByIdController, postPedidoController } from "../controllers/pedidos.controller.js";

const router = express.Router();

router.get("/pedidos", getPedidosController);
router.get("/clientes/:clienteId/pedidos", getPedidosByClienteController);
router.get("/pedidos/:id", getPedidoByIdController);
router.post("/pedidos", postPedidoController);

export default router;