import express from "express";
import { upload } from '../middlewares/uploadFile.middleware.js';

import { getPedidosController, getPedidosByClienteController, getPedidoByIdController, postPedidoController, putPagoEstadoController } from "../controllers/pedidos.controller.js";

const router = express.Router();

router.get("/pedidos", getPedidosController);
router.get("/clientes/:clienteId/pedidos", getPedidosByClienteController);
router.get("/pedidos/:id", getPedidoByIdController);
router.post("/pedidos", upload.single('comprobante'), postPedidoController);
router.patch("/pedidos/:id/estado-pago", putPagoEstadoController);

export default router;