import express from "express";


import {getProductosController} from '../controllers/productos.controller.js';

const router = express.Router();

router.get("/productos", getProductosController);

export default router;