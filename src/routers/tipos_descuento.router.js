import express from 'express';
import { Tipos_descuento } from '../models/index.js';

const router = express.Router();

router.get('/tipos-descuento', async (req, res) => {
  try {
    const tipos = await Tipos_descuento.findAll({ order: [['id', 'ASC']] });
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/tipos-descuento', async (req, res) => {
  try {
    const tipo = await Tipos_descuento.create(req.body);
    res.status(201).json(tipo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
