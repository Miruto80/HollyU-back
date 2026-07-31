import express from "express";
import { upload } from '../middlewares/uploadFile.middleware.js';

import {getProductosController, getProductoByIdController, postProductoController} from '../controllers/productos.controller.js';

const router = express.Router();

router.get("/productos", getProductosController);
router.get("/productos/:id", getProductoByIdController);
router.post("/productos", (req, res, next) => {
  upload.single('imagen')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, postProductoController);

export default router;