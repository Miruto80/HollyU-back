import express from "express";
import { upload } from '../middlewares/upload.midd.js';
import { postPagoController } from '../controllers/pagos.controller.js';

const router = express.Router();

router.post("/pagos", upload.single('comprobante'), postPagoController);

export default router;