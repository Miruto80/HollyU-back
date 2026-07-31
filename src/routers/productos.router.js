import express from "express";


import {getProductosController, getProductoByIdController} from '../controllers/productos.controller.js';

const router = express.Router();

router.get("/productos", getProductosController);
router.get("/productos/:id", getProductoByIdController);

export default router;