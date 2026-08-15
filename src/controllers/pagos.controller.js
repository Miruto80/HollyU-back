import { postPagos } from '../services/pagos.service.js';

export const postPagoController = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      archivo: req.file
    };

    const pago = await postPagos(payload);
    res.status(201).json(pago);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};